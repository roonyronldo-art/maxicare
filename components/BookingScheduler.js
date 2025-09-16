'use client';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export default function BookingScheduler() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');

  // generate next 5 days with 4 fixed slots (10:00, 12:00, 14:00, 16:00)
  const slotsByDate = useMemo(() => {
    const result = [];
    const times = ['10:00', '12:00', '14:00', '16:00'];
    const today = new Date();
    for (let d = 0; d < 5; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const dateStr = date.toLocaleDateString();
      times.forEach((time) => {
        result.push({ id: `${dateStr}-${time}`, date: dateStr, time });
      });
    }
    return result.reduce((acc, s) => {
      acc[s.date] = acc[s.date] ? [...acc[s.date], s] : [s];
      return acc;
    }, {});
  }, []);

  const handleBook = async () => {
    if (!user) {
      setStatus(t('login_first', 'Please log in first'));
    }
    if (!selected) {
      setStatus(t('select_slot', 'Please select a slot'));
      return;
    }
    try {
      await addDoc(collection(db, 'appointments'), {
        uid: user.uid,
        slotId: selected.id,
        date: selected.date,
        time: selected.time,
        createdAt: serverTimestamp(),
      });
      setStatus(t('booking_success', 'Appointment booked successfully'));
    } catch (err) {
      console.error(err);
      setStatus(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.entries(slotsByDate).map(([date, list]) => (
          <div key={date} className="space-y-2">
            <h3 className="font-semibold text-primary">{date}</h3>
            <div className="grid grid-cols-2 gap-2">
              {list.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s)}
            className={`btn btn-sm ${
              selected && selected.id === s.id ? 'btn-primary' : 'btn-outline'
            }`}
          >
            {s.date} {s.time}
          </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleBook} className="btn btn-success">
        {t('confirm', 'Confirm')}
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
