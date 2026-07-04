<p align="center">
  <img src="https://freeimage.host/i/Km11kBf" alt="logo" width="200"/>
</p>

<h1 align="center">📰 VEERIFY </h1>
<p align="center">kaynak taraması yaparak haber doğruluğunu analiz eden veri odaklı sistem</p>

---

## 🚀 Proje Hakkında
**Veerify**, sahte haberleri tespit etmeye ve güvenilirlik skorunu hesaplamaya odaklanmış bir web tabanlı sistemdir.  
Sistem, bir haber metnini girdi olarak alır, farklı kaynaklardan benzer içerikleri bulur ve **doğruluk olasılığı** sunar.  
Ayrıca kullanıcıların yaptığı sorgular üzerinden **trend analizi** gerçekleştirir.

---

## 🧠 Genel Özellikler
- 🔍 **Kaynak bazlı doğruluk tespiti** (birden fazla güvenilir siteden arama)
- 📊 **Trend analizi** (en çok konuşulan konular)
- 💾 **Redis cache** ile hızlı sorgu sonuçları
- 📚 **MongoDB Atlas Search** ile semantik arama
- 👥 **Kullanıcı kayıt ve geçmiş sorgu yönetimi**
- ⚙️ **Arka plan veri toplayıcı (crawler) ve model pipeline**

---

## 🧩 Tech Stack

<p align="center">
  <!-- Backend -->
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="40" height="40" alt="Python"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" width="40" height="40" alt="FastAPI"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="40" height="40" alt="PostgreSQL"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="40" height="40" alt="MongoDB"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" width="40" height="40" alt="Redis"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" height="40" alt="React"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="40" height="40" alt="Git"/>
</p>

<p align="center">
  
  <b>Backend:</b> FastAPI, Python • 
  <b>Frontend:</b> React • 
  <b>Database:</b> PostgreSQL, MongoDB • 
  <b>Cache:</b> Redis • 
</p>

---

## 🧮 Sistem Akışı
1. Kullanıcı haber metnini sisteme girer.  
2. Backend, haber içeriğini temizleyip embedding oluşturur.  
3. MongoDB Atlas Search veya OpenSearch üzerinden benzer haberleri arar.  
4. Sonuçlar:
   - Benzer haber sayısı  
   - Kaynak çeşitliliği  
   - Güvenilirlik skoru  
   şeklinde hesaplanır.
5. ML modeli trendleri analiz eder, Redis üzerinde cache’ler.
6. Kullanıcı geçmiş sorgularını ve trendleri görebilir.

---

