import Image from 'next/image';


export default function EducationPage({ params: { locale } = {} }) {

  const lang = locale === 'en' ? 'en' : 'ar';
  const t = lang === 'en'
    ? {
        heroAlt: 'Healthcare Education',
        title: 'Education at Maxicare',
        intro: 'Our education program provides up-to-date medical knowledge, practical workshops and continuous learning resources for healthcare professionals and the community.',
        sectionHeading: 'What We Offer',
        offer1: 'Interactive workshops led by specialists',
        offer2: 'Up-to-date medical articles and videos',
        offer3: 'Community awareness campaigns',
        galleryHeading: 'Moments from Our Sessions'
      }
    : {
        heroAlt: 'التعليم الصحي',
        title: 'التعليم في ماكس كير',
        intro: 'يُقدِّم برنامج التعليم لدينا أحدث المعلومات الطبية وورش عمل تفاعلية وموارد تعلم مستمر للمتخصصين والجمهور.',
        sectionHeading: 'ماذا نقدم؟',
        offer1: 'ورش عمل تفاعلية يقودها مختصون',
        offer2: 'مقالات وفيديوهات طبية محدثة',
        offer3: 'حملات توعية مجتمعية',
        galleryHeading: 'لقطات من جلساتنا'
      };

  const gallery = [
    'https://images.unsplash.com/photo-1581091012184-7d48b1ccec41?auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1576092768243-b24e2c2f6b14?auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1585421514288-efb74c2b86e9?auto=format&fit=crop&w=500&q=60',
  ];

  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="w-full h-64 md:h-96 relative">
        <Image src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=60" alt={t.heroAlt} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center">{t.title}</h1>
        <p className="text-lg text-center leading-relaxed">{t.intro}</p>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{t.sectionHeading}</h2>
          <ul className="list-disc ps-6 space-y-2 text-gray-700">
            <li>{t.offer1}</li>
            <li>{t.offer2}</li>
            <li>{t.offer3}</li>
          </ul>
        </div>

        {/* Gallery */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{t.galleryHeading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((src) => (
              <div key={src} className="w-full h-40 relative rounded overflow-hidden">
                <Image src={src} alt="education" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/15551234567" // placeholder number
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.72 13.06c-.31-.15-1.83-.9-2.12-1.01-.28-.1-.49-.15-.7.15-.21.3-.8 1.01-.98 1.22-.18.2-.36.23-.67.08-.31-.15-1.3-.48-2.48-1.53-.92-.82-1.54-1.83-1.72-2.14-.18-.3-.02-.46.13-.61.13-.13.3-.33.45-.5.15-.16.2-.28.3-.46.1-.18.05-.34-.03-.49-.08-.15-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53-.18 0-.38-.01-.58-.01-.2 0-.53.08-.81.39-.28.31-1.07 1.04-1.07 2.53 0 1.48 1.09 2.92 1.25 3.13.15.2 2.14 3.28 5.18 4.6.72.31 1.28.5 1.72.64.72.22 1.37.19 1.88.12.57-.08 1.83-.75 2.09-1.47.26-.72.26-1.35.18-1.47-.08-.12-.28-.2-.58-.34z" />
        </svg>
      </a>
    </div>
  );
}
