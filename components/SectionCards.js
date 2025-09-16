"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import useConfig from '@/lib/useConfig';
import { pb } from '@/lib/pocketbase';

export default function SectionCards() {
  const { config } = useConfig();
  const { t } = useTranslation();

  const cards = [
    {
      key: "clinic",
      descKey: "clinic_desc",
      img: "https://images.pexels.com/photos/305566/pexels-photo-305566.jpeg?auto=compress&cs=tinysrgb&h=600&w=400",
    },
    {
      key: "lab",
      descKey: "lab_desc",
      img: "https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&h=600&w=400",
    },
    {
      key: "education",
      descKey: "education_desc",
      img: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const { i18n } = useTranslation();
  const localePrefix = `/${i18n.language}`;

  return (
    <section id="sections" className="container mx-auto px-4 pt-0 pb-16 mt-4">
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map(({ key, descKey, img }) => (
          <div key={key} className="p-[2px] bg-black rounded-xl hover:scale-105 transition-transform duration-300 group">
            <div className="card bg-base-100 rounded-lg shadow-md group-hover:shadow-xl transition">
              <div className="card-body items-center text-center">
                <Link href={`${localePrefix}/${key}`} className="block">

                  <img
                    data-field={`${key}_image`}
                    src={(() => {
                      let val = config?.[`${key}_image`];
                      if (Array.isArray(val)) val = val[0];
                      if (!val) return img;
                      return val.startsWith('http') || val.startsWith('/') ? val : pb.files.getURL(config, val);
                    })()}
                    alt={key}
                    width={400}
                    height={600}
                    className="w-full h-64 object-cover rounded-md cursor-pointer"
                  />
                </Link>
                {config?.[`${key}_title`] && config[`${key}_title`].trim() && (
                  <h2 data-field={`${key}_title`} className="card-title" suppressHydrationWarning>
                    {config[`${key}_title`]}
                  </h2>
                )}
                {config?.[`${key}_desc`] && config[`${key}_desc`].trim() && (
                  <p data-field={`${key}_desc`} className="opacity-80" suppressHydrationWarning>
                    {config[`${key}_desc`]}
                  </p>
                )}
                <Link
                  data-field={`${key}_btn`}
                  href={`${localePrefix}/${key}`}
                  className="bg-black border-2 border-black text-[#ffd15c] font-extrabold px-8 py-3 text-lg rounded-lg shadow-lg hover:bg-[#ffd15c] hover:text-black w-full mt-4"
                  suppressHydrationWarning
                >
                  {config?.[`${key}_btn`] ?? t(key, key.charAt(0).toUpperCase() + key.slice(1))}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
