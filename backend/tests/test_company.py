import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_company(async_client: AsyncClient, auth_headers: dict):
    payload = {
        "name": "Test Company",
        "email": "contact@testcompany.com",
        "phone": "1234567890",
        "location": "Test City"
    }
    response = await async_client.post("/company/", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Company"
    assert "id" in data

@pytest.mark.asyncio
async def test_get_all_company(async_client: AsyncClient, auth_headers: dict):
    # First create one
    payload = {
        "name": "Another Company",
        "email": "another@company.com",
        "phone": "0987654321",
        "location": "Another City"
    }
    await async_client.post("/company/", json=payload, headers=auth_headers)
    
    response = await async_client.get("/company/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1

@pytest.mark.asyncio
async def test_get_company(async_client: AsyncClient, auth_headers: dict):
    payload = {
        "name": "Get Company",
        "email": "get@company.com",
        "phone": "1111111111",
        "location": "Get City"
    }
    create_response = await async_client.post("/company/", json=payload, headers=auth_headers)
    company_id = create_response.json()["id"]

    response = await async_client.get(f"/company/{company_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Get Company"

@pytest.mark.asyncio
async def test_update_company(async_client: AsyncClient, auth_headers: dict):
    payload = {
        "name": "Update Company",
        "email": "update@company.com",
        "phone": "2222222222",
        "location": "Update City"
    }
    create_response = await async_client.post("/company/", json=payload, headers=auth_headers)
    company_id = create_response.json()["id"]

    update_payload = {
        "name": "Updated Company"
    }
    response = await async_client.put(f"/company/{company_id}", json=update_payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["name"] == "Updated Company"

@pytest.mark.asyncio
async def test_delete_company(async_client: AsyncClient, auth_headers: dict):
    payload = {
        "name": "Delete Company",
        "email": "delete@company.com",
        "phone": "3333333333",
        "location": "Delete City"
    }
    create_response = await async_client.post("/company/", json=payload, headers=auth_headers)
    company_id = create_response.json()["id"]

    response = await async_client.delete(f"/company/{company_id}", headers=auth_headers)
    assert response.status_code == 204

    # Verify it's deleted
    get_response = await async_client.get(f"/company/{company_id}", headers=auth_headers)
    assert get_response.status_code == 404
