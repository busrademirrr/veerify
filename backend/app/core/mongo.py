# app/core/mongo.py
from pymongo import MongoClient
from bson import ObjectId
from decouple import config

MONGO_URL = config("MONGO_URL")
client = MongoClient(MONGO_URL)

mongo_db = client["news_database"]
articles_col = mongo_db["articles"]

# ----------------------------
# ✅ MongoDB → JSON serializer
# ----------------------------
def serialize_doc(doc: dict):
    """ObjectId'leri string'e çevir ve dökümanı JSON-safe hale getir."""
    out = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            out[k] = str(v)
        else:
            out[k] = v
    return out

def serialize_many(docs: list):
    return [serialize_doc(d) for d in docs]


# -----------------------------------------------
# ✅ ATLAS SEARCH (Baslik + Ozet)
# -----------------------------------------------
def search_news_atlas(query: str, limit: int = 5):
    """
    Atlas Search ile başlık+özet üzerinde arama.
    Index adı: 'default'
    """
    pipeline = [
        {
            "$search": {
                "index": "default_1",
                "text": {
                    "query": query,
                    "path": ["baslik", "ozet"]
                }
            }
        },
        {
            "$project": {
                "baslik": 1,
                "ozet": 1,
                "url": 1,
                "kaynak": 1,
                "tarih": 1,
                "score": {"$meta": "searchScore"}
            }
        },
        {"$sort": {"score": -1}},
        {"$limit": limit}
    ]
    return serialize_many(list(articles_col.aggregate(pipeline)))


# -----------------------------------------------
# ✅ REGEX SEARCH (Fallback)
# -----------------------------------------------
# -----------------------------------------------
# ✅ REGEX SEARCH (Fallback)
# -----------------------------------------------
def search_news_regex(query: str, limit: int = 5):
    """
    Atlas Search yoksa basit regex fallback (case-insensitive).
    Eğer sorgu uzunsa ve basit regex sonuç vermezse 'Akıllı Keyword Arama' devreye girer.
    """
    import re
    from backend.app.utils.text_processing import extract_keywords
    from backend.app.utils.text_similarity import compute_similarity

    # 1. Adım: Tam eşleşme (Exact Phrase Match)
    rx = re.compile(re.escape(query), re.IGNORECASE)
    cursor = articles_col.find(
        {"$or": [{"baslik": rx}, {"ozet": rx}, {"metin": rx}]},
        {"baslik": 1, "ozet": 1, "metin": 1, "url": 1, "kaynak": 1, "tarih": 1}
    ).limit(limit)

    out = []
    for doc in cursor:
        # Eğer regex ile tam eşleşme bulduysa (bu %100 benzerlik demektir),
        # MAX_SCORE değerini veriyoruz (şu anki MAX_SCORE 15.0 olarak ayarlı)
        doc["score"] = 15.0
        out.append(serialize_doc(doc))

    # 2. Adım: Eğer sonuç yoksa ve sorgu uzunsa -> Akıllı Keyword Arama
    if len(out) == 0 and len(query) > 50:
        # Anahtar kelimeleri çıkar (max 5)
        keywords = extract_keywords(query, max_keywords=5, min_length=4)
        if not keywords:
            return out

        # Keyword'lerden herhangi biri geçiyorsa çek (Geniş Arama)
        # Regex: (word1|word2|word3)
        pattern = "|".join(map(re.escape, keywords))
        rx_keywords = re.compile(pattern, re.IGNORECASE)

        # Adayları çek (daha fazla aday çekip Python'da eleyeceğiz - limit * 3)
        candidate_cursor = articles_col.find(
            {"$or": [{"baslik": rx_keywords}, {"ozet": rx_keywords}, {"metin": rx_keywords}]},
            {"baslik": 1, "ozet": 1, "metin": 1, "url": 1, "kaynak": 1, "tarih": 1}
        ).limit(limit * 4)

        candidates = []
        for doc in candidate_cursor:
            # Re-ranking: Cosine Similarity
            # Başlık, özet ve METİN ile sorguyu karşılaştır
            title_sim = compute_similarity(query, doc.get("baslik", ""))
            summary_sim = compute_similarity(query, doc.get("ozet", ""))
            body_sim = compute_similarity(query, doc.get("metin", ""))
            
            # En iyi benzerliği skor olarak al
            best_sim = max(title_sim, summary_sim, body_sim)
            
            doc["score"] = best_sim * 50  # 0-50 skalasına uydur (uyumluluk için)
            candidates.append(serialize_doc(doc))

        # Puana göre sırala ve limit uygula
        candidates.sort(key=lambda x: x["score"], reverse=True)
        out = candidates[:limit]

    return out
