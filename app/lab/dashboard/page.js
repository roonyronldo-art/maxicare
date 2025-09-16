'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090');

export default function LabDashboard() {
  const { locale } = useParams() || {};
  const lang = locale === 'en' ? 'en' : 'ar';

  const labels =
    lang === 'en'
      ? {
          title: 'Lab User Dashboard',
          placeholder: 'Request description',
          send: 'Send Request',
          sending: 'Sending...',
          myRequests: 'My Requests',
          status: 'Status',
          file: 'File',
          replyFiles: 'Reply files:',
          adminReply: 'Admin reply:',
          createFail: 'Failed to create request',
        }
      : {
          title: 'لوحة المستخدم - المعمل',
          placeholder: 'وصف الطلب',
          send: 'إرسال الطلب',
          sending: 'جاري الإرسال...',
          myRequests: 'طلباتي السابقة',
          status: 'الحالة',
          file: 'ملف',
          replyFiles: 'ملفات الرد:',
          adminReply: 'رد الإدمن:',
          createFail: 'فشل إنشاء الطلب',
        };

  const router = useRouter();
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('labUser');
    const token = localStorage.getItem('labToken');
    if (!stored || !token) {
      router.push('/lab/auth/login');
      return;
    }
    const user = JSON.parse(stored);
    setUserId(user.id);
    fetchRequests(user.id);
  }, []);

  const fetchRequests = async (uid) => {
    try {
      const res = await fetch(`/api/lab/requests?user=${uid}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error('fetchRequests error', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('description', description);
      Array.from(files).forEach((f) => formData.append('files', f));
      formData.append('user', userId);
      const res = await fetch('/api/lab/requests', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      setDescription('');
      setFiles([]);
      await fetchRequests(userId);
    } catch (err) {
      console.error(err);
      setError(err.message || labels.createFail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 text-[#ffd15c]">
      <h1 className="text-2xl font-bold">{labels.title}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md">
        <textarea
          required
          className="w-full border rounded p-2"
          placeholder={labels.placeholder}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*,application/pdf"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? labels.sending : labels.send}
        </button>
      </form>

      <h2 className="text-xl font-semibold">{labels.myRequests}</h2>
      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="border p-4 rounded-md">
            <p className="font-medium">{req.description}</p>
            <p className="text-sm text-gray-500">
              {labels.status}: {req.status}
            </p>

            {req.files?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {req.files.map((f) => (
                  <a
                    key={f}
                    href={f}
                    target="_blank"
                    className="text-blue-400 underline text-sm" download
                  >
                    {labels.file}
                  </a>
                ))}
              </div>
            )}

            {req.replyFiles?.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-semibold">{labels.replyFiles}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {req.replyFiles.map((f) => (
                    <a
                      key={f}
                      href={f}
                      target="_blank"
                      className="text-green-400 underline text-sm" download
                    >
                      {labels.file}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {req.adminReply && (
              <p className="mt-2 text-sm">
                {labels.adminReply} {req.adminReply}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}