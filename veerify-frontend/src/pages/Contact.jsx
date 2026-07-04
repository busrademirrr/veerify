import React from 'react';

const Contact = () => {
    return (
        <div className="pt-24 px-6 max-w-4xl mx-auto min-h-[60vh]">
            <h1 className="text-3xl font-bold text-white mb-6">İletişim</h1>
            <p className="text-gray-400 leading-relaxed mb-4">
                Bizimle iletişime geçmek için aşağıdaki kanalları kullanabilirsiniz.
            </p>
            <div className="text-gray-300">
                <p>Email: <a href="mailto:info@veerify.co" className="text-primary hover:underline">info@veerify.co</a></p>
            </div>
        </div>
    );
};

export default Contact;
