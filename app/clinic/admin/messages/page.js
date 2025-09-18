export const dynamic = 'force-dynamic';
import { Suspense } from 'react';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MessagesPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading…</p>}>
      <MessagesClient />
    </Suspense>
  );
}

// ---------- Client Component ----------
'use client';

  const router = useRouter();
  const params = useSearchParams();
  const bookingId = params.get('bookingId');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  const bottomRef = useRef(null);
  const listRef = useRef(null);

  const fetchMessages = async () => {
    if (!bookingId) return;
    const listEl = listRef.current;
    const prevHeight = listEl ? listEl.scrollHeight : 0;
    const prevClientHeight = listEl ? listEl.clientHeight : 0;
    const offsetFromBottom = prevHeight - (listEl ? listEl.scrollTop : 0) - prevClientHeight;

    if (!bookingId) return;
    const res = await fetch(`/api/messages?bookingId=${bookingId}`, {
      credentials: 'include',
    });
    if (res.status === 401) {
      router.replace('/clinic/admin/login');
      return;
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      setMessages(data);
    } else {
      setMessages([]);
    }
    // preserve scroll position
    setTimeout(() => {
      const list = listRef.current;
      if (!list) return;
      if (offsetFromBottom < 5) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else {
        list.scrollTop = list.scrollHeight - list.clientHeight - offsetFromBottom;
      }
    }, 0);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text && !file) return;
    const formData = new FormData();
    formData.append('bookingId', bookingId);
    if (text) formData.append('text', text);
    if (file) formData.append('file', file);
    await fetch('/api/messages', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    setText('');
    setFile(null);
    fetchMessages();
  };

  const renderMessage = (m) => {
    const isSenderAdmin = (m.sender || '').toLowerCase() === 'admin';
    const bubbleClass = isSenderAdmin
      ? 'bg-[#ffd15c] text-black self-end'
      : 'bg-gray-700 text-white self-start';

    return (
      <div
        key={m.id}
        className={`max-w-xs p-2 rounded-lg text-sm mb-2 ${bubbleClass} ${isSenderAdmin ? 'text-right' : 'text-left'}`}
      >
        {m.text && <p className="whitespace-pre-wrap">{m.text}</p>}

        {m.filePath &&
          (/\.(png|jpe?g|gif|webp)$/i.test(m.filePath) ? (
            <img src={m.filePath} alt="attachment" className="max-w-xs mt-1 rounded" />
          ) : (
            <a
              href={m.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-xs"
            >
              Attachment
            </a>
          ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <button
        className="mb-2 text-sm underline text-[#ffd15c]"
        onClick={() => router.back()}
      >
        ← Back to Dashboard
      </button>

      {/* chat frame (same as user) */}
      <div className="mx-auto w-full max-w-xl flex flex-col min-h-0 border-2 border-[#ffd15c] bg-black text-[#ffd15c] rounded h-96 mt-32">
        {/* messages list */}
        <div id="adminChatList" ref={listRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col p-2">
          {messages.map(renderMessage)}
          <div ref={bottomRef} />
        </div>

        {/* input bar */}
        <form
          onSubmit={handleSend}
          className="w-full flex items-center gap-2 p-2 border-t border-[#ffd15c] sticky bottom-0 bg-black"
        >
          {/* hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />

          {/* icons */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1"
            title="Attach file"
          >
            <svg className="w-5 h-5 fill-[#ffd15c]" viewBox="0 0 24 24">
              <path d="M17.657 6.343a4 4 0 00-5.657 0L4.929 13.414a2 2 0 102.828 2.828l6.364-6.364a.999.999 0 111.414 1.414l-6.364 6.364a4 4 0 11-5.657-5.657l7.071-7.071a6 6 0 118.486 8.486l-7.778 7.778a1 1 0 01-1.414-1.414l7.778-7.778a4 4 0 000-5.657z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="p-1"
            title="Attach photo"
          >
            <svg className="w-5 h-5 fill-[#ffd15c]" viewBox="0 0 24 24">
              <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm8 10a4 4 0 100-8 4 4 0 000 8zm6-10h-2l-1-1h-6l-1 1H6v2h12V6z" />
            </svg>
          </button>

          {/* text input */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
            className="flex-1 border border-[#ffd15c] bg-black text-[#ffd15c] rounded px-2 py-1 text-sm"
          />
          <button
            type="submit"
            className="ml-auto bg-black border-2 border-[#ffd15c] text-[#ffd15c] font-extrabold px-3 py-1 rounded text-sm hover:bg-black/80"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
