import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from fastembed import TextEmbedding
from sqlalchemy.orm import Session
from models.job import Job

load_dotenv(override=True)

COLLECTION_NAME = "job_descriptions"
VECTOR_SIZE = 384

QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", None)

try:
    qdrant = QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
        timeout=5.0
    )
    qdrant.get_collections()
except Exception as e:
    print(f"Warning: Could not connect to Qdrant: {e}")
    qdrant = None

embeddings_model = TextEmbedding("BAAI/bge-small-en-v1.5")


def ensure_collection():
    if qdrant is None:
        raise ConnectionError(
            f"Qdrant server is not available at {QDRANT_URL}.\n"
            "Start it using:\n"
            "docker run -p 6333:6333 qdrant/qdrant"
        )

    collections = [c.name for c in qdrant.get_collections().collections]

    if COLLECTION_NAME in collections:

        info = qdrant.get_collection(COLLECTION_NAME)

        try:
            vectors = info.config.params.vectors

            if hasattr(vectors, "size"):
                existing_size = vectors.size

            elif isinstance(vectors, dict):
                existing_size = next(iter(vectors.values())).size

            else:
                existing_size = VECTOR_SIZE

        except AttributeError:
            existing_size = info.config.params.vector.size

        if existing_size != VECTOR_SIZE:
            print("Recreating collection because vector size changed...")
            qdrant.delete_collection(COLLECTION_NAME)
            collections.remove(COLLECTION_NAME)

    if COLLECTION_NAME not in collections:
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=VECTOR_SIZE,
                distance=Distance.COSINE,
            ),
        )


def embed_text(text: str) -> list[float]:
    return next(embeddings_model.embed([text])).tolist()


from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

async def embed_all_jobs(db: AsyncSession) -> int:
    ensure_collection()

    result = await db.execute(select(Job))
    jobs = result.scalars().all()

    if not jobs:
        return 0

    points = []

    for job in jobs:

        text = f"{job.title} {job.description or ''}"

        vector = embed_text(text)

        points.append(
            PointStruct(
                id=job.id,
                vector=vector,
                payload={
                    "job_id": job.id,
                    "title": job.title,
                    "description": job.description or "",
                    "salary": job.salary,
                },
            )
        )

    qdrant.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
    )

    return len(points)

def embed_single_job(job: Job):
    if qdrant is None:
        return
    ensure_collection()
    text = f"{job.title} {job.description or ''}"
    vector = embed_text(text)
    qdrant.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=job.id,
                vector=vector,
                payload={
                    "job_id": job.id,
                    "title": job.title,
                    "description": job.description or "",
                    "salary": job.salary,
                },
            )
        ],
    )

def delete_job_embedding(job_id: int):
    if qdrant is None:
        return
    try:
        qdrant.delete(
            collection_name=COLLECTION_NAME,
            points_selector=[job_id],
        )
    except Exception:
        pass


def search_jobs(query: str, top_k: int = 5) -> list[dict]:

    if qdrant is None:
        raise ConnectionError("Qdrant server is not running.")

    ensure_collection()

    query_vector = embed_text(query)

    try:
        results = qdrant.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            limit=top_k,
        )
        hits = results.points

    except Exception:
        hits = qdrant.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_vector,
            limit=top_k,
        )

    return [
        {
            "job_id": hit.payload.get("job_id"),
            "title": hit.payload.get("title"),
            "description": hit.payload.get("description"),
            "salary": hit.payload.get("salary"),
            "score": round(hit.score, 4),
        }
        for hit in hits
    ]


def match_jobs_for_profile(
    skills: str,
    experience: str,
    top_k: int = 5,
) -> list[dict]:

    ensure_collection()

    profile_text = f"Skills: {skills}. Experience: {experience}"

    profile_vector = embed_text(profile_text)

    try:
        results = qdrant.query_points(
            collection_name=COLLECTION_NAME,
            query=profile_vector,
            limit=top_k,
        )
        hits = results.points

    except Exception:
        hits = qdrant.search(
            collection_name=COLLECTION_NAME,
            query_vector=profile_vector,
            limit=top_k,
        )

    return [
        {
            "job_id": hit.payload.get("job_id"),
            "title": hit.payload.get("title"),
            "description": hit.payload.get("description"),
            "salary": hit.payload.get("salary"),
            "match_score": round(hit.score * 100, 2),
        }
        for hit in hits
    ]