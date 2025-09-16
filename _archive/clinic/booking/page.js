"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// /[locale]/clinic/booking  →  /[locale]/clinic/bookings
export default function BookingRedirectPage() {
  const router = useRouter();
  const { locale } = useParams();

  useEffect(() => {
    if (locale) router.replace(`/${locale}/clinic/bookings`);
  }, [locale, router]);

  return null;
}