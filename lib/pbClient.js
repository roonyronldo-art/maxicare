import PocketBase from 'pocketbase';

// Instantiate a single PocketBase client for the whole app
const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL || 'http://localhost:8090');

// Simple localStorage persistence (browser only)
if (typeof window !== 'undefined') {
  // expose immediately for debugging
  window.pb = pb;
  const stored = window.localStorage.getItem('pb_auth');
  if (stored) {
    try {
      pb.authStore.loadFromCookie(`pb_auth=${stored}`);
    } catch (e) {
      console.warn('Failed to restore PocketBase auth', e);
    }
  }
  pb.authStore.onChange(() => {
    const cookie = pb.authStore.exportToCookie(); // format: pb_auth=<data>; path=/; ...
    const value = cookie.split(';')[0].split('=')[1];
    window.localStorage.setItem('pb_auth', value);
    // expose for debugging
    window.pb = pb;
  });
}

export default pb;
export { pb };
