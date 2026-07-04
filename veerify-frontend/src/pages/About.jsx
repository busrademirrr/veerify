import React from 'react';

const About = () => {
    return (
        <div className="pt-32 px-6 max-w-4xl mx-auto min-h-screen pb-20">
            <h1 className="text-4xl font-bold text-white mb-8 border-b border-gray-800 pb-4">Hakkında</h1>

            <div className="space-y-12">
                {/* Intro Section */}
                <section className="space-y-4">
                    <p className="text-gray-300 text-lg leading-relaxed">
                        İnternette her gün binlerce haberle karşılaşıyoruz.
                        Ama hangisi gerçekten doğru, hangisi eksik ya da yanıltıcı — çoğu zaman anlamak zor.
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        <span className="text-primary font-semibold">Veerify</span>, haberleri tek bir kaynağa bakarak değil, farklı ve güvenilir kaynaklarla karşılaştırarak değerlendiren bir doğrulama platformudur.
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        Amacımız; okuduğun bir haberin arka planını senin yerine taramak, benzer içerikleri bulmak ve <span className="italic text-white">"bu bilgi ne kadar tutarlı?"</span> sorusuna şeffaf bir cevap sunmak.
                    </p>
                </section>

                {/* Nasıl Çalışır */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Nasıl Çalışır?</h2>
                    <p className="text-gray-400 mb-4">Bir haber başlığı ya da metin girdiğinde, Veerify arka planda:</p>
                    <ul className="space-y-3 text-gray-300">
                        <li className="flex gap-3">
                            <span className="text-primary">✓</span>
                            <span>Farklı haber kaynaklarını tarar.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-primary">✓</span>
                            <span>Benzer içerikleri ve anlatıları karşılaştırır.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-primary">✓</span>
                            <span>Kaynak çeşitliliğini ve metin benzerliğini analiz eder.</span>
                        </li>
                    </ul>
                    <p className="text-gray-400 mt-4">
                        Sonuç olarak sana, haberin güvenilirliğine dair anlamlı bir skor ve ilgili kaynakları sunar.
                        Detayları karmaşık algoritmalarda bırakır, sonucu anlaşılır şekilde gösteririz.
                    </p>
                </section>

                {/* Neye İnanıyoruz */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Neye İnanıyoruz?</h2>
                    <ul className="space-y-3 text-gray-300">
                        <li className="flex gap-3">
                            <span className="text-primary">✓</span>
                            <span>Doğru bilgiye ulaşmak bir ayrıcalık değil, haktır.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-primary">✓</span>
                            <span>Tek bir kaynağa bağlı kalmak yanıltıcı olabilir.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-primary">✓</span>
                            <span>Şeffaflık, güvenin temelidir.</span>
                        </li>
                    </ul>
                    <p className="text-gray-300 mt-4 border-l-4 border-primary pl-4 py-2 bg-white/5 rounded-r-lg">
                        Veerify, "kesin doğru" demek yerine kanıta dayalı bir bakış açısı sunar.
                    </p>
                </section>

                {/* Kimler İçin */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Kimler İçin?</h2>
                    <ul className="space-y-3 text-gray-300">
                        <li className="flex gap-3">
                            <span className="text-primary">✓</span>
                            <span>Okuduğu haberi sorgulamak isteyenler</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-primary">✓</span>
                            <span>Sosyal medyada karşılaştığı bilgilerin kaynağını merak edenler</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-primary">✓</span>
                            <span>Hızlı ama yüzeysel değil, bilinçli tüketim yapmak isteyen herkes için</span>
                        </li>
                    </ul>
                </section>

                {/* Yolculuğumuz & Footer Tag */}
                <section className="pt-8 border-t border-gray-800">
                    <h2 className="text-2xl font-bold text-white mb-4">Yolculuğumuz</h2>
                    <p className="text-gray-300 leading-relaxed mb-8">
                        Veerify bir öğrenci projesi olarak başladı.
                        Ama hedefi büyük: dijital dünyada bilgiye olan güveni yeniden inşa etmek.
                    </p>

                    <div className="text-center py-8">
                        <span className="text-3xl font-serif italic text-primary/80">"truth, veerified"</span>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
