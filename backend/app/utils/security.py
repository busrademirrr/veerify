# app/utils/security.py

from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from backend.app.core.config import settings
from backend.app.core import schemas

# Şifreleme için bcrypt_sha256
pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")

def create_hashed_password(password: str):
    return pwd_context.hash(password[:72])  # 72-byte sınırı çözüldü

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    to_encode.update({"exp": expire})

    # DOĞRU ALANLAR: jwt_secret_key + jwt_algorithm
    return jwt.encode(
        to_encode,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm
    )

def verify_access_token(token: str, credentials_exception):
    try:
        # DOĞRU ALANLAR: jwt_secret_key + jwt_algorithm
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )

        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception

        return schemas.TokenData(username=username)

    except JWTError:
        raise credentials_exception
