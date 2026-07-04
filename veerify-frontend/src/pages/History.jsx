import React, { useEffect, useState } from 'react';
import { fetchUserHistory } from '../supabase';

const History = ({ user, onViewDetails }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        setLoading(true);
        const data = await fetchUserHistory(user.id);
        setHistoryData(data || []);
        setLoading(false);
      }
    };

    loadHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white pt-32 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 px-4 pb-12 flex flex-col items-center relative overflow-hidden">

      {/* Arka Plan Süsü */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">
            Geçmiş <span className="text-primary">Sorgular</span>
          </h2>
          <p className="text-gray-500 mt-2">Daha önce analiz ettiğiniz haberlerin arşivi</p>
        </div>

        {historyData.length === 0 ? (
          <div className="text-center py-20 bg-[#0A0A0A] border border-white/5 rounded-3xl">
            <p className="text-gray-500 text-lg">Henüz hiç analiz yapmadınız.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyData.map((item) => {
              const getTheme = (status, score) => {
                const s = status?.toLowerCase() || '';
                if (s === 'verified' || s === 'doğru') return { color: 'emerald', label: 'Doğrulandı', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' };
                if (s === 'likely_true') return { color: 'emerald', label: 'Muhtemelen Doğru', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' }; // Use Emerald for Likely True as well
                if (s === 'uncertain' || s === 'belirsiz') return { color: 'yellow', label: 'Belirsiz', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' };
                if (s === 'disputed' || s === 'şüpheli') return { color: 'red', label: 'Şüpheli', bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' };
                return { color: 'zinc', label: 'Analiz Ediliyor', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', text: 'text-zinc-400' };
              };

              const theme = getTheme(item.status, item.score);

              return (
                <div key={item.id} className={`group bg-[#0A0A0A] border ${theme.border} hover:border-${theme.color}-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-${theme.color}-500/5 flex flex-col h-full`}>

                  {/* Header: Tarih & Skor */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs text-gray-500 font-mono bg-white/5 px-2 py-1 rounded">
                      {new Date(item.created_at).toLocaleDateString('tr-TR')}
                    </span>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${theme.border} ${theme.bg} ${theme.text}`}>
                      <span className="text-sm font-bold">%{item.score}</span>
                    </div>
                  </div>

                  {/* Content: Başlık & Özet */}
                  <div className="flex-grow">
                    <h3 className={`text-lg font-bold text-white mb-2 line-clamp-2 group-hover:${theme.text} transition-colors`}>
                      {item.title || "Analiz Sonucu"}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer: Durum */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded border ${theme.border} ${theme.bg} ${theme.text}`}>
                      {theme.label}
                    </span>
                    <button
                      onClick={() => onViewDetails && onViewDetails(item)}
                      className="text-xs text-gray-500 hover:text-white transition-colors"
                    >
                      Detaylar →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;