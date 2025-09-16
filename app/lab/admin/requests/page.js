'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LabRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReqs() {
      try {
        const res = await fetch('/api/lab/requests');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (e) {
        setError(e.message);
      }
    }
    fetchReqs();
  }, []);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Lab Requests</h1>
      <Link href="/lab/admin" className="text-blue-600 underline text-sm">&larr; Back to Admin</Link>
      {error && <p className="text-red-600 my-2">{error}</p>}
      <table className="w-full border mt-4 text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">User</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="border p-2">{r.user}</td>
              <td className="border p-2 max-w-xs truncate" title={r.description}>{r.description}</td>
              <td className="border p-2">{r.status || 'pending'}</td>
              <td className="border p-2">{new Date(r.created).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
