'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function StatusBadge({ status }) {
  const color = status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'yellow';
  return (
    <span className={`px-2 py-1 rounded text-xs text-white bg-${color}-600`}>{status}</span>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.status === 401) {
        router.replace('/clinic/admin/login');
        return;
      }
      const data = await res.json();
      setUsers(data);
      // fetch unread counts for each latest booking
      const counts = {};
      await Promise.all(
        data.map(async (u) => {
          const b = u.bookings?.[0];
          if (b) {
            try {
              const r = await fetch(`/api/messages?bookingId=${b.id}&unreadOnly=1`, { credentials: 'include' });
              if (r.ok) {
                const msgs = await r.json();
                if (msgs.length) counts[b.id] = msgs.length;
              }
            } catch {}
          }
        })
      );
      setUnreadCounts(counts);
    } catch (e) {
      console.error(e);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const i = setInterval(fetchUsers, 10000);
    return () => clearInterval(i);
  }, []);

  const handleChatOpen = async (bookingId) => {
    // optimistically clear
    setUnreadCounts((prev) => ({ ...prev, [bookingId]: 0 }));
    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ bookingId }),
    });
  };

  const changeStatus = async (bookingId, status) => {
    await fetch('/api/bookings/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, status }),
    });
    fetchUsers();
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4 overflow-x-auto mt-88">

      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-black text-[#ffd15c] text-left text-lg font-semibold">
            <th className="p-3 text-[#ffd15c]">Patient</th>
            <th className="p-3 text-[#ffd15c]">Email</th>
            <th className="p-3 text-[#ffd15c]">Date</th>
            <th className="p-3 text-[#ffd15c]">Status</th>
            <th className="p-3 text-[#ffd15c]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const b = u.bookings?.[0];
            return (
            <tr key={u.id} className="border-t text-base">
              <td className="p-3">{u.name || '-'}</td>
              <td className="p-3">{u.email || '-'}</td>
              <td className="p-3">{b ? new Date(b.date).toLocaleString() : '-'}</td>
              <td className="p-3">{b ? <StatusBadge status={b.status} /> : '-'}</td>
              <td className="p-3 space-x-2">
                {b && b.status === 'pending' && (
                  <>
                    <button
                      className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                      onClick={() => changeStatus(b.id, 'approved')}
                    >Approve</button>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                      onClick={() => changeStatus(b.id, 'rejected')}
                    >Reject</button>
                  </>
                )}
                <button
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                  onClick={() => {
                    if (!b) return;
                    handleChatOpen(b.id);
                    router.push(`/clinic/admin/messages?bookingId=${b.id}`);
                  }}
                >Messages{unreadCounts[b?.id] ? <span className="ml-1 inline-flex items-center justify-center bg-red-600 text-white font-bold rounded-full px-2 text-sm">{unreadCounts[b.id]}</span> : null}</button>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
