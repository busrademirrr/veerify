import React from 'react';

const Terms = () => {
    return (
        <div className="pt-32 px-6 max-w-4xl mx-auto min-h-screen pb-20">
            <h1 className="text-4xl font-bold text-white mb-2">Hizmet Şartları</h1>
            <p className="text-gray-400 mb-8 border-b border-gray-800 pb-8 text-sm">
                Bu Hizmet Şartları (“Şartlar”), Veerify platformunu (“Platform”) kullanan tüm kullanıcılar için geçerlidir.
                Platformu kullanarak aşağıda belirtilen şartları kabul etmiş sayılırsınız.
            </p>

            <div className="space-y-8">

                {/* Madde 1 */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-3">1. Platformun Amacı ve Kapsamı</h2>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        Veerify, açık kaynaklardan elde edilen metinler üzerinde otomatik analizler gerçekleştirerek benzerlik, tutarlılık ve eğilim (trend) değerlendirmeleri sunan bir bilgilendirme ve analiz platformudur.
                    </p>
                    <p className="text-gray-300 text-sm mb-2">Platformda sunulan içerikler:</p>
                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 ml-2">
                        <li>Kesin doğrular veya nihai yargılar değildir</li>
                        <li>Hukuki, akademik, gazetecilik veya profesyonel danışmanlık niteliği taşımaz</li>
                        <li>Yalnızca kullanıcıyı bilgilendirme amacıyla sunulur</li>
                    </ul>
                </section>

                {/* Madde 2 */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-3">2. Algoritmik Analiz ve Sınırlamalar</h2>
                    <p className="text-gray-300 text-sm mb-2">Veerify tarafından sunulan skorlar, özetler ve analizler:</p>
                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 ml-2 mb-3">
                        <li>Otomatik sistemler ve algoritmalar aracılığıyla üretilir</li>
                        <li>Olasılık ve benzerlik temellidir</li>
                        <li>Yanılma payı içerebilir</li>
                    </ul>
                    <p className="text-gray-300 text-sm italic border-l-2 border-gray-700 pl-3">
                        Algoritmalar zamanla geliştirilebilir, güncellenebilir veya değiştirilebilir. Aynı içerik için farklı zamanlarda farklı sonuçlar elde edilmesi mümkündür.
                    </p>
                </section>

                {/* Madde 3 */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-3">3. İçerik Kaynakları ve Telif Hakları</h2>
                    <p className="text-gray-300 text-sm mb-2">Platformda analiz edilen içerikler:</p>
                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 ml-2 mb-3">
                        <li>Herkese açık, yasal ve erişilebilir kaynaklardan elde edilir</li>
                        <li>robots.txt dosyaları ve ilgili yasal kısıtlamalar dikkate alınarak toplanır</li>
                    </ul>
                    <p className="text-gray-300 text-sm">
                        Analiz edilen haber metinleri ve içeriklerin telif hakları ilgili yayıncılara aittir. Veerify, bu içeriklerin sahibi değildir; yalnızca analiz ve özetleme hizmeti sunar.
                        Hak sahiplerinin talebi doğrultusunda ilgili içerikler platformdan kaldırılabilir.
                    </p>
                </section>

                {/* Madde 4 */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-3">4. Tarafsızlık ve Editoryal Bağımsızlık</h2>
                    <ul className="list-disc list-inside text-gray-300 text-sm space-y-2">
                        <li>Herhangi bir haber kuruluşu, siyasi yapı, kurum veya kişiyle bağlantılı değildir</li>
                        <li>İçeriklere manuel editoryal müdahalede bulunmaz</li>
                        <li>Tarafsız ve otomatik analiz prensibiyle çalışır</li>
                    </ul>
                </section>

                {/* Madde 5 */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-3">5. Kullanıcı Sorumlulukları</h2>
                    <p className="text-gray-300 text-sm mb-2">Kullanıcılar:</p>
                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 ml-2 mb-2">
                        <li>Platformda sunulan bilgileri kendi değerlendirmeleri doğrultusunda kullanmayı</li>
                        <li>Veerify tarafından sağlanan analizlerin kesin sonuçlar olmadığını</li>
                        <li>Platformun tek başına bir doğrulama kaynağı olarak kullanılmaması gerektiğini</li>
                    </ul>
                    <p className="text-gray-300 text-sm font-semibold">kabul eder.</p>
                </section>

                {/* Madde 6 */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-3">6. Sorumluluk Reddi</h2>
                    <p className="text-gray-300 text-sm mb-2">Veerify;</p>
                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 ml-2 mb-3">
                        <li>Analiz sonuçlarının doğruluğu, eksiksizliği veya güncelliği konusunda garanti vermez</li>
                        <li>Platform kullanımından doğabilecek doğrudan veya dolaylı zararlardan sorumlu tutulamaz</li>
                    </ul>
                    <p className="text-gray-300 text-sm">
                        Platformda sunulan bilgiler, kullanıcıların kendi araştırmalarıyla teyit edilmelidir.
                    </p>
                </section>

                {/* Madde 7 */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-3">7. Hizmet Değişiklikleri ve Erişim</h2>
                    <p className="text-gray-300 text-sm">
                        Veerify; platformun tamamında veya bir bölümünde önceden bildirimde bulunmaksızın değişiklik yapma veya hizmeti geçici/kalıcı olarak durdurma hakkını saklı tutar.
                    </p>
                </section>

                {/* Madde 8 */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-3">8. İletişim ve Kaldırma Talepleri</h2>
                    <p className="text-gray-300 text-sm">
                        Telif, içerik kaldırma veya diğer talepler için kullanıcılar aşağıdaki iletişim kanalı üzerinden platformla iletişime geçebilir:
                        <br />
                        <a href="mailto:iletisim@veerify.com" className="text-primary hover:underline mt-1 inline-block">info@veerify.co</a>
                    </p>
                </section>

                {/* Madde 9 */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-3">9. Yürürlük</h2>
                    <p className="text-gray-300 text-sm">
                        Bu Hizmet Şartları, platformda yayınlandığı tarihten itibaren yürürlüğe girer. Veerify’yi kullanmaya devam eden kullanıcılar, güncel şartları kabul etmiş sayılır.
                    </p>
                </section>

            </div>
        </div>
    );
};

export default Terms;
