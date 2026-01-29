import pytest
from httpx import AsyncClient
from services.auth.main import app

@pytest.mark.asyncio
async def test_register_user():
    async with AsyncClient(app=app,base_url="http://localhost:8000") as ac:
        response =await ac.post("/register",json={
            "email":"test@logistics.com",
            "password":"testpassword"
        })
    assert response.status_code==200
    assert response.json()["email"]=="test@logistics.com"