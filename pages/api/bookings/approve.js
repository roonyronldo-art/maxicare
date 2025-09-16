import prisma from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/adminAuth';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }
  const { bookingId, status } = req.body;
  if (!bookingId || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  const updated = await prisma.booking.update({
    where: { id: Number(bookingId) },
    data: { status },
  });
  return res.status(200).json(updated);
}
