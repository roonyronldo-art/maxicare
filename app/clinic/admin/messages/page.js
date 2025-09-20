// Minimal server wrapper – لا هوكس
import dynamic from 'next/dynamic';

const MessagesClient = dynamic(() => import('./Client'), {
  ssr: false,
  loading: () => <p className="text-center mt-10 text-[#ffd15c]">Loading…</p>,
});

export default function AdminMessagesPage() {
  return <MessagesClient />;
}