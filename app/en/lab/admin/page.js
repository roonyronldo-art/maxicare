'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { verifyToken } from '@/lib/auth';

export default function LabAdminPage() {
  const router   = useRouter();
  const { locale } = useParams() || {};
  const basePath = locale ? `/${locale}` : '';

  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [requests, setRequests] = useState([]);

  /* modal state */
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('pending');
  const [reply,  setReply]  = useState('');

  /* fetch list */
  const refresh = useCallback(async () => {
    const res  = await fetch('/api/lab/requests?admin=1', { credentials: 'include' });
    const data = await res.json();
    if (res.ok) setRequests(data.requests || []);
  }, []);

  /* sync selected after refresh */
  const syncSelected = (id) => {
    const upd = requests.find(r => r.id === id);
    if (upd) {
      setSelected(upd);
      setStatus(upd.status || 'pending');
      setReply(upd.reply || '');
    }
  };

  /* ---------- handlers ---------- */
  async function uploadFile(e) {
    e.preventDefault();
    if (!selected) return;
    const file = e.target.file.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    await fetch(`/api/lab/requests/${selected.id}/attachment`, {
      method: 'POST', body: fd, credentials: 'include'
    });
    e.target.reset();
    await refresh();  syncSelected(selected.id);
  }

  async function saveStatus() {
    if (!selected) return;
    await fetch(`/api/lab/requests/${selected.id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      credentials: 'include'
    });
    await refresh();  syncSelected(selected.id);
  }

  async function sendReply() {
    if (!selected || !reply.trim()) return;
    await fetch(`/api/lab/requests/${selected.id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
      credentials: 'include'
    });
    setReply('');
    await refresh();  syncSelected(selected.id);
  }

  /* ---------- auth & initial load ---------- */
  useEffect(() => {
    const keyOK = document.cookie.includes('labAdmin=1');
    const tokenPair = document.cookie.split('; ').find(c => c.startsWith('token='));
    if (!keyOK && tokenPair) {
      const user = verifyToken(tokenPair.split('=')[1]);
      if (!user || user.role !== 'admin') {
        router.replace(`${basePath}/lab/admin/login`); return;
      }
    }
    if (!keyOK && !tokenPair) {
      router.replace(`${basePath}/lab/admin/login`); return;
    }
    (async () => {
      try { await refresh(); }
      catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, [router, refresh, basePath]);

  if (loading) return <main className="min-h-screen bg-black p-6 text-[#ffd15c]">Loading…</main>;
  if (error)   return <main className="min-h-screen bg-black p-6 text-red-500">{error}</main>;

  return (
    <main className="min-h-screen p-6 bg-black text-[#ffd15c]">
      <h1 className="text-2xl font-bold mb-6">Lab Admin Dashboard</h1>

      <table className="w-full text-sm border border-[#ffd15c]">
        <thead>
          <tr className="bg-[#ffd15c] text-black">
            <th className="p-2">ID</th>
            <th className="p-2">Description</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id}
                className="border-t border-[#ffd15c]/50 cursor-pointer hover:bg-[#ffd15c]/10"
                onClick={() => { setSelected(r); setStatus(r.status||'pending'); setReply(r.reply||''); setShowModal(true); }}>
              <td className="p-2">{r.id}</td>
              <td className="p-2 truncate max-w-xs">{r.description}</td>
              <td className="p-2">{r.userName || '-'}</td>
              <td className="p-2">{r.userEmail || '-'}</td>
              <td className="p-2">{new Date(r.created).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black border-2 border-[#ffd15c] p-6 w-[90%] max-w-xl space-y-4 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold">Request #{selected.id}</h2>
            <p className="whitespace-pre-line">{selected.description}</p>

            <div>
              <h3 className="font-semibold mb-1">Attachments</h3>
              {(selected.attachments||'').split(',').filter(Boolean).length
                ? (selected.attachments||'').split(',').filter(Boolean)
                    .map(p => {
                      const url = p.startsWith('u:') || p.startsWith('a:') ? p.slice(2) : p;
                      return <a key={p} href={url} download className="block text-sm text-blue-400 underline break-all hover:text-blue-300">Download</a>;
                    })
                : <span className="text-xs">No attachments</span>}
            </div>

            <form onSubmit={uploadFile} className="space-y-2">
              <input type="file" name="file" className="text-sm" />
              <button className="bg-[#ffd15c] text-black px-3 py-1 rounded">Upload</button>
            </form>

            <div className="space-x-2">
              <select value={status} onChange={e=>setStatus(e.target.value)} className="bg-black border p-1">
                <option value="pending">pending</option>
                <option value="in-progress">in-progress</option>
                <option value="closed">closed</option>
              </select>
              <button onClick={saveStatus} className="bg-[#ffd15c] text-black px-3 py-1 rounded">Save Status</button>
            </div>

            <textarea className="w-full bg-black border p-2" rows={3}
                      value={reply} onChange={e=>setReply(e.target.value)}
                      placeholder="Write reply…"/>
            <button onClick={sendReply} className="bg-[#ffd15c] text-black px-3 py-1 rounded">Send Reply</button>

            <button onClick={()=>setShowModal(false)} className="block text-center underline mt-2">Close</button>
          </div>
        </div>
      )}
    </main>
  );
}