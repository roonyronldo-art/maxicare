import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { adminKey, data } = req.body || {};
  console.log('SAVE_CONTENT adminKey received:', adminKey);
  console.log('ENV ADMIN_KEY:', process.env.ADMIN_KEY);
  const validKeys = [process.env.ADMIN_KEY, process.env.NEXT_PUBLIC_ADMIN_KEY].filter(Boolean);
  if (validKeys.length && (!adminKey || !validKeys.includes(adminKey))) {
    return res.status(401).json({ message: 'Invalid key' });
  }
  try {
    const filePath = path.join(process.cwd(), 'data', 'content.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('save-content error', err);
    return res.status(500).json({ message: 'Write failed' });
  }
}
