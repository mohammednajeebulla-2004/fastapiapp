from pydantic import BaseModel

class UserBase(BaseModel):
    name:str
    email:str
    # password : str
    role :str
    
class UserCreate(UserBase):
    password : str

class UserResponse(UserBase):
    id:int
    name:str
    email:str
    role:str

    class Config:
        from_attributes = True