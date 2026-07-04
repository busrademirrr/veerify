from newspaper import Article
from backend.app.core.exceptions import ValidationException

def scrape_article(url: str) -> dict:
    """
    Scrapes article title and text from a given URL.
    Returns a dict with 'title' and 'text'.
    Raises ValidationException if scraping fails.
    """
    try:
        if not url.startswith("http"):
            # Simple check if protocol is missing
            url = "https://" + url

        article = Article(url, language='tr')
        article.download()
        article.parse()
        
        if not article.text or len(article.text) < 50:
            raise ValidationException(
                "Bu URL'den yeterli metin çekilemedi. Lütfen makale metnini kopyalayıp yapıştırın."
            )

        return {
            "title": article.title,
            "text": article.text
        }
    except ValidationException:
        raise
    except Exception as e:
        print(f"Scraping error: {e}")
        raise ValidationException(
            "URL analizi başarısız oldu. Linkin erişilebilir olduğundan emin olun veya metni manuel girin."
        )
