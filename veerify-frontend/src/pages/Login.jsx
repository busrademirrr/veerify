import React, { useState } from 'react';
import { supabase, recordLog } from '../supabase'; // recordLog'u import ettik
import Terms from './Terms';

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Veritabanı Senkronizasyon Fonksiyonu ---
  const syncUserToDatabase = async (authUser) => {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', authUser.email)
        .maybeSingle();

      if (!existingUser) {
        console.log("Kullanıcı 'users' tablosunda yok, oluşturuluyor...");

        const fakeHash = "$2a$10$" + Math.random().toString(36).slice(-10) + "XyZ" + Date.now();
        const autoUsername = authUser.email.split('@')[0];

        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            username: autoUsername,
            email: authUser.email,
            password: fakeHash
          }]);

        if (insertError) {
          await recordLog('ERROR', 'Kullanıcı tablosu senkronizasyon hatası', { error: insertError }); // LOG
          throw insertError;
        }
        await recordLog('INFO', 'Yeni kullanıcı veritabanına eklendi', { email: authUser.email }); // LOG
      }
      return true;
    } catch (err) {
      console.error("Senkronizasyon hatası:", err);
      return false;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await recordLog('INFO', 'Google ile giriş denemesi'); // LOG
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error) {
      await recordLog('ERROR', 'Google giriş hatası', { error: error.message }); // LOG
      setError("Google hatası: " + error.message);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isRegistering && password !== confirmPassword) {
      setError("Şifreler uyuşmuyor!");
      setLoading(false);
      return;
    }

    if (isRegistering && !acceptedTerms) {
      setError("Kaydolmak için Hizmet Şartlarını kabul etmelisiniz.");
      setLoading(false);
      return;
    }

    let authResult;
    const actionType = isRegistering ? 'KAYIT' : 'GİRİŞ';

    if (isRegistering) {
      authResult = await supabase.auth.signUp({ email, password });
    } else {
      authResult = await supabase.auth.signInWithPassword({ email, password });
    }

    const { data, error: authError } = authResult;

    if (authError) {
      await recordLog('ERROR', `${actionType} Başarısız`, { email, error: authError.message }); // LOG
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await recordLog('INFO', `${actionType} Başarılı`, { email: data.user.email }); // LOG
      await syncUserToDatabase(data.user);
      onLogin(data.user);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="text-center mb-8 relative z-10">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-3xl">V</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isRegistering ? 'Hesap Oluştur' : 'Tekrar Hoş Geldiniz'}
          </h1>
        </div>

        <button onClick={handleGoogleLogin} className="w-full bg-white text-black font-medium py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors mb-6 relative z-10 shadow-lg">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          Google ile devam et
        </button>

        <div className="flex items-center gap-4 mb-6 relative z-10"><div className="h-px bg-white/10 flex-1"></div><span className="text-gray-500 text-xs uppercase">veya e-posta ile</span><div className="h-px bg-white/10 flex-1"></div></div>

        <form onSubmit={handleAuth} className="space-y-5 relative z-10">
          <div>
            <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 ml-1">E-posta</label>
            <input type="email" required className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-primary outline-none transition-all placeholder-gray-600" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 ml-1">Şifre</label>
            <input type="password" required className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white focus:border-primary outline-none transition-all placeholder-gray-600" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {isRegistering && (
            <div className="animate-fade-in-up">
              <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 ml-1">Şifre (Tekrar)</label>
              <input type="password" required className={`w-full bg-black/40 border rounded-xl p-3.5 text-white outline-none transition-all placeholder-gray-600 ${confirmPassword && password !== confirmPassword ? 'border-red-500' : 'border-white/10'}`} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          )}

          {isRegistering && (
            <div className="flex items-center gap-3 animate-fade-in-up">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-black/40 text-primary focus:ring-primary focus:ring-offset-0"
              />
              <label htmlFor="terms" className="text-gray-400 text-xs select-none cursor-pointer">
                <span onClick={(e) => { e.preventDefault(); setShowTerms(true); }} className="text-gray-300 hover:text-white transition-colors underline decoration-dotted underline-offset-4 cursor-pointer">Hizmet Şartları</span>'nı okudum ve kabul ediyorum.
              </label>
            </div>
          )}

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-green-600 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-lg disabled:opacity-50">
            {loading ? 'İşleniyor...' : (isRegistering ? 'Kayıt Ol' : 'Giriş Yap')}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6 relative z-10">
          <p className="text-gray-400 text-sm">
            {isRegistering ? "Zaten hesabın var mı?" : "Hesabın yok mu?"}
            <button onClick={() => { setIsRegistering(!isRegistering); setError(null); setConfirmPassword(''); }} className="text-primary font-bold ml-2 hover:underline">
              {isRegistering ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          </p>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-4xl max-h-[80vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl relative">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/50">
              <h2 className="text-white font-bold text-lg">Hizmet Şartları</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-0 relative">
              {/* Terms component normally has heavy padding (pt-32), we might want to scale it or just render it. 
                   Actually, let's just render it. Its internal layout might be wide. 
                   We will wrap it in a div that might constrain it if needed. 
               */}
              <div className="transform scale-90 origin-top -mt-20">
                <Terms />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-black/50 flex justify-end">
              <button
                onClick={() => { setShowTerms(false); setAcceptedTerms(true); }}
                className="bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Okudum, Kabul Ediyorum
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;