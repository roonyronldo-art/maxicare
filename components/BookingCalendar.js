"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/calendarTheme.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS, arSA } from "date-fns/locale";


import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const locales = {
  en: enUS,
  ar: arSA,
};

export default function BookingCalendar({ locale = "en" }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const localizer = useMemo(
    () =>
      dateFnsLocalizer({
        format,
        parse,
        startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 6 }),
        getDay,
        locales,
      }),
    []
  );

  // generate demo free slots next 5 days 10/12/14/16
  const events = useMemo(() => {
    const arr = [];
    const times = [17, 18, 19, 20, 21];
    const now = new Date();
    for (let d = 0; d < 365; d++) {
      times.forEach((h) => {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);
        if (date.getDay() === 5 || date.getDay() === 6) return; // skip Friday & Saturday
        const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, 0);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        arr.push({ title: t("available", "Available"), start, end, slotId: `${start.toISOString()}` });
      });
    }
    return arr;
  }, [t]);

  const book = async ({ start, end, slotId }) => {
    try {
      const res = await fetch('/api/booking', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start: start.toISOString(), end: end.toISOString() }),
      });
      const data = await res.json();
      if (!data.success) {
        setStatus(data.error || 'Booking failed');
        return;
      }
      setStatus(t('booking_success', 'Appointment booked successfully'));
      router.replace(`/${locale}/clinic/bookings`);
    } catch (e) {
      console.error('PB error', {
        status: e.status,
        message: e.message,
        data: e.response?.data || e.data,
      });
      console.log('PB data', e?.data);

      setStatus(e.message);
    }
  };

  const handleSelectEvent = (event) => book(event);
  const handleSelectSlot = (slotInfo) => book({ start: slotInfo.start, end: slotInfo.end });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2">
      {/* Manual navigation to avoid built-in toolbar issues */}
      <div className="flex justify-between items-center text-[#ffd15c] font-bold">
        <button onClick={() => setCurrentDate(new Date(currentDate.getTime() - 7*24*60*60*1000))}>
          ← Prev Week
        </button>
        <span>{currentDate.toLocaleDateString()}</span>
        <button onClick={() => setCurrentDate(new Date(currentDate.getTime() + 7*24*60*60*1000))}>
          Next Week →
        </button>
      </div>
      <Calendar
        min={new Date(1970, 0, 1, 17, 0)}
        max={new Date(1970, 0, 1, 22, 0)}
        date={currentDate}
        onNavigate={(d)=>setCurrentDate(d)}
        excludeDays={[5,6]}

        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={["week", "day"]}
        defaultView="week"
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
      />
      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  );
}
