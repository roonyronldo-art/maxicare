'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminMessagesPage() {
  const router = useRouter();
  const params = useSearchParams();
  const bookingId = params?.get('bookingId');

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const fileInput = useRef(null);
  const photoInput = useRef(null);
  const bottomRef = useRef(null);
  const listRef   = useRef(null);

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

  const render = (m) => {
    const mine = (m.sender || '').toLowerCase() === 'admin';
    const cls  = mine ? 'bg-[#ffd15c] text-black self-end' : 'bg-gray-700 text-white self-start';
    return (
      <div key={m.id} className={`max-w-xs p-2 rounded text-sm mb-2 ${cls}`}>
        {m.text && <p>{m.text}</p>}
        {m.filePath && (/\.(png|jpe?g|gif|webp)$/i.test(m.filePath)
          ? <img src={m.filePath} alt="attachment" className="max-w-xs mt-1 rounded" />
          : <a href={m.filePath} target="_blank" rel="noopener noreferrer" className="underline text-xs">Attachment</a>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <button onClick={() => router.back()} className="mb-2 text-sm underline text-[#ffd15c]">← Back to Dashboard</button>

      <div className="mx-auto w-full max-w-xl flex flex-col border-2 border-[#ffd15c] bg-black text-[#ffd15c] rounded h-96 mt-32">
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 flex flex-col">{messages.map(render)}<div ref={bottomRef} /></div>

        <form onSubmit={handleSend} className="flex items-center gap-2 p-2 border-t border-[#ffd15c] bg-black">
          <input ref={fileInput}  type="file"          onChange={e=>setFile(e.target.files?.[0]||null)} className="hidden" />
          <input ref={photoInput} type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} className="hidden" />

          <button type="button" onClick={()=>fileInput.current?.click()}  className="p-1">📎</button>
          <button type="button" onClick={()=>photoInput.current?.click()} className="p-1">🖼️</button>

          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message"
                 className="flex-1 border border-[#ffd15c] bg-black text-[#ffd15c] rounded px-2 py-1 text-sm" />

          <button type="submit" className="bg-black border-2 border-[#ffd15c] text-[#ffd15c] px-3 py-1 rounded text-sm">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}