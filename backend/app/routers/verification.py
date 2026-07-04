"""HTTP endpoints for running news verification pipeline."""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel, Field

from backend.app.core.constants import (
    ConfidenceLevel,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR,
    VerificationStatus,
)
from backend.app.core.exceptions import (
    InsufficientDataException,
    NoSimilarArticlesException,
    ValidationException,
    VerificationException,
)
from backend.app.services import (
    NewsVerificationWorkflow,
    status_message_tr,
)
from backend.app.utils.scraper import scrape_article

router = APIRouter(prefix="/verification", tags=["Verification"])


class VerificationRequest(BaseModel):
    text: Optional[str] = Field(None, description="Doğrulanacak haber metni (URL verilirse opsiyonel)")
    url: Optional[str] = Field(None, description="Haber linki")
    limit: Optional[int] = Field(None, description="Çekilecek benzer haber sayısı")


class SimilarArticleOut(BaseModel):
    baslik: Optional[str] = None
    ozet: Optional[str] = None
    url: Optional[str] = None
    kaynak: Optional[str] = None
    kaynak_id: str
    tarih: Optional[str] = None
    ulke: Optional[str] = None
    benzerlik: float
    guvenilirlik: float


class VerificationResponse(BaseModel):
    mesaj: str
    skor: float
    durum: VerificationStatus
    guven: ConfidenceLevel
    temiz_metin: str
    fallback: bool
    benzer_haberler: List[SimilarArticleOut]
    keywords: List[str]


from backend.app.core.constants import SourceType

_workflow = NewsVerificationWorkflow(
    source_type_overrides={
        "cumhuriyet": SourceType.MAINSTREAM_MEDIA,
        "dunya": SourceType.MAINSTREAM_MEDIA,
        "hurriyet": SourceType.MAINSTREAM_MEDIA,
        "milliyet": SourceType.MAINSTREAM_MEDIA,
        "sozcu": SourceType.MAINSTREAM_MEDIA,
        "sabah": SourceType.MAINSTREAM_MEDIA,
        "haberturk": SourceType.MAINSTREAM_MEDIA,
        "trthaber": SourceType.MAINSTREAM_MEDIA,
        "ntv": SourceType.MAINSTREAM_MEDIA,
        "cnnturk": SourceType.MAINSTREAM_MEDIA,
        "bbc": SourceType.MAINSTREAM_MEDIA,
        "bbc turkce": SourceType.MAINSTREAM_MEDIA,
        "bbc türkçe": SourceType.MAINSTREAM_MEDIA,
        "reuters": SourceType.MAINSTREAM_MEDIA,
        "aa": SourceType.MAINSTREAM_MEDIA,
        "iha": SourceType.MAINSTREAM_MEDIA,
        "dha": SourceType.MAINSTREAM_MEDIA
    }
)


def get_workflow() -> NewsVerificationWorkflow:
    return _workflow


@router.post("/", response_model=VerificationResponse)
async def verify_news(
    payload: VerificationRequest = Body(...),
    workflow: NewsVerificationWorkflow = Depends(get_workflow),
):
    # Length check moved to workflow service for smarter validation

    try:
        final_text = payload.text
        
        # 1. URL varsa önce oradan çekmeyi dene
        if payload.url:
            scraped_data = scrape_article(payload.url)
            # Başlık ve metni birleştirerek daha iyi bağlam sağla
            scraped_text = f"{scraped_data['title']}.\n\n{scraped_data['text']}"
            final_text = scraped_text
        
        # 2. Hiç metin yoksa hata fırlat
        if not final_text:
            raise ValidationException("Lütfen analiz için bir metin veya geçerli bir haber linki giriniz.")

        result = workflow.verify_text(final_text, limit=payload.limit)
    except ValidationException as exc:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail={"message": exc.message, "code": exc.error_code, "details": exc.details},
        ) from exc
    except InsufficientDataException as exc:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail={"message": exc.message, "code": exc.error_code, "details": exc.details},
        ) from exc
    except VerificationException as exc:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"message": exc.message, "code": exc.error_code, "details": exc.details},
        ) from exc
    except Exception as exc:
        import traceback
        traceback.print_exc()
        print(f"CRITICAL ERROR: {exc}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Server Error: {str(exc)}",
        )

    message = status_message_tr(result.verification.status)
    return VerificationResponse(
        mesaj=message,
        skor=result.verification.score,
        durum=result.verification.status,
        guven=result.verification.confidence,
        temiz_metin=result.clean_text,
        fallback=result.fallback_used,
        benzer_haberler=[SimilarArticleOut(**article) for article in result.articles],
        keywords=result.keywords,
    )
