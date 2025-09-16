import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const filePath = path.join(process.cwd(), 'data', 'content.json');
    const json = await fs.readFile(filePath, 'utf8');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(json);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // file missing => return empty object
      return res.status(200).json({});
    }
    console.error('content api error', err);
    return res.status(500).json({ message: 'Unable to read content' });
  }
}
