import Image from 'next/image';

export default function ContactPage({ params: { locale } = {} }) {
  const lang = locale === 'en' ? 'en' : 'ar';
  const t = lang === 'en'
    ? {
        heroAlt: 'Contact Us',
        title: 'Get in touch',
        phone: 'Phone',
        email: 'Email',
        location: 'Location',
        followUs: 'Follow us',
      }
    : {
        heroAlt: 'اتصل بنا',
        title: 'تواصل معنا',
        phone: 'الهاتف',
        email: 'البريد الإلكتروني',
        location: 'الموقع',
        followUs: 'تابعنا',
      };

  return (
    <div className="relative">
      {/* Hero */}
      <div className="w-full h-56 md:h-80 relative">
        <Image
          src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1400&q=60"
          alt={t.heroAlt}
          fill
          className="object-cover"
        />
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center">{t.title}</h1>

        {/* Contact details */}
        <div className="space-y-4 text-lg">
          <p>
            <span className="font-semibold me-2">{t.phone}:</span>
            <a href="tel:+15551234567" className="text-blue-600 hover:underline">+1 555 123 4567</a>
          </p>
          <p>
            <span className="font-semibold me-2">WhatsApp:</span>
            <a href="https://wa.me/15551234567" target="_blank" className="text-green-600 hover:underline">+1 555 123 4567</a>
          </p>
          <p>
            <span className="font-semibold me-2">{t.email}:</span>
            <a href="mailto:clinic@example.com" className="text-blue-600 hover:underline">clinic@example.com</a>
          </p>
          <p>
            <span className="font-semibold me-2">{t.location}:</span>
            <a href="https://maps.app.goo.gl/eQTu3jCRFWpb5USs7" target="_blank" className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              123 Maxicare St, Cairo, Egypt
            </a>
          </p>
        </div>

        {/* Social */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{t.followUs}</h2>
          <div className="flex gap-6 text-2xl">
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" aria-label="Facebook" className="text-blue-700 hover:opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.988 3.657 9.128 8.438 9.88v-6.987H7.898v-2.893h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.893h-2.33v6.987C18.343 21.128 22 16.988 22 12" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" aria-label="Instagram" className="text-pink-600 hover:opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M7 2C4.79 2 3 3.79 3 6v12c0 2.21 1.79 4 4 4h10c2.21 0 4-1.79 4-4V6c0-2.21-1.79-4-4-4H7zm10 2c1.103 0 2 .897 2 2v12c0 1.103-.897 2-2 2H7c-1.103 0-2-.897-2-2V6c0-1.103.897-2 2-2h10zm-5 3c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm4.5-.5a1 1 0 110 2 1 1 0 010-2z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn" className="text-sky-700 hover:opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.337-.026-3.059-1.865-3.059-1.867 0-2.154 1.458-2.154 2.965v5.698h-3v-10h2.881v1.367h.041c.401-.756 1.379-1.556 2.841-1.556 3.042 0 3.604 2.003 3.604 4.605v5.584z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
