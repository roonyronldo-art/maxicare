// ========== Server Wrapper ==========
export const dynamic = 'force-dynamic';
import { Suspense } from 'react';

export default function MessagesPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10 text-[#ffd15c]">Loading…</p>}>
      <MessagesClient />
    </Suspense>
  );
}

// ========== Client Component ==========
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function MessagesClient() {
  const router = useRouter();
  const params = useSearchParams();
  const bookingId = params?.get('bookingId');

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const fileInput = useRef(null);
  const photoInput = useRef(null);
  const bottomRef = useRef(null);
  const listRef = useRef(null);

  async function fetchMessages() {
    if (!bookingId) return;
    const listEl = listRef.current;
    const offset =
      (listEl?.scrollHeight || 0) -
      (listEl?.scrollTop || 0) -
      (listEl?.clientHeight || 0);

    const res = await fetch(`/api/messages?bookingId=${bookingId}`, { credentials: 'include' });
    if (res.status === 401) return router.replace('/clinic/admin/login');
    setMessages((await res.json()) || []);

    setTimeout(() => {
      const list = listRef.current;
      if (!list) return;
      if (offset < 5) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      else list.scrollTop = list.scrollHeight - list.clientHeight - offset;
    }, 0);
  }

  useEffect(() => {
    fetchMessages();
    const id = setInterval(fetchMessages, 5000);
    return () => clearInterval(id);
  }, [bookingId]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text && !file) return;
    const form = new FormData();
    form.append('bookingId', bookingId ?? '');
    if (text) form.append('text', text);
    if (file) form.append('file', file);
    await fetch('/api/messages', { method: 'POST', body: form, credentials: 'include' });
    setText('');
    setFile(null);
    fetchMessages();
  }

  const renderMsg = (m) => {
    const mine = (m.sender || '').toLowerCase() === 'admin';
    return (
      <div
        key={m.id}
        className={`max-w-xs mb-2 p-2 rounded text-sm ${mine ? 'bg-[#ffd15c] text-black self-end' : 'bg-gray-700 text-white self-start'}`}
      >
        {m.text && <p>{m.text}</p>}
        {m.filePath &&
          (/\.(png|jpe?g|gif|webp)$/i.test(m.filePath) ? (
            <img src={m.filePath} alt="attachment" className="max-w-xs mt-1 rounded" />
          ) : (
            <a href={m.filePath} target="_blank" rel="noopener noreferrer" className="underline text-xs">
              Attachment
            </a>
          ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <button onClick={() => router.back()} className="mb-2 text-sm underline text-[#ffd15c]">
        ← Back to Dashboard
      </button>

      <div className="mx-auto w-full max-w-xl flex flex-col border-2 border-[#ffd15c] bg-black text-[#ffd15c] rounded h-96 mt-32">
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 flex flex-col">
          {messages.map(renderMsg)}
          <div ref={bottomRef} />
        </div>

        <