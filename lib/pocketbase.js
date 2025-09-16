// lib/pocketbase.js
// Central PocketBase client instance
// Reads base URL from env NEXT_PUBLIC_PB_URL (default http://127.0.0.1:8090)

import PocketBase from 'pocketbase';

const pbUrl = process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(pbUrl);

// Keep auth token in localStorage (browser) so user stays logged in across reloads
if (typeof window !== 'undefined') {
  pb.authStore.loadFromCookie(document.cookie);
  pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false, sameSite: 'Lax' });
  });
}
