import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_success(async_client: AsyncClient):
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "role": "Candidate"
    }
    response = await async_client.post("/auth/register", json=payload)
    assert response.status_code == 200, f"Expected 200 but got {response.status_code} with body: {response.text}"
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert "hashed_password" not in data

@pytest.mark.asyncio
async def test_register_duplicate(async_client: AsyncClient):
    payload = {
        "name": "Test User 2",
        "email": "test@example.com",
        "password": "password123",
        "role": "Candidate"
    }
    await async_client.post("/auth/register", json=payload)
    
    response = await async_client.post("/auth/register", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already exists"

@pytest.mark.asyncio
async def test_login_success(async_client: AsyncClient):
    register_payload = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "role": "Candidate"
    }
    await async_client.post("/auth/register", json=register_payload)

    payload = {
        "username": "test@example.com",
        "password": "password123"
    }
    response = await async_client.post("/auth/login", data=payload) # OAuth2PasswordRequestForm uses form data
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "Bearer"
