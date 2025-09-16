'use client';

import { useEffect, useState } from 'react';
import { format, formatISO } from 'date-fns';

export const dynamic = 'force-dynamic';

function dayKeyISO(iso){return iso.slice(0,10);} /* keeps UTC date */
function filteredSlots(d,list){return list.filter(s=>dayKeyISO(s)===d);}
function nextDays(list){
  const keys=[...new Set(list.map(s=>dayKeyISO(s)))];
  return keys.slice(0,90);
}

export default function BookAppointment() {
  const [slots, setSlots] = useState([]);
  const [history, setHistory] = useState([]);
  const [day, setDay] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  function safeJson(res) {
    if (!res.ok) return null;
    return res.text().then(t => (t ? JSON.parse(t) : null));
  }

  useEffect(() => {
    (async () => {
      const sData = await safeJson(await fetch('/api/calendar/slots', { credentials: 'include' }));
      if (sData?.slots) {
        setSlots(sData.slots);
        const uniqueDays = [...new Set(sData.slots.map(iso => iso.slice(0,10)))];
        setDay(uniqueDays[0] || '');
      }

      const hData = await safeJson(await fetch('/api/calendar/history', { credentials: 'include' }));
      if (hData?.visits) setHistory(hData.visits);
    })();
  }, []);

  async function book(iso) {
    setLoading(true);
    const res = await fetch('/api/calendar/book', {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ datetimeISO: iso }),
    });

    setLoading(false);

    if (res.ok) {
      setMsg('Booked!');
      setSlots((prev) => prev.filter((s) => s !== iso));

      const h = await fetch('/api/calendar/history', { credentials: 'include' }).then((r) => r.json());
      if (h.visits) setHistory(h.visits);
    } else {
      const { error } = await res.json();
      setMsg(error || 'Error');
    }
  }

  return (
    <main className="min-h-screen text-white bg-black p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Book Appointment</h1>
      {nextDays(slots).length>0 && (
        <select value={day} onChange={e=>setDay(e.target.value)} className="mb-6 bg-gray-800 border border-gray-700 px-3 py-2 rounded max-w-xs overflow-auto">
          {nextDays(slots).map(d=> (
            <option key={d} value={d}>
              {new Date(d+ 'T00:00:00').toDateString()}
            </option>
          ))}
        </select>
      )}

      {msg && <p className="mb-4 text-[#ffd15c]">{msg}</p>}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-5xl mb-12">
        {day && filteredSlots(day, slots).length === 0 && <p>No slots available</p>}

        {filteredSlots(day, slots).map((iso) => (
          <button
            key={iso}
            disabled={loading}
            onClick={() => book(iso)}
            className="border-2 border-[#ffd15c] rounded py-3 px-2 hover:bg-[#ffd15c]/20 disabled:opacity-50"
          >
            {format(new Date(iso), 'EEE dd MMM, hh:mm a')}
          </button>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Visit History (last 30 days)</h2>

      <div className="w-full max-w-3xl bg-gray-900 p-4 rounded-lg overflow-auto">
        {history.length === 0 ? (
          <p>No visits yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#ffd15c] text-left">
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Report</th>
                <th className="py-2 px-2">Attach</th>
              </tr>
            </thead>
            <tbody>
              {history.map((v) => (
                <tr key={v.id} className="border-t border-gray-700">
                  <td className="py-2 px-2">
                    {format(new Date(v.start), 'dd MMM yyyy, hh:mm a')}
                  </td>
                  <td className="py-2 px-2">{v.report || '-'}</td>
                  <td className="py-2 px-2">{v.attachment ? (<a href={v.attachment} target="_blank" className="underline text-blue-400">View</a>) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}