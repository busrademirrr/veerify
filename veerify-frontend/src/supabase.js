import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- YENİ: MERKEZİ LOG FONKSİYONU ---
export const recordLog = async (type, message, metadata = {}) => {
  try {
    const { error } = await supabase
      .from('logs')
      .insert([{
        log_type: type,      // Örn: 'INFO', 'ERROR', 'WARNING'
        message: message,    // Örn: 'Kullanıcı giriş yaptı'
        metadata: metadata   // Örn: { email: '...' }
        // log_time otomatik eklenir
      }]);

    if (error) console.error("Loglama hatası:", error);
  } catch (err) {
    console.error("Log sistemi hatası:", err);
  }
};

// --- YENİ: GEÇMİŞ YÖNETİMİ ---
export const saveHistory = async (userId, result) => {
  try {
    const { error } = await supabase
      .from('history')
      .insert([{
        user_id: userId,
        title: result.title,
        description: result.description,
        score: result.score,
        status: result.status,
        sources: result.sources || [],
        created_at: new Date().toISOString()
      }]);

    if (error) throw error;
  } catch (err) {
    console.error("Geçmiş kaydetme hatası:", err);
  }
};

export const fetchUserHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Geçmiş getirme hatası:", err);
    return [];
  }
};