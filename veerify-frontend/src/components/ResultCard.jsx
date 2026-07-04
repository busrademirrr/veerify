import React from 'react';

const ResultCard = ({ data }) => {
  // Durum konfigürasyonu
  const STATUS_CONFIG = {
    verified: {
      scoreColor: 'text-primary',
      borderColor: 'border-primary',
      statusText: 'Bu haber DOĞRULANDI',
      statusTextColor: 'text-green-400'
    },
    likely_true: {
      scoreColor: 'text-emerald-400',
      borderColor: 'border-emerald-400',
      statusText: 'Bu haber MUHTEMELEN DOĞRU',
      statusTextColor: 'text-emerald-400'
    },
    uncertain: {
      scoreColor: 'text-orange-400',
      borderColor: 'border-orange-400',
      statusText: 'Sonuç BELİRSİZ / YETERLİ VERİ YOK',
      statusTextColor: 'text-orange-400'
    },
    disputed: {
      scoreColor: 'text-red-500',
      borderColor: 'border-red-500',
      statusText: 'Bu haber ŞÜPHELİ',
      statusTextColor: 'text-red-400'
    },
    warning: {
      scoreColor: 'text-yellow-500',
      borderColor: 'border-yellow-500',
      statusText: 'Lütfen Dikkat',
      statusTextColor: 'text-yellow-500'
    },
    invalid_input: {
      scoreColor: 'text-yellow-500',
      borderColor: 'border-yellow-500',
      statusText: 'Gecersiz Metin',
      statusTextColor: 'text-yellow-500'
    }
  };

  const isWarning = data.status === "Uyarı" || data.status === "invalid_input" || data.title === "Metin Yetersiz" || data.status === "Hata";

  if (isWarning) {
    return (
      <div className="w-full bg-yellow-900/20 border border-yellow-500/30 rounded-3xl p-8 animate-fade-in shadow-[0_0_50px_-12px_rgba(234,179,8,0.1)] backdrop-blur-xl text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-yellow-500/10 border-2 border-yellow-500 flex items-center justify-center mb-2">
            <span className="text-3xl text-yellow-500">!</span>
          </div>

          <h3 className="text-2xl font-bold text-white">Analiz Yapılamadı</h3>

          <p className="text-yellow-200/80 text-lg max-w-xl leading-relaxed">
            {data.description || "Girdiğiniz metin analiz için uygun değil. Lütfen daha uzun ve anlamlı bir haber metni giriniz."}
          </p>

          <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 w-full max-w-lg">
            <p className="text-gray-400 text-sm">
              <span className="block mb-1 text-gray-500 text-xs uppercase tracking-wider">İpucu</span>
              Doğru sonuç almak için en az birkaç cümlelik bir haber metni veya paragraf girmeniz önerilir.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Backend'den gelen status 'verified', 'likely_true' vb. olabilir.
  // Warning durumunda override ediyoruz.
  const currentStatusKey = STATUS_CONFIG[data.status] ? data.status : 'disputed';

  const { scoreColor, borderColor, statusText, statusTextColor } = STATUS_CONFIG[currentStatusKey];

  return (
    <div className={`w-full bg-black/40 border ${isWarning ? 'border-yellow-500/30' : 'border-primary/30'} rounded-3xl p-8 animate-fade-in shadow-[0_0_50px_-12px_rgba(25,169,107,0.2)] backdrop-blur-xl`}>

      {/* Info Icon & Tooltip */}
      <div className="absolute top-6 right-6 group z-50">
        <div className="w-5 h-5 rounded-full border border-gray-500/50 text-gray-500 flex items-center justify-center text-xs font-serif italic cursor-help hover:border-gray-300 hover:text-gray-300 transition-colors">
          i
        </div>

        {/* Tooltip */}
        <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-gray-900/95 backdrop-blur-md border border-gray-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
          <p className="text-xs text-gray-400 leading-relaxed text-right">
            Not: Sunulan skorlar kesin doğrular değil, veri temelli olasılıklardır.
            Bilgileri farklı kaynaklardan teyit etmenizi öneririz.
          </p>
        </div>
      </div>

      {/* Üst Kısım: Skor ve Durum */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full border-4 ${borderColor} flex items-center justify-center`}>
            {/* If warning, maybe show icon instead of 0%? Or just keep 0% in yellow */}
            <span className={`text-xl font-bold ${scoreColor}`}>{`%${data.score}`}</span>
          </div>
          <div>
            <h3 className="text-white text-xl font-bold">Analiz Tamamlandı</h3>
            <p className={statusTextColor}>
              {statusText}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 block">Tespit Tarihi</span>
          <span className="text-sm text-gray-300">{new Date().toLocaleDateString('tr-TR')}</span>
        </div>
      </div>

      {/* İçerik Detayları */}
      <div className="space-y-4">
        <div>
          <h4 className="text-gray-400 text-sm mb-1">Haber Başlığı</h4>
          <p className="text-white font-medium text-lg">{data.title}</p>
        </div>

        <div>
          <h4 className="text-gray-400 text-sm mb-1">Özet</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{data.description}</p>
        </div>

        {/* Kaynaklar */}
        <div className="pt-4">
          <h4 className="text-gray-400 text-sm mb-3">Doğrulanan Kaynaklar</h4>
          <div className="flex gap-3">
            {(data.sources || []).map((source, index) => (
              <span key={index} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-700">
                {source}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div >
  );
};

export default ResultCard;