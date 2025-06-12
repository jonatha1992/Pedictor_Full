import ContactForm from '../components/ContactForm';

const Contact = () => {
    return (
        <div className="min-h-screen py-12 bg-gradient-to-br from-gray-900 via-green-900 to-black">
            <div className="container px-4 mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-extrabold text-highlight drop-shadow-lg">
                        ¿Necesitas ayuda?
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-white/90">
                        Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
                    </p>
                </div>

                <ContactForm />

                <div className="grid max-w-4xl gap-8 mx-auto mt-16 md:grid-cols-3">
                    <div className="p-6 text-center border-2 shadow-2xl border-highlight rounded-xl bg-black/40">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-900 to-blue-700">
                            <svg className="w-8 h-8 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-highlight">Email</h3>
                        <p className="text-white/90">soporte@spinpredictor.com</p>
                    </div>

                    <div className="p-6 text-center border-2 shadow-2xl border-highlight rounded-xl bg-black/40">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-900 to-green-700">
                            <svg className="w-8 h-8 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-highlight">WhatsApp</h3>
                        <p className="text-white/90">+1 (555) 123-4567</p>
                    </div>

                    <div className="p-6 text-center border-2 shadow-2xl border-highlight rounded-xl bg-black/40">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-900 to-purple-700">
                            <svg className="w-8 h-8 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-highlight">Horarios</h3>
                        <p className="text-white/90">Lun - Vie: 9AM - 6PM</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
