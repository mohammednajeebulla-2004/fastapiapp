from jose import jwt
from datetime import datetime, timedelta
from requests import Session
from schemas.token import Token
from models import users
from dotenv import load_dotenv
import os
from fastapi import Depends, HTTPException
from database import get_db
from sqlalchemy.orm import Session
from utils.token import verify_access_token


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def create_access_token(data:dict,expires_delta: timedelta = timedelta(hours=2)):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token:str,db:Session=Depends(get_db)):
        to_decode = jwt.decode(token, key=SECRET_KEY, algorithms=[ALGORITHM])
        current_user = db.query(users).filter(users.id == to_decode["user_id"]).first()
        if current_user is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return current_user

