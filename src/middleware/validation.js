const validateReservation = (req, res, next) => {
  const { partnerId, seats } = req.body;

  if (!partnerId) {
    return res.status(400).json({ message: 'partnerId is required' });
  }

  if (typeof seats !== 'number' || seats <= 0 || seats > 10) {
    return res.status(400).json({ message: 'seats must be a number greater than 0 and less than or equal to 10' });
  }

  next();
};

module.exports = {
  validateReservation
};
