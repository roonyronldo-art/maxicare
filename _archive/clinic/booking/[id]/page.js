"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { pb } from "../../../../../lib/pocketbase";
import { useAuth } from "../../../../../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function BookingDetailsPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("../login");
      return;
    }
    const fetchData = async () => {
      try {
        // get appointment by id
        const record = await pb.collection('appointments').getOne(params.id);
        setAppointment(record);
        // fetch previous visits for this user
        const visitsList = await pb.collection('appointments').getFullList({
          filter: `uid ~ "${user.id}"`,
          sort: '-start',
        });
        setVisits(visitsList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, user, router]);

  if (loading) return <p className="text-center mt-10">{t("loading", "Loading...")}</p>;

  if (!appointment) return <p className="text-center mt-10">{t("not_found", "Appointment not found")}</p>;

  const start = new Date(appointment.start.seconds ? appointment.start.seconds * 1000 : appointment.start);
  const end = new Date(appointment.end.seconds ? appointment.end.seconds * 1000 : appointment.end);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow space-y-6">
      <h1 className="text-2xl font-bold mb-4">{t("booking_details", "Booking Details")}</h1>
      <p>
        {t("status", "Status")}: {t("under_review", "Under review")}
      </p>
      <p>
        {t("date", "Date")}: {start.toLocaleDateString()}
      </p>
      <p>
        {t("time", "Time")}: {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
      <p className="mt-6 text-lg font-semibold">{t("patient_info", "Patient Information")}</p>
      <ul className="list-disc list-inside">
        <li>{t("name", "Name")}: {user?.displayName || t("not_provided", "Not provided")}</li>
        <li>{t("email", "Email")}: {user?.email}</li>
      </ul>

      {visits.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mt-8 mb-2">{t("previous_visits", "Previous Visits")}</h2>
          <table className="table w-full">
            <thead>
              <tr>
                <th>{t("date", "Date")}</th>
                <th>{t("time", "Time")}</th>
                <th>{t("status", "Status")}</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => {
                const s = new Date(v.start.seconds ? v.start.seconds * 1000 : v.start);
                const e = new Date(v.end.seconds ? v.end.seconds * 1000 : v.end);
                return (
                  <tr key={v.id} className={v.id === appointment.id ? "font-semibold" : ""}>
                    <td>{s.toLocaleDateString()}</td>
                    <td>
                      {s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td>{t("under_review", "Under review")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
