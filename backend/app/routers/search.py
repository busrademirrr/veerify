# app/routers/search.py
from fastapi import APIRouter, Body
from pydantic import BaseModel

from backend.app.utils.text_processing import prepare_for_similarity_search
from backend.app.core.mongo import search_news_atlas, search_news_regex
from backend.app.utils.text_similarity import compute_similarity

router = APIRouter(prefix="/search", tags=["News Search"])

class SearchIn(BaseModel):
    text: str
    limit: int | None = 5

@router.post("/")
async def search_news_endpoint(payload: SearchIn = Body(...)):
    clean_text = prepare_for_similarity_search(payload.text, validate_length=False)

    # --- Atlas Search → Regex fallback ---
    try:
        results = search_news_atlas(clean_text, limit=payload.limit or 5)
    except Exception:
        results = search_news_regex(clean_text, limit=payload.limit or 5)

    processed_results = []
    MAX_SCORE = 50  # normalize divider

    for doc in results:
        raw_score = doc.get("score", 0)
        normalized = round(min(raw_score / MAX_SCORE, 1), 4)

        # ----------------------------------------
        # Başlık + Özet temizle (validate_length=False)
        # ----------------------------------------
        clean_title = prepare_for_similarity_search(
            doc.get("baslik", ""), validate_length=False
        ) if doc.get("baslik") else ""

        clean_summary = prepare_for_similarity_search(
            doc.get("ozet", ""), validate_length=False
        ) if doc.get("ozet") else ""

        # ----------------------------------------
        # TF-IDF Cosine Similarity
        # ----------------------------------------
        title_sim = compute_similarity(clean_text, clean_title) if clean_title else 0
        summary_sim = compute_similarity(clean_text, clean_summary) if clean_summary else 0

        # başlık %60 + özet %40
        combined_similarity = round((title_sim * 0.6) + (summary_sim * 0.4), 4)

        # Mongo %50 + TF-IDF %50
        hybrid_final = round((normalized * 0.5) + (combined_similarity * 0.5), 4)

        processed_results.append({
            "_id": str(doc.get("_id")),
            "baslik": doc.get("baslik"),
            "ozet": doc.get("ozet"),
            "tarih": doc.get("tarih"),
            "kaynak": doc.get("kaynak"),
            "url": doc.get("url"),
            "score": raw_score,
            "benzerlik_mongo": normalized,
            "benzerlik_tfidf": combined_similarity,
            "benzerlik_final": hybrid_final
        })

    return {
        "input_text": payload.text,
        "clean_text": clean_text,
        "count": len(processed_results),
        "results": processed_results
    }
