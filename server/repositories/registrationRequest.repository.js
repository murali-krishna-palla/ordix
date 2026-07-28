const { RestaurantRegistrationRequest, User } = require("../models");

const createRequest = async (data, transaction) => {
  return await RestaurantRegistrationRequest.create(data, { transaction });
};

const findByEmail = async (email) => {
  return await RestaurantRegistrationRequest.findOne({
    where: { email },
  });
};

const findPendingByEmail = async (email) => {
  return await RestaurantRegistrationRequest.findOne({
    where: { email, status: "PENDING" },
  });
};

const findById = async (id) => {
  return await RestaurantRegistrationRequest.findByPk(id, {
    include: [
      {
        model: User,
        as: "approver",
        attributes: ["id", "firstName", "lastName", "email"],
      },
    ],
  });
};

const findAll = async (where = {}) => {
  return await RestaurantRegistrationRequest.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });
};

const findAllPending = async () => {
  return await findAll({ status: "PENDING" });
};

const updateStatus = async (id, updateData, transaction) => {
  const request = await RestaurantRegistrationRequest.findByPk(id, {
    transaction,
  });

  if (!request) return null;

  await request.update(updateData, { transaction });

  return request;
};

const deleteRequest = async (id) => {
  const request = await RestaurantRegistrationRequest.findByPk(id);

  if (!request) return null;

  await request.destroy();

  return request;
};

module.exports = {
  createRequest,
  findByEmail,
  findPendingByEmail,
  findById,
  findAll,
  findAllPending,
  updateStatus,
  deleteRequest,
};
