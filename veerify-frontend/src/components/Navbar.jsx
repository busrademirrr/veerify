import React from 'react';

// onLogout fonksiyonunu da alıyoruz
const Navbar = ({ onNavigate, userEmail, onLogout }) => {

  const getInitials = () => {
    if (!userEmail) return "U";
    return userEmail.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="w-full h-20 flex items-center justify-between px-8 fixed top-0 z-50 backdrop-blur-sm bg-dark/50 border-b border-white/5">

      {/* LOGO */}
      <div
        className="flex items-center gap-3 cursor-pointer group relative"
        onClick={() => onNavigate('home')}
      >
        <span className="absolute inset-0 bg-primary/40 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
        <span className="text-white text-2xl font-bold tracking-tight relative z-10 transition-colors group-hover:text-primary-50">✓eerify</span>
      </div>

      {/* SAĞ MENÜ */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => onNavigate('history')}
          className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
          Geçmiş
        </button>

        {/* PROFİL VE ÇIKIŞ */}
        <div className="flex items-center gap-3">
          {/* Baş harfler */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-sm text-white font-bold border border-white/10 shadow-lg cursor-default select-none">
            {getInitials()}
          </div>

          {/* GERÇEK ÇIKIŞ İKONU */}
          <button
            onClick={onLogout} // Artık App.jsx'teki çıkış fonksiyonunu çağırıyor
            className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-full"
            title="Çıkış Yap"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;