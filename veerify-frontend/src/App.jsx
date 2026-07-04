import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import History from './pages/History';
import Trends from './pages/Trends';
import Login from './pages/Login';
import Footer from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import FAQ from './pages/FAQ';
import { supabase } from './supabase';

function App() {
  const [session, setSession] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Temiz URL için hash'i kaldır
      if (session && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    return () => subscription.unsubscribe();
  }, []);



  // Eski handleNewAnalysis fonksiyonunu boşaltıyoruz, çünkü artık History kendi çekiyor
  const handleNewAnalysis = (newResult) => {
    // Opsiyonel: Toast veya bildirim gösterilebilir
    console.log("Yeni analiz tamamlandı:", newResult);
  };

  const handleViewDetails = (analysis) => {
    setSelectedAnalysis(analysis);
    setCurrentPage('home');
  };

  // --- YENİ: GERÇEK ÇIKIŞ FONKSİYONU ---
  const handleLogout = async () => {
    await supabase.auth.signOut(); // Supabase'den çık
    setSession(null); // Uygulama durumunu sıfırla
    setCurrentPage('home'); // Sayfayı başa al
  };

  if (!session) {
    return <Login onLogin={(user) => setSession({ user })} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            onAnalyzeComplete={handleNewAnalysis}
            user={session.user}
            initialResult={selectedAnalysis}
          />
        );
      case 'history':
        return (
          <History
            user={session.user}
            onViewDetails={handleViewDetails}
          />
        );
      case 'trends':
        return <Trends />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'terms':
        return <Terms />;
      case 'faq':
        return <FAQ />;
      default:
        return (
          <Home
            onAnalyzeComplete={handleNewAnalysis}
            user={session.user}
            initialResult={selectedAnalysis}
          />
        );
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen font-sans flex flex-col">
      {/* Navbar'a hem emaili hem de çıkış fonksiyonunu gönderiyoruz */}
      <Navbar
        onNavigate={setCurrentPage}
        userEmail={session.user.email}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* Global Footer (Disclaimer included) */}
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;