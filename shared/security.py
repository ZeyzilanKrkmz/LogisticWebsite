#jwt doğrulama logic'i

from jose import jwt,JWTError
from fastapi import HTTPException,Depends,status
from fastapi.security import OAuth2PasswordBearer
import os

SECRET_KEY=os.getenv("SECRET_KEY","your_secret_key")
ALGORITHM="HS256"

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="http://localhost:8000/login")

def get_current_user(token:str=Depends(oauth2_scheme)):
    credentials_exception=HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Kimlik doğrulama başarısız",
        headers={"WWW-Authenticate":"Bearer"},
    )
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        email:str=payload.get("sub")
        role:str=payload.get("role")
        if email is None:
            raise credentials_exception
        return {"email":email,"role":role}
    except JWTError:
        raise credentials_exception