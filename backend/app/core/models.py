# app/core/models.py

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB
from backend.app.core.database import Base


# -------------------------
# USERS TABLE
# -------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=True)  # Google Auth ile giriş yapanlar için boş kalabilir
    google_id = Column(String, unique=True, nullable=True, index=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship (1 user → many queries)
    queries = relationship("Query", back_populates="user", cascade="all, delete")


# -------------------------
# QUERIES TABLE
# -------------------------
class Query(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    query_text = Column(Text, nullable=False)
    result = Column(Text)
    reliability_score = Column(Float, nullable=True)
    similar_news_count = Column(Integer, nullable=True)
    source_diversity = Column(String, nullable=True) # or Integer/Float if required
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    user = relationship("User", back_populates="queries")


# -------------------------
# TRENDS TABLE
# -------------------------
class Trend(Base):
    __tablename__ = "trends"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, unique=True, nullable=False, index=True)
    query_count = Column(Integer, default=1)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# -------------------------
# LOGS TABLE
# -------------------------
class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    log_type = Column(String, nullable=False)
    message = Column(Text, nullable=False)

    # SQLAlchemy "metadata" alan adını kullanamaz! → meta olarak değiştiriyoruz
    meta = Column("metadata", JSONB)

    log_time = Column(DateTime(timezone=True), server_default=func.now())
