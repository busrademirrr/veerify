# backend/app/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# ❗ DÜZELTİLEN İMPORTLAR
from backend.app.core import models, schemas
from backend.app.utils import security
from backend.app.core.database import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# ---------------------------------------------
# USER REGISTER
# ---------------------------------------------
@router.post(
    "/register",
    response_model=schemas.UserOut,
    status_code=status.HTTP_201_CREATED
)
async def create_user(
    user_input: schemas.UserCreate = Body(...),
    db: AsyncSession = Depends(get_db)
):
    query = select(models.User).where(
        (models.User.email == user_input.email) |
        (models.User.username == user_input.username)
    )
    result = await db.execute(query)
    db_user = result.scalar_one_or_none()

    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu email veya kullanıcı adı zaten kullanımda"
        )

    hashed_password = security.create_hashed_password(user_input.password)

    new_user = models.User(
        username=user_input.username,
        email=user_input.email,
        password=hashed_password,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user


# ---------------------------------------------
# USER LOGIN
# ---------------------------------------------
@router.post("/login", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    query = select(models.User).where(models.User.username == form_data.username)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user or not security.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kullanıcı adı veya şifre hatalı",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # JWT token oluşturma
    access_token = security.create_access_token(
        data={"sub": user.username}
    )

    return {"access_token": access_token, "token_type": "bearer"}
