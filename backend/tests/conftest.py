import pytest
from httpx import AsyncClient, ASGITransport
# pyrefly: ignore [missing-import]
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from database import Base, get_db
from app.main import app
import os

DATABASE_URL = "sqlite+aiosqlite:///./test.db"

engine = create_async_engine(DATABASE_URL, echo=False)
TestingSessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)

@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()
    if os.path.exists("./test.db"):
        os.remove("./test.db")

@pytest_asyncio.fixture
async def db_session():
    async with TestingSessionLocal() as session:
        yield session

@pytest.fixture
def override_get_db(db_session):
    async def _override_get_db():
        yield db_session
    return _override_get_db

@pytest_asyncio.fixture
async def async_client(override_get_db):
    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()

@pytest_asyncio.fixture
async def auth_headers(async_client: AsyncClient):
    register_payload = {
        "name": "Admin User",
        "email": "admin@example.com",
        "password": "adminpassword",
        "role": "admin"
    }
    await async_client.post("/auth/register", json=register_payload)
    login_payload = {
        "username": "admin@example.com",
        "password": "adminpassword"
    }
    response = await async_client.post("/auth/login", data=login_payload)
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
