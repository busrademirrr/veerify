import React, { useState, useEffect } from 'react';
import ResultCard from '../components/ResultCard';
// Supabase loglaması opsiyonel, hata verirse bu satırı silebilirsin:
// Supabase loglaması opsiyonel, hata verirse bu satırı silebilirsin:
import { recordLog, saveHistory } from '../supabase';

const Home = ({ onAnalyzeComplete, user, initialResult }) => {
    const [newsText, setNewsText] = useState('');
    const [inputType, setInputType] = useState('text'); // 'text' | 'url'
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // --- YENİ: GEÇMİŞTEN GELEN SONUCU YÜKLE ---
    useEffect(() => {
        if (initialResult) {
            setNewsText(initialResult.description || ''); // Açıklamayı metin alanına koy
            setResult(initialResult);
        }
    }, [initialResult]);

    const trends = [
        { id: 1, title: "İklim değişikliği politikaları 2025", count: "1,247" },
        { id: 2, title: "Yapay Zeka düzenlemeleri", count: "892" },
        { id: 3, title: "Küresel ekonomik görünüm", count: "743" },
        { id: 4, title: "Sağlık reformları paketi", count: "621" },
    ];

    const handleTrendClick = (trendTitle) => {
        setInputType('text');
        setNewsText(trendTitle);
        handleAnalyze(trendTitle);
    };

    const handleAnalyze = async (overrideText = null) => {
        const textToAnalyze = overrideText || newsText;
        if (!textToAnalyze.trim()) return;

        setLoading(true);
        setResult(null);

        // --- Loglama ---
        try {
            if (user) await recordLog('INFO', 'Haber analizi başlatıldı', { email: user?.email, type: inputType });
        } catch (e) { console.warn("Log hatası:", e); }

        try {
            console.log("Backend'e istek atılıyor...");

            // Use env var or default to local proxy
            const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

            // If using full URL (Render), append /verification/.
            // If using local proxy (/api), we need to check if /api maps to root or not.
            // Vite proxy maps /api -> http://127.00.1:8000 (rewrite /api -> /)
            // So /api/verification/ -> http://127.0.0.1:8000/verification/
            // If VITE_API_BASE_URL is https://veerify-9ev9.onrender.com
            // Then we want https://veerify-9ev9.onrender.com/verification/

            // Clean up trailing slash if exists in env
            const baseUrl = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;

            // Prepare payload based on input type
            const payload = { limit: 5 };
            if (inputType === 'url') {
                payload.url = textToAnalyze;
            } else {
                payload.text = textToAnalyze;
            }

            const response = await fetch(`${baseUrl}/verification/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // --- 404 (BULUNAMADI) DURUMU ---
            if (response.status === 404) {
                const notFoundResult = {
                    title: "Sonuç Bulunamadı",
                    description: "Bu haber veritabanımızdaki kayıtlarla eşleşmedi. Yeni veya henüz teyit edilmemiş bir haber olabilir.",
                    score: 0,
                    status: "Bulunamadı",
                    sources: ["Veritabanında eşleşme yok"]
                };
                setResult(notFoundResult);
                if (onAnalyzeComplete) onAnalyzeComplete(notFoundResult);

                // Save 'Not Found' result to history
                if (user) {
                    await saveHistory(user.id, notFoundResult);
                }
                return;
            }

            if (response.status === 400) {
                const errorData = await response.json();
                // "detail" could be string or object, safe access:
                const msg = typeof errorData.detail === 'string'
                    ? errorData.detail
                    : errorData.detail?.message || "Geçersiz istek.";

                setResult({
                    title: "Girdi Yetersiz",
                    description: msg,
                    score: 0,
                    status: "Uyarı",  // Custom status for frontend to handle style
                    sources: []
                });
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Hata Kodu: ${response.status} - ${errorText}`);
            }

            // --- BAŞARILI SONUÇ ---
            const data = await response.json();

            const rawScore = data.skor || 0;
            const finalScore = rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore);

            const sourcesList = data.benzer_haberler && Array.isArray(data.benzer_haberler)
                ? data.benzer_haberler.map(news => news.kaynak || news.url).filter(Boolean)
                : ["Analiz Sonucu"];

            // Keywords varsa başlık olarak kullan, yoksa Analiz Tamamlandı
            const keywordsTitle = data.keywords && data.keywords.length > 0
                ? data.keywords.slice(0, 5).join(', ').toUpperCase()
                : "Analiz Tamamlandı";

            const finalResult = {
                title: keywordsTitle,
                description: data.durum === 'invalid_input' ? data.mesaj : (data.temiz_metin?.substring(0, 150) + "..." || textToAnalyze.substring(0, 150) + "..."),
                score: finalScore,
                status: data.durum,
                sources: sourcesList.length > 0 ? sourcesList : ["Kaynak belirtilmemiş"]
            };

            setResult(finalResult);

            // ✅ ESLINT HATASI ÇÖZÜMÜ: Başarılı olunca da çağırdık
            if (onAnalyzeComplete) {
                onAnalyzeComplete(finalResult);
            }

            // --- DEĞİŞİKLİK: GEÇMİŞE KAYDET ---
            if (user) {
                await saveHistory(user.id, finalResult);
            }

        } catch (error) {
            console.error("Analiz Hatası:", error);
            setResult({
                title: "Bağlantı Hatası",
                description: "Sunucu ile iletişim kurulurken bir sorun oluştu: " + error.message,
                score: 0,
                status: "Hata",
                sources: []
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAnalyze();
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 px-4 md:px-8 pb-12 relative overflow-x-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

                {/* SOL MENÜ */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Trend Başlıklar</h2>
                        <div className="space-y-3">
                            {trends.map((item) => (
                                <div key={item.id} onClick={() => handleTrendClick(item.title)} className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer flex justify-between">
                                    <div><h3 className="font-medium text-gray-300 group-hover:text-white">{item.title}</h3></div>
                                    <div className="text-green-500 font-bold">{item.id}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SAĞ ALAN */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
                        <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <h2 className="text-sm font-medium text-gray-300 uppercase">Haber Doğrulama Paneli</h2>
                            </div>

                            {/* Toggle Switch */}
                            <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                                <button
                                    onClick={() => setInputType('text')}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${inputType === 'text' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Metin
                                </button>
                                <button
                                    onClick={() => setInputType('url')}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${inputType === 'url' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Link
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <textarea
                                className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-5 text-white resize-none text-lg placeholder:text-gray-600 focus:outline-none focus:border-white/20 transition-colors"
                                placeholder={inputType === 'url' ? "Haber linkini buraya yapıştırın (https://...)" : "Haber metnini buraya yapıştırın..."}
                                value={newsText}
                                onChange={(e) => setNewsText(e.target.value)}
                                onKeyDown={handleKeyDown}
                            ></textarea>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => handleAnalyze()}
                                    disabled={loading || !newsText}
                                    className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium disabled:opacity-50"
                                >
                                    {loading ? 'Analiz Ediliyor...' : 'Analiz Et'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SONUÇ KARTI */}
                    {result && (
                        <div className="animate-fade-in-up">
                            {ResultCard ? <ResultCard data={result} /> : (
                                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-700">
                                    <h3 className={`text-xl font-bold mb-2 ${result.status === 'Hata' || result.status === 'Bulunamadı' ? 'text-red-400' : 'text-green-400'}`}>
                                        {result.title} ({result.status})
                                    </h3>
                                    <p className="text-gray-300">{result.description}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;