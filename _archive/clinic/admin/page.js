'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPageRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/clinic/admin/dashboard');
  }, [router]);
  return null;
}
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import pb from '../../../../lib/pbClient.js'; // PocketBase client (assumed existing helper)

export default function ClinicAdminPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // helpers
  const updateStatus = async (id, status) => {
    try {
      await pb.collection('appointments').update(id, { status });
      setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
    } catch (e) {
      console.error('Status update failed', e);
    }
  };

  const handleApprove = (id) => updateStatus(id, 'approved');
  const handleReject = (id) => updateStatus(id, 'rejected');

  // Auth readiness and route protection
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = pb.authStore.onChange(() => setAuthReady(true));
    setAuthReady(true); // initial run
    const model = pb.authStore.model;
    if (pb.authStore.isValid && model && model.role !== 'admin') {
      router.replace(`/${i18n.language}/clinic`);
    }
    return () => unsub();
  }, [router, i18n.language]);

  // Load appointments
  useEffect(() => {
    async function fetchData() {
      try {
        const list = await pb.collection('appointments').getFullList({ expand: 'patient' });
        setAppointments(list);
      } catch (err) {
        console.error('Failed to load appointments', err);
      } finally {
        setLoading(false);
      }
    }
    if ((pb.authStore.model?.role ?? pb.authStore.model?.rule) === 'admin') {
      fetchData();
    }
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        {t('admin_panel_title', 'Clinic Admin Dashboard')}
      </h1>

      {/* Tabs placeholder */}
      <div className="tabs tabs-boxed flex justify-center">
        <a className="tab tab-active">{t('appointments', 'Appointments')}</a>
        <a className="tab">{t('patients', 'Patients')}</a>
        <a className="tab">{t('settings', 'Settings')}</a>
      </div>

      {/* Table placeholder */}
      <section className="overflow-x-auto shadow rounded-lg bg-base-100">
        <table className="table w-full">
          <thead>
            <tr>
              <th>{t('patient', 'Patient')}</th>
              <th>{t('date', 'Date')}</th>
              <th>{t('status', 'Status')}</th>
              <th>{t('actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-10 opacity-70">
                  {t('loading', 'Loading appointments...')}
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 opacity-70">
                  {t('no_appointments', 'No appointments')}
                </td>
              </tr>
            ) : (
              appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.expand?.patient?.name || appt.patient}</td>
                  <td>{new Date(appt.date).toLocaleString()}</td>
                  <td>{appt.status}</td>
                  <td className="space-x-2">
                    <button className="btn btn-sm btn-primary" onClick={() => handleApprove(appt.id)}>
                      {t('approve', 'Approve')}
                    </button>
                    <button className="btn btn-sm btn-error" onClick={() => handleReject(appt.id)}>
                      {t('reject', 'Reject')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
