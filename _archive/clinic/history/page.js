"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pb } from "../../../../lib/pocketbase";

import { useAuth } from "../../../../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function HistoryPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace(`/${i18n.language}/clinic/login`);
      return;
    }
    const fetchVisits = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
      const records = await pb.collection('appointments').getFullList({
        filter: `uid="${user.id}"`,
        sort: '-start',
        $autoCancel: false,
      });
      setVisits(records);
            } catch (err) {
        console.error('PocketBase error', err.status, err.message, err.data);
      }
      setLoading(false);
    };
    fetchVisits();
  }, [user, router, i18n.language]);

  if (loading) return <p className="text-center mt-10">{t("loading", "Loading...")}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">{t("your_visits", "Your Previous Visits")}</h1>
      {visits.length === 0 ? (
        <p className="italic opacity-70">{t("no_visits", "No previous visits found.")}</p>
      ) : (
        <div className="card bg-base-100 shadow-xl">
          <div className="overflow-x-auto rounded-b-box">
          <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>{t("date", "Date")}</th>
              <th>{t("time", "Time")}</th>
              <th>{t("status", "Status")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v) => {
              const s = new Date(v.start.seconds ? v.start.seconds * 1000 : v.start);
              const e = new Date(v.end.seconds ? v.end.seconds * 1000 : v.end);
              return (
                <tr key={v.id}>
                  <td>{s.toLocaleDateString()}</td>
                  <td>
                    {s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td><span className="badge badge-warning badge-outline">{t("under_review", "Under review")}</span></td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => router.push(`/${i18n.language}/clinic/booking/${v.id}`)}
                    >
                      {t("view", "View")}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
          </div>
        </div>
      )}
      <div className="text-right">
        <button className="btn btn-primary mt-4" onClick={() => router.push(`/${i18n.language}/clinic/booking`)}>
          {t("book_new", "Book New Appointment")}
        </button>
      </div>
    </div>
  );
}
