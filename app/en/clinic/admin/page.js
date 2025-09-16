'use client';

import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'clinicadmin';
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ClinicAdmin() {
  // ------------- hooks (لا تغيّر ترتيبها) -------------
  const [key, setKey] = useState('');
  const [auth, setAuth] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState({ id: null, text: '' });

  // ---------- جلب البيانات ----------
  const loadData = async () => {
    const sch = await fetch('/api/admin/schedule').then(r => r.json());
    const ap  = await fetch('/api/admin/appointments').then(r => r.json());
    setSchedules(sch.schedules || []);
    setAppts(ap.appointments   || []);
  };

  useEffect(() => { if (auth) loadData(); }, [auth]);

  const saveSchedule = async (id, startHour, endHour) => {
    setLoading(true);
    await fetch('/api/admin/schedule', {
      method: 'PUT',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ id, startHour, endHour })
    });
    await loadData();
    setLoading(false);
  };

  const updateAppt = async (id, action, report='') => {
    setLoading(true);
    await fetch('/api/admin/appointments', {
      method: 'PUT',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ id, action, report }),
    });
    await loadData();
    setLoading(false);
  };

  // ---------- شاشة تسجيل الدخول ----------
  if (!auth) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Clinic Admin Login</h1>
        <input
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded mb-3"
          type="password"
          placeholder="Enter admin key"
          value={key}
          onChange={e => setKey(e.target.value)}
        />
        <button
          className="bg-[#ffd15c] text-black font-bold py-2 px-6 rounded"
          onClick={() => setAuth(key === ADMIN_KEY)}
        >
          Enter
        </button>
        <p className="mt-4 text-sm opacity-60">
          Default key: <code>{ADMIN_KEY}</code>
        </p>
      </main>
    );
  }

  // ---------- لوحة التحكم ----------
  return (
    <main className="min-h-screen bg-black text-white p-6 space-y-10">
      <h1 className="text-3xl font-bold">Clinic Admin Dashboard</h1>

      {/* ساعات العمل */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Working Hours</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#ffd15c]">
              <th className="p-2">Day</th>
              <th className="p-2">Start</th>
              <th className="p-2">End</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(s => (
              <tr key={s.id} className="border-t border-gray-700">
                <td className="p-2">{days[s.dayOfWeek]}</td>
                <td className="p-2">
                  <input id={`st-${s.id}`} defaultValue={s.startHour} type="number" min="0" max="23"
                         className="bg-gray-800 w-16 px-1" />
                </td>
                <td className="p-2">
                  <input id={`en-${s.id}`} defaultValue={s.endHour} type="number" min="1" max="24"
                         className="bg-gray-800 w-16 px-1" />
                </td>
                <td className="p-2">
                  <button
                    disabled={loading}
                    className="bg-[#ffd15c] text-black px-3 py-1 rounded"
                    onClick={() => {
                      const sh = parseInt(document.getElementById(`st-${s.id}`).value,10);
                      const eh = parseInt(document.getElementById(`en-${s.id}`).value,10);
                      saveSchedule(s.id, sh, eh);
                    }}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* الحجوزات */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Appointments (last 7 days)</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#ffd15c]">
              <th className="p-2">Date</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Status</th>
              <th className="p-2">Report</th>
              <th className="p-2">Attach</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {appts.map(a => (
              <tr key={a.id} className="border-t border-gray-700">
                <td className="p-2">{new Date(a.start).toLocaleString()}</td>
                <td className="p-2">{a.userName || '-'}</td>
                <td className="p-2">{a.userEmail || '-'}</td>
                <td className="p-2 capitalize">{a.status}</td>
                <td className="p-2">
                  {editing.id === a.id ? (
                    <div className="flex items-center space-x-2">
                      <input value={editing.text} onChange={e=>setEditing({id:a.id,text:e.target.value})} className="bg-gray-800 px-2 py-1 rounded w-40" placeholder="write report" />
                      <button className="bg-[#ffd15c] text-black px-2 py-1 rounded" disabled={loading || !editing.text.trim()} onClick={()=>updateAppt(a.id, undefined, editing.text)}>Save</button>
                      <button className="bg-gray-700 px-2 py-1 rounded" onClick={()=>setEditing({id:null,text:''})}>Cancel</button>
                    </div>
                  ) : a.report ? (
                    <span className="text-green-400 cursor-pointer underline" onClick={()=>setEditing({id:a.id,text:a.report})}>{a.report}</span>
                  ) : (
                    a.status==='confirmed' && <button className="bg-gray-700 px-2 py-1 rounded" onClick={()=>setEditing({id:a.id,text:''})}>Add</button>
                  )}
                </td>
                <td className="p-2">
                  {a.attachment ? (
                    <a href={a.attachment} target="_blank" className="underline text-blue-400">View</a>
                  ) : (
                    <input type="file" id={`file-${a.id}`} className="hidden" onChange={async (e)=>{
                      const f=e.target.files?.[0];
                      if(!f) return;
                      const form=new FormData();
                      form.append('id',a.id);
                      form.append('file',f);
                      setLoading(true);
                      await fetch('/api/admin/appointments/upload',{method:'POST',body:form});
                      await loadData();
                      setLoading(false);
                    }} />
                  )}
                  {!a.attachment && (
                    <button disabled={loading} className="bg-gray-700 px-2 py-1 rounded" onClick={()=>document.getElementById(`file-${a.id}`).click()}>Upload</button>
                  )}
                </td>
                <td className="p-2 space-x-2">
                  {a.status !== 'cancelled' && (
                    <button disabled={loading}
                      className="bg-red-600 px-3 py-1 rounded"
                      onClick={() => updateAppt(a.id,'cancel')}>Cancel</button>
                  )}
                  {a.status === 'pending' && (
                    <button disabled={loading}
                      className="bg-green-600 px-3 py-1 rounded"
                      onClick={() => updateAppt(a.id,'confirm')}>Confirm</button>
                  )}
                </td>
              </tr>
            ))}
            {appts.length === 0 && (
              <tr><td className="p-2">No appointments.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}