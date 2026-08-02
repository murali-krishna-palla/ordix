import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiCheck, FiX, FiLoader } from "react-icons/fi";

import StatusBadge from "../../components/ui/StatusBadge";
import RejectRequestModal from "../../components/common/RejectRequestModal";
import registrationRequestService from "../../services/registrationRequestService";
import { REGISTRATION_STATUS } from "../../constants";

const FILTERS = [
  { key: "all", label: "All" },
  { key: REGISTRATION_STATUS.PENDING, label: "Pending" },
  { key: REGISTRATION_STATUS.APPROVED, label: "Approved" },
  { key: REGISTRATION_STATUS.REJECTED, label: "Rejected" },
];

// Normalizes a couple of likely field-name shapes from the API so the
// table renders sensibly even if the backend uses ownerName vs.
// ownerFirstName/ownerLastName, restaurant.name vs. restaurantName, etc.
const getRestaurantName = (r) => r.restaurantName || r.restaurant?.name || "—";
const getOwnerName = (r) =>
  r.ownerName ||
  [r.ownerFirstName, r.ownerLastName].filter(Boolean).join(" ") ||
  r.owner?.name ||
  "—";
const getEmail = (r) => r.email || r.ownerEmail || r.owner?.email || "—";
const getPhone = (r) => r.phone || r.ownerPhone || r.owner?.phone || "—";

const RegistrationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await registrationRequestService.getPendingRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Unable to load registration requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return requests;
    return requests.filter((r) => String(r.status).toLowerCase() === filter);
  }, [requests, filter]);

  const handleApprove = async (request) => {
    const id = request._id || request.id;
    setBusyId(id);
    try {
      await registrationRequestService.approveRequest(id);
      toast.success(`${getRestaurantName(request)} has been approved.`);
      fetchRequests();
    } catch (error) {
      toast.error(error.message || "Unable to approve this request.");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (reason) => {
    const request = rejectTarget;
    const id = request._id || request.id;
    setBusyId(id);
    try {
      await registrationRequestService.rejectRequest(id, { reason });
      toast.success(`${getRestaurantName(request)} has been rejected.`);
      setRejectTarget(null);
      fetchRequests();
    } catch (error) {
      toast.error(error.message || "Unable to reject this request.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Registration Requests</h1>
          <p className="mt-1 text-[15px] text-muted">
            Approve or reject restaurants waiting to come onboard.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                filter === key
                  ? "bg-ink text-white"
                  : "border border-line bg-surface text-ink-soft hover:bg-canvas"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Restaurant</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    <FiLoader className="mx-auto animate-spin" size={20} />
                  </td>
                </tr>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    No registration requests here yet.
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((request) => {
                  const id = request._id || request.id;
                  const status = String(request.status || "").toLowerCase();
                  const isPending = status === REGISTRATION_STATUS.PENDING;
                  const isBusy = busyId === id;

                  return (
                    <tr key={id} className="text-ink-soft">
                      <td className="px-5 py-3.5 font-medium text-ink">
                        {getRestaurantName(request)}
                      </td>
                      <td className="px-5 py-3.5">{getOwnerName(request)}</td>
                      <td className="px-5 py-3.5">{getEmail(request)}</td>
                      <td className="px-5 py-3.5">{getPhone(request)}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/super-admin/registration-requests/${id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-soft hover:bg-canvas"
                            aria-label="View request"
                          >
                            <FiEye size={15} />
                          </Link>

                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(request)}
                                disabled={isBusy}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-success hover:bg-success/10 disabled:opacity-50"
                                aria-label="Approve request"
                              >
                                <FiCheck size={15} />
                              </button>
                              <button
                                onClick={() => setRejectTarget(request)}
                                disabled={isBusy}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-danger hover:bg-danger/10 disabled:opacity-50"
                                aria-label="Reject request"
                              >
                                <FiX size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <RejectRequestModal
        open={!!rejectTarget}
        restaurantName={rejectTarget ? getRestaurantName(rejectTarget) : ""}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleReject}
      />
    </div>
  );
};

export default RegistrationRequests;
