const registrationRequestService = require("../services/registrationRequest.service");

// ==============================
// Submit Registration Request
// ==============================
const registerRequest = async (req, res, next) => {
  try {
    const result = await registrationRequestService.registerRequest(
      req.body
    );

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.request,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Get Registration Requests (Super Admin)
// Supports optional ?status=PENDING|APPROVED|REJECTED filter
// ==============================
const getRequests = async (req, res, next) => {
  try {
    const { status } = req.query;

    const requests = await registrationRequestService.getAllRequests(status);

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Get Registration Request By Id (Super Admin)
// ==============================
const getRequestById = async (req, res, next) => {
  try {
    const request = await registrationRequestService.getRequestById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Approve Registration Request (Super Admin)
// ==============================
const approveRequest = async (req, res, next) => {
  try {
    const result = await registrationRequestService.approveRequest(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        restaurant: result.restaurant,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Reject Registration Request (Super Admin)
// ==============================
const rejectRequest = async (req, res, next) => {
  try {
    const rejectionReason = req.body.rejectionReason || req.body.reason;

    const result = await registrationRequestService.rejectRequest(
      req.params.id,
      rejectionReason
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerRequest,
  getRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
};
