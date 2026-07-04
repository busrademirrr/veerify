# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from backend.app.routers import auth, search, verification
from backend.app.routers import search, verification
# from backend.app.core.database import init_models

app = FastAPI(
    title="Veerify API",
    description="Sahte haber tespiti projesi",
    version="0.1.0"
)

import sys
import asyncio
from decouple import config

# Windows için Event Loop Fix (Asyncpg ile uyumluluk için)
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

@app.on_event("startup")
async def on_startup():
    db_url = config("DATABASE_URL", default="")
    # print(f"DEBUG: Startup DB URL Host: {db_url.split('@')[-1] if '@' in db_url else 'INVALID'}")
    # await init_models()
    pass

# ==========================================
# 🚨 CORS AYARLARI (GARANTİ ÇÖZÜM)
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://veerify.co",
        "https://www.veerify.co",
        "https://veerify-frontend.onrender.com", # Render domain
        "http://localhost:5173", # Local development
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(auth.router)
app.include_router(search.router)
app.include_router(verification.router)



@app.get("/")
async def read_root():
    return {"Proje": "Veerify API", "Durum": "Çalışıyor"}