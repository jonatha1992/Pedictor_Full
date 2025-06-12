import { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/contact/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value || '',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSubmitStatus({ type: 'success', message: '¡Mensaje enviado correctamente!' });
                setFormData({ name: '', email: '', message: '' });
            } else {
                const errorData = await response.json();
                setSubmitStatus({
                    type: 'error',
                    message: errorData.message || 'Error al enviar el mensaje. Por favor, intenta nuevamente.'
                });
            }
        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: 'Error de conexión. Por favor, verifica tu conexión a internet.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl p-6 mx-auto bg-gradient-to-br from-green-800 to-primary border-2 border-green-700 rounded-xl shadow-2xl">
            <h2 className="mb-6 text-3xl font-extrabold text-center text-highlight bg-black/40 border-2 border-highlight rounded-full px-6 py-2 drop-shadow-lg" style={{ letterSpacing: '0.08em' }}>
                Contáctanos
            </h2>

            {submitStatus && (
                <div className={`mb-4 p-4 rounded-md ${submitStatus.type === 'success'
                    ? 'bg-green-100 border border-green-400 text-green-700'
                    : 'bg-red-100 border border-red-400 text-red-700'
                    }`}>
                    {submitStatus.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-bold text-highlight">
                        Nombre completo *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border-2 border-highlight rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight bg-black/30 text-white placeholder:text-white/70"
                        placeholder="Ingresa tu nombre completo"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-bold text-highlight">
                        Correo electrónico *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border-2 border-highlight rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight bg-black/30 text-white placeholder:text-white/70"
                        placeholder="tu@email.com"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block mb-2 text-sm font-bold text-highlight">
                        Mensaje *
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border-2 border-highlight rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight bg-black/30 text-white placeholder:text-white/70 resize-vertical"
                        placeholder="Escribe tu mensaje aquí..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-full font-extrabold text-primary transition-colors border-2 border-highlight shadow-xl bg-highlight hover:bg-white hover:text-secondary focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                </button>
            </form>

            <div className="pt-6 mt-8 border-t-2 border-highlight">
                <h3 className="mb-4 text-lg font-bold text-highlight">Otras formas de contacto</h3>
                <div className="space-y-2 text-white/90">
                    <p>📧 Email: <span className="text-highlight">soporte@spinpredictor.com</span></p>
                    <p>📱 WhatsApp: <span className="text-highlight">+1 (555) 123-4567</span></p>
                    <p>🕒 Horario de atención: <span className="text-highlight">Lunes a Viernes, 9:00 AM - 6:00 PM</span></p>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
