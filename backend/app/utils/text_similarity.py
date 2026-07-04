# backend/app/utils/text_similarity.py

import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Türkçe stop words listesi – dilersen genişletirsin
TURKISH_STOPWORDS = {
    "ve", "ile", "da", "de", "mi", "mı", "mu", "mü",
    "bir", "bu", "çok", "gibi", "ama", "fakat", "ise",
    "çünkü", "ancak", "olan", "olarak", "için", "daha",
    "en", "ki", "ya", "hem", "şu", "o", "nın", "nin",
    "diye"
}

def clean_text_basic(text: str) -> str:
    """TF-IDF öncesi basit temizlik — heavy text_processing değil!"""
    if not text:
        return ""
    
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    
    return text


# ---- TF-IDF Vectorizer (global instance, performans için) ----
# ---- TF-IDF Vectorizer (global instance, performans için) ----
_vectorizer = TfidfVectorizer(
    # stop_words=TURKISH_STOPWORDS,  # Stopwords bazen kısa metinlerde soruna yol açıyor
    min_df=1,
    use_idf=True,
    smooth_idf=True
    # max_features=5000,
    # ngram_range=(1, 2)
)


def compute_similarity(text1: str, text2: str) -> float:
    """
    İki metin arasında cosine similarity hesaplar.
    Dönen değer: 0.0 – 1.0 arası normalleştirilmiş benzerlik
    """
    if not text1 or not text2:
        return 0.0

    clean1 = clean_text_basic(text1)
    clean2 = clean_text_basic(text2)

    try:
        tfidf_matrix = _vectorizer.fit_transform([clean1, clean2])
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return round(float(sim), 4)
    except Exception:
        return 0.0
