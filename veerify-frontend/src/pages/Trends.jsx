import React from 'react';

const Trends = () => {
  // PDF'teki örnek veriler
  const trendsData = [
    { id: 1, topic: "İklim Değişikliği Politikaları 2025", count: 1247 },
    { id: 2, topic: "Yapay Zeka Düzenlemeleri (AI Act)", count: 892 },
    { id: 3, topic: "Küresel Ekonomik Görünüm", count: 743 },
    { id: 4, topic: "Sağlık Reformları Paketi", count: 621 },
    { id: 5, topic: "Uzay Keşif Görevleri", count: 518 },
  ];

  return (
    <div className="min-h-screen bg-dark text-white pt-24 px-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-white">
        Trend <span className="text-primary">Sorgular</span>
      </h2>

      <div className="w-full max-w-4xl grid gap-4">
        {trendsData.map((item, index) => (
          <div key={item.id} className="bg-surface border border-gray-800 p-6 rounded-2xl flex items-center justify-between hover:border-primary/50 transition-all cursor-default group">
            <div className="flex items-center gap-6">
              <span className="text-4xl font-bold text-gray-700 group-hover:text-primary transition-colors">
                #{index + 1}
              </span>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{item.topic}</h3>
                <p className="text-gray-400 text-sm">Son 24 saatte çok sorgulandı</p>
              </div>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-primary font-bold">
              {item.count} analiz
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trends;