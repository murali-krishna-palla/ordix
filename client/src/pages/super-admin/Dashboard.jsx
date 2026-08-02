import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiClock, FiCheckCircle, FiXCircle, FiArrowRight } from "react-icons/fi";

import useSuperAdminAuth from "../../hooks/useSuperAdminAuth";
import registrationRequestService from "../../services/registrationRequestService";
import { REGISTRATION_STATUS } from "../../constants";

const SuperAdminDashboard = () => {
  const { admin } = useSuperAdminAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await registrationRequestService.getPendingRequests();
        if (!cancelled) setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(error.message || "Unable to load registration requests.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const countByStatus = (status) =>
    requests.filter((r) => String(r.status).toLowerCase() === status).length;

  const CARDS = [
    {
      label: "Pending Requests",
      value: countByStatus(REGISTRATION_STATUS.PENDING),
      icon: FiClock,
      accent: "bg-ember-400/10 text-ember-500",
    },
    {
      label: "Approved Restaurants",
      value: countByStatus(REGISTRATION_STATUS.APPROVED),
      icon: FiCheckCircle,
      accent: "bg-success/10 text-success",
    },
    {
      label: "Rejected Requests",
      value: countByStatus(REGISTRATION_STATUS.REJECTED),
      icon: FiXCircle,
      accent: "bg-danger/10 text-danger",
    },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-ink">
          Welcome, {admin?.name || "Admin"} 👋
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Here's the current state of restaurant registration requests.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CARDS.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="card card-hover p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted">{label}</span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>
                <Icon size={15} />
              </span>
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-ink">
              {loading ? "—" : value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 card p-8 text-center">
        <p className="font-display text-lg font-semibold text-ink">
          Review pending registrations
        </p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
          Approve a request to grant that owner Restaurant Admin access, or
          reject it with a reason they can act on.
        </p>
        <Link
          to="/super-admin/registration-requests"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
        >
          View registration requests
          <FiArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
