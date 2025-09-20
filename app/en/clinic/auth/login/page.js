// server wrapper (no hooks)
import dynamic from 'next/dynamic';

export default dynamic(() => import('./Client'), {
  ssr: false,
  loading: () => <p className="text-center mt-10 text-[#ffd15c]">Loading…</p>,
});