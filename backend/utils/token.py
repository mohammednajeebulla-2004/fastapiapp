from jose import jwt
from datetime import datetime, timedelta
from schemas.token import Token
from models import users
from dotenv import load_dotenv
import os
from fastapi import Depends, HTTPException
from database import get_db
from sqlalchemy.orm import Session


load_dotenv(override=True)
# Provide safe defaults for development; prefer setting these in backend/.env
SECRET_KEY = os.getenv("SECRET_KEY") or os.getenv("SECRET", None)
if SECRET_KEY:
    SECRET_KEY = SECRET_KEY.strip()
ALGORITHM = os.getenv("ALGORITHM") or "HS256"

if not SECRET_KEY:
    # Fallback development key to avoid obscure runtime errors. Replace in production.
    SECRET_KEY = "dev_secret_key"

def create_access_token(data:dict,expires_delta: timedelta = timedelta(hours=2)):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token:str, db:Session):
    try:
        to_decode = jwt.decode(token, key=SECRET_KEY, algorithms=[ALGORITHM])
        return to_decode
    except:
        raise HTTPException(status_code=401, detail="Invalid credentials")

