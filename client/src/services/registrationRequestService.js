import api from "./api";
import superAdminApi from "./superAdminApi";

// Owns the "registration request" resource created when a restaurant owner
// signs up. A request starts as PENDING and is later moved to APPROVED or
// REJECTED by a Super Admin — see superAdminService.js for the admin session.
const registrationRequestService = {
  // Called from the public Register page. Does NOT return a token — the
  // owner cannot log in until a Super Admin approves the request.
  submitRegistration: async ({ restaurant, owner }) => {
    const { data } = await api.post("/registration-requests", {
      restaurantName: restaurant.name,
      ownerName: `${owner.firstName} ${owner.lastName}`,
      email: owner.email,
      phone: owner.phone,
      password: owner.password,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      country: restaurant.country,
      postalCode: restaurant.postalCode,
    });
    return data.data; // { requestId, status }
  },

  // Lists registration requests for the Super Admin dashboard/table.
  // Pass { status: "pending" | "approved" | "rejected" } to filter;
  // omit it to fetch every request (used for the dashboard's counts).
  getPendingRequests: async (params = {}) => {
    const { data } = await superAdminApi.get("/registration-requests", { params });
    return data.data; // requests[]
  },

  getRequestById: async (id) => {
    const { data } = await superAdminApi.get(`/registration-requests/${id}`);
    return data.data; // request
  },

  approveRequest: async (id) => {
    const { data } = await superAdminApi.patch(`/registration-requests/${id}/approve`);
    return data.data; // updated request
  },

  rejectRequest: async (id, { reason }) => {
    const { data } = await superAdminApi.patch(`/registration-requests/${id}/reject`, {
      rejectionReason: reason,
    });
    return data.data; // updated request
  },
};

export default registrationRequestService;
