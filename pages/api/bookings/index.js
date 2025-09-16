import prisma from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/adminAuth';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET': {
      if (!requireAdmin(req, res)) return;
      const bookings = await prisma.booking.findMany({
        include: { user: true, messages: true },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(bookings);
    }
    case 'POST': {
      // patient creates booking
      const { name, email, phone, date } = req.body;
      if (!name || !email || !date) {
        return res.status(400).json({ error: 'Missing fields' });
      }
      // find or create user
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({ data: { name, email, phone } });
      }
      const booking = await prisma.booking.create({
        data: { userId: user.id, date: new Date(date) },
      });
      return res.status(201).json(booking);
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end();
  }
}
