import PocketBase from 'pocketbase';

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090';

export default function getLabPB() {
  const pb = new PocketBase(PB_URL);
  return pb;
}
