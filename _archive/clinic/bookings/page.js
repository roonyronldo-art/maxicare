"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function BookingsHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const router = useRouter();

  const handleChatOpen = async (bookingId) => {
    try {
      // optimistically clear badge
      setUnreadCounts((prev) => ({ ...prev, [bookingId]: 0 }));
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookingId }),
      });
      // counts will refresh on next interval
    } catch (e) {
      console.error(e);
    }
  };
  const { locale } = useParams(); // ex: en, ar …

  // ───── fetch user bookings ─────
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/booking", { credentials: 'include' });
      if (res.status === 401) {
        router.replace(`/${locale}/clinic/login`);
        return;
      }
      const data = await res.json();
      if (data.length === 0) {
        router.replace(`/${locale}/clinic/booking/new`);
        return;
      }
      setBookings(data);

      // unread counts
      const counts = {};
      await Promise.all(
        data.map(async (b) => {
          try {
            const r = await fetch(`/api/messages?bookingId=${b.id}&unreadOnly=1`, { credentials: 'include' });
            if (r.ok) {
              const msgs = await r.json();
              if (msgs.length) counts[b.id] = msgs.length;
            }
          } catch {}
        })
      );
      setUnreadCounts(counts);
    } catch (e) {
      console.error(e);
    }
  };


  useEffect(() => {
    fetchBookings();
    const i = setInterval(fetchBookings, 10000);
    return () => clearInterval(i);
  }, []);

  const statusColor = (s) => {
    switch (s) {
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      case "needs_edit":
        return "text-yellow-400";
      default:
        return "text-gray-300"; // pending
    }
  };

  // ───── UI ─────
  return (
    <div className="max-w-2xl mx-auto p-6 mt-80">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#ffd15c]">My Bookings</h1>
        <Link
          href={`/${locale}/clinic/booking/new`}
          className="bg-black border-2 border-[#ffd15c] text-[#ffd15c] px-3 py-1 rounded hover:bg-black/80 text-sm"
        >
          Another Booking
        </Link>
      </div>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-400">No bookings yet.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-black text-[#ffd15c]">
              <th className="border border-[#ffd15c] px-2 py-1 text-[#ffd15c]">Date</th>
              <th className="border border-[#ffd15c] px-2 py-1 text-[#ffd15c]">Status</th>
              <th className="border border-[#ffd15c] px-2 py-1 text-[#ffd15c]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const date = new Date(b.date);
              return (
                <tr key={b.id} className="text-center">
                  <td className="border border-[#ffd15c] px-2 py-1 text-[#ffd15c]">
                    {date.toLocaleDateString()}{" "}
                    {date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td
                    className={`border border-[#ffd15c] px-2 py-1 ${statusColor(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </td>

                  <td className="border border-[#ffd15c] px-2 py-1 text-[#ffd15c]">
                    {/* Details page */}
                    <Link
                      href={`/${locale}/clinic/booking/${b.id}`}
                      className="underline text-[#ffd15c] mr-2"
                    >
                      Details
                    </Link>

                    {/* Chat page */}
                    <Link
                      href={`/${locale}/clinic/messages?bookingId=${b.id}`}
                      onClick={() => handleChatOpen(b.id)}
                      className="underline text-[#ffd15c]"
                    >
                      {'Chat'}{unreadCounts[b.id] ? <span className="ml-1 inline-flex items-center justify-center bg-red-600 text-white font-bold rounded-full px-2 text-sm">{unreadCounts[b.id]}</span> : null}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}