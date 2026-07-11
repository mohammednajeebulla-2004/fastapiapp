import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_job(async_client: AsyncClient, auth_headers: dict):
    payload = {
        "title": "Software Engineer",
        "salary": 100000,
        "description": "Develop software",
        "company_id": 1 # we won't strictly validate foreign keys if sqlite is missing PRAGMA foreign_keys, but let's assume it works
    }
    response = await async_client.post("/job/", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Software Engineer"
    assert "id" in data

@pytest.mark.asyncio
async def test_get_all_job(async_client: AsyncClient, auth_headers: dict):
    # First create one
    payload = {
        "title": "Data Scientist",
        "salary": 120000,
        "description": "Analyze data"
    }
    await async_client.post("/job/", json=payload, headers=auth_headers)
    
    response = await async_client.get("/job/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1

@pytest.mark.asyncio
async def test_get_job(async_client: AsyncClient, auth_headers: dict):
    payload = {
        "title": "Product Manager",
        "salary": 110000,
        "description": "Manage products"
    }
    create_response = await async_client.post("/job/", json=payload, headers=auth_headers)
    job_id = create_response.json()["id"]

    response = await async_client.get(f"/job/{job_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Product Manager"

@pytest.mark.asyncio
async def test_update_job(async_client: AsyncClient, auth_headers: dict):
    payload = {
        "title": "Frontend Developer",
        "salary": 90000,
        "description": "UI/UX"
    }
    create_response = await async_client.post("/job/", json=payload, headers=auth_headers)
    job_id = create_response.json()["id"]

    update_payload = {
        "title": "Senior Frontend Developer"
    }
    response = await async_client.put(f"/job/{job_id}", json=update_payload, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Senior Frontend Developer"

@pytest.mark.asyncio
async def test_delete_job(async_client: AsyncClient, auth_headers: dict):
    payload = {
        "title": "DevOps Engineer",
        "salary": 105000,
        "description": "Infrastructure"
    }
    create_response = await async_client.post("/job/", json=payload, headers=auth_headers)
    job_id = create_response.json()["id"]

    response = await async_client.delete(f"/job/{job_id}", headers=auth_headers)
    assert response.status_code == 204

    # Verify it's deleted
    get_response = await async_client.get(f"/job/{job_id}", headers=auth_headers)
    assert get_response.status_code == 404
