import pytest
from httpx import AsyncClient
from unittest.mock import patch

@pytest.mark.asyncio
@patch("routers.rag.embed_all_jobs")
async def test_embed_jobs(mock_embed, async_client: AsyncClient, auth_headers: dict):
    mock_embed.return_value = 10
    response = await async_client.post("/rag/embed-jobs", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["count"] == 10

@pytest.mark.asyncio
@patch("routers.rag.search_jobs")
async def test_semantic_search(mock_search, async_client: AsyncClient):
    mock_search.return_value = [{"id": 1, "title": "Job 1", "company_id": 1, "score": 0.99}]
    payload = {"query": "test"}
    response = await async_client.post("/rag/search", json=payload)
    assert response.status_code == 200
    assert len(response.json()["results"]) == 1

@pytest.mark.asyncio
@patch("routers.rag.rag_job_search")
async def test_rag_ask(mock_rag, async_client: AsyncClient):
    mock_rag.return_value = "Rag Answer"
    payload = {"question": "What is the best job?"}
    response = await async_client.post("/rag/ask", json=payload)
    assert response.status_code == 200
    assert response.json()["answer"] == "Rag Answer"

@pytest.mark.asyncio
@patch("routers.rag.analyse_resume")
async def test_resume_analyse(mock_analyse, async_client: AsyncClient):
    mock_analyse.return_value = "Good resume"
    payload = {"resume_text": "My resume text"}
    response = await async_client.post("/rag/analyse-resume", json=payload)
    assert response.status_code == 200
    assert response.json()["analysis"] == "Good resume"

@pytest.mark.asyncio
@patch("routers.rag.match_jobs_for_profile")
async def test_job_match(mock_match, async_client: AsyncClient):
    mock_match.return_value = [{"id": 1, "title": "Job 1", "company_id": 1, "score": 0.95}]
    payload = {"skills": "Python", "experience": "5 years"}
    response = await async_client.post("/rag/job-match", json=payload)
    assert response.status_code == 200
    assert len(response.json()["matches"]) == 1
