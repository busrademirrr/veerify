import React from 'react';

const FAQ = () => {
    return (
        <div className="pt-32 px-6 max-w-5xl mx-auto min-h-screen pb-20">
            <h1 className="text-4xl font-bold text-white mb-12 border-b border-gray-800 pb-4">Sıkça Sorulan Sorular</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Soru 1 */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
                    <h3 className="text-white font-bold text-lg mb-3">Veerify haberleri nasıl analiz ediyor?</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Veerify, girilen haber metnini farklı kaynaklardaki benzer içeriklerle karşılaştırır.
                        Bu karşılaştırma; metin benzerliği, anlatım tutarlılığı ve kaynak çeşitliliği gibi faktörlere dayanır.
                        Amaç, bir haberin tekil mi yoksa yaygın ve tutarlı bir anlatının parçası mı olduğunu anlamaktır.
                    </p>
                </div>

                {/* Soru 2 */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
                    <h3 className="text-white font-bold text-lg mb-3">Verilen skor neyi ifade ediyor?</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Skor, haberin diğer kaynaklarla ne ölçüde örtüştüğünü gösterir.
                        Yüksek skor; benzer içeriklerin farklı ve bağımsız kaynaklarda yer aldığını, düşük skor ise bilginin sınırlı ya da tutarsız olabileceğini işaret eder.
                        Bu bir “doğru / yanlış” etiketi değil, güvenilirlik göstergesidir.
                    </p>
                </div>

                {/* Soru 3 */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
                    <h3 className="text-white font-bold text-lg mb-3">Aynı haber neden %100 skor almayabilir?</h3>
                    <div className="text-gray-400 text-sm leading-relaxed">
                        <p className="mb-2">Birebir aynı içerikler bile;</p>
                        <ul className="list-disc list-inside space-y-1 ml-1 text-gray-500">
                            <li>Farklı bağlamlarda yazılmış olabilir</li>
                            <li>Özetlenmiş ya da yeniden formüle edilmiş olabilir</li>
                            <li>Kaynak çeşitliliği açısından sınırlı kalabilir</li>
                        </ul>
                        <p className="mt-2">Bu yüzden Veerify, mutlak değerler yerine gerçekçi ve temkinli skorlar üretir.</p>
                    </div>
                </div>

                {/* Soru 4 */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
                    <h3 className="text-white font-bold text-lg mb-3">Algoritma hangi kriterleri dikkate alıyor?</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
                        <li>Metinler arası anlamsal benzerlik</li>
                        <li>Kaynakların çeşitliliği</li>
                        <li>İçeriklerin birbirini ne kadar desteklediği</li>
                    </ul>
                    <p className="text-gray-500 text-xs mt-3 italic">Teknik detaylar arka planda kalır; kullanıcıya sadece anlamlı sonuç gösterilir.</p>
                </div>

                {/* Soru 5 */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
                    <h3 className="text-white font-bold text-lg mb-3">Veerify bir doğrulama otoritesi mi?</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        <strong className="text-white">Hayır.</strong> Veerify, kesin hükümler veren bir otorite değil; karar vermeni kolaylaştıran bir araçtır.
                        Son yorum her zaman kullanıcıya aittir.
                    </p>
                </div>

                {/* Soru 6 */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
                    <h3 className="text-white font-bold text-lg mb-3">Kaynaklar nasıl seçiliyor?</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Sistem, düzenli olarak güncellenen ve kamuya açık haber kaynaklarını kullanır.
                        Tek bir kaynağa bağımlı kalmadan, farklı bakış açılarını birlikte değerlendirmeyi hedefler.
                    </p>
                </div>

                {/* Soru 7 */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
                    <h3 className="text-white font-bold text-lg mb-3">İçerikler saklanıyor mu?</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Analiz süreçleri sistemin gelişimi için anonim şekilde kullanılır.
                        Kişisel veriler veya kullanıcı davranışları üçüncü taraflarla paylaşılmaz.
                    </p>
                </div>

                {/* Soru 8 */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
                    <h3 className="text-white font-bold text-lg mb-3">Neden “Veerify”?</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Çünkü amacımız “doğruyu iddia etmek” değil, doğrunun ne kadar desteklendiğini göstermek.
                    </p>
                </div>

            </div>

            <div className="text-center py-8">
                <span className="text-3xl font-serif italic text-primary/80">"truth, veerified"</span>
            </div>
        </div>
    );
};

export default FAQ;
