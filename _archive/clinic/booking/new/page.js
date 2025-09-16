"use client";

import { useParams } from "next/navigation";
import BookingCalendar from "../../../../../components/BookingCalendar";

export default function NewBookingPage() {
  const { locale } = useParams();
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-80 space-y-6">
      <h1 className="text-2xl font-bold text-[#ffd15c]">
        {locale === "ar" ? "حجز موعد" : "Book an Appointment"}
      </h1>
      <BookingCalendar locale={locale} />
    </div>
  );
}
