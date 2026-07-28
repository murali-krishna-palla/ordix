import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { FiArrowLeft, FiCheck, FiX, FiLoader } from "react-icons/fi";

import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";
import RejectRequestModal from "../../components/common/RejectRequestModal";
import registrationRequestService from "../../services/registrationRequestService";
import { REGISTRATION_STATUS } from "../../constants";

const getRestaurantName = (r) => r?.restaurantName || r?.restaurant?.name || "—";
const getOwnerName = (r) =>
  r?.ownerName ||
  [r?.ownerFirstName, r?.ownerLastName].filter(Boolean).join(" ") ||
  r?.owner?.name ||
  "—";

const FIELD_ROWS = [
  { label: "Restaurant Name", get: (r) => getRestaurantName(r) },
  { label: "Owner Name", get: (r) => getOwnerName(r) },
  { label: "Email", get: (r) => r.email || r.ownerEmail || r.owner?.email || "—" },
  { label: "Phone", get: (r) => r.phone || r.ownerPhone || r.owner?.phone || "—" },
  { label: "Address", get: (r) => r.address || r.restaurant?.address || "—" },
  { label: "City", get: (r) => r.city || r.restaurant?.city || "—" },
  { label: "State", get: (r) => r.state || r.restaurant?.state || "—" },
  { label: "Country", get: (r) => r.country || r.restaurant?.country || "—" },
  {
    label: "Registration Date",
    get: (r) =>
      r.createdAt ? dayjs(r.createdAt).format("D MMM YYYY, h:mm A") : "—",
  },
];

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const fetchRequest = async () => {
    setLoading(true);
    try {
      const data = await registrationRequestService.getRequestById(id);
      setRequest(data);
    } catch (error) {
      toast.error(error.message || "Unable to load this request.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleApprove = async () => {
    setApproving(true);
    try {
      await registrationRequestService.approveRequest(id);
      toast.success("Restaurant approved. The owner can now log in.");
      fetchRequest();
    } catch (error) {
      toast.error(error.message || "Unable to approve this request.");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (reason) => {
    try {
      await registrationRequestService.rejectRequest(id, { reason });
      toast.success("Registration request rejected.");
      setRejectOpen(false);
      fetchRequest();
    } catch (error) {
      toast.error(error.message || "Unable to reject this request.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <FiLoader className="animate-spin text-muted" size={22} />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center text-muted">
        <p>Couldn't find this registration request.</p>
        <Link
          to="/super-admin/registration-requests"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
        >
          <FiArrowLeft size={15} />
          Back to requests
        </Link>
      </div>
    );
  }

  const status = String(request.status || "").toLowerCase();
  const isPending = status === REGISTRATION_STATUS.PENDING;

  return (
    <div>
      <button
        onClick={() => navigate("/super-admin/registration-requests")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <FiArrowLeft size={15} />
        Back to requests
      </button>

      <div className="mt-4 rounded-xl border border-line bg-surface p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-bold text-ink">{getRestaurantName(request)}</h1>
            <p className="mt-1 text-sm text-muted">Registration request details</p>
          </div>
          <StatusBadge status={status} />
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          {FIELD_ROWS.map(({ label, get }) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                {label}
              </dt>
              <dd className="mt-1 text-[15px] text-ink">{get(request)}</dd>
            </div>
          ))}
        </dl>

        {status === REGISTRATION_STATUS.REJECTED && request.rejectionReason && (
          <div className="mt-6 rounded-lg border border-danger/30 bg-danger/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-danger">
              Rejection reason
            </p>
            <p className="mt-1 text-sm text-ink-soft">{request.rejectionReason}</p>
          </div>
        )}

        {isPending && (
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleApprove} loading={approving} className="sm:w-auto sm:px-6">
              <FiCheck size={16} />
              Approve
            </Button>
            <Button
              variant="danger"
              onClick={() => setRejectOpen(true)}
              className="sm:w-auto sm:px-6"
            >
              <FiX size={16} />
              Reject
            </Button>
          </div>
        )}
      </div>

      <RejectRequestModal
        open={rejectOpen}
        restaurantName={getRestaurantName(request)}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
      />
    </div>
  );
};

export default RequestDetails;
