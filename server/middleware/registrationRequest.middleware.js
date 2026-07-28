const normalizeRegistrationRequest = (req, res, next) => {
  const { restaurant, owner } = req.body;

  if (restaurant && owner) {
    req.body.restaurantName = req.body.restaurantName || restaurant.name;
    req.body.ownerName =
      req.body.ownerName ||
      [owner.firstName, owner.lastName].filter(Boolean).join(" ").trim();
    req.body.email = req.body.email || owner.email;
    req.body.phone = req.body.phone || owner.phone;
    req.body.password = req.body.password || owner.password;
    req.body.address = req.body.address || restaurant.address;
    req.body.city = req.body.city || restaurant.city;
    req.body.state = req.body.state || restaurant.state;
    req.body.country = req.body.country || restaurant.country;
    req.body.postalCode = req.body.postalCode || restaurant.postalCode;
  }

  next();
};

module.exports = normalizeRegistrationRequest;
