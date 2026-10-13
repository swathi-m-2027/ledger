// Simple password gate. Active only when APP_PASSWORD is set (it will be, in the cloud).
module.exports = function auth(req, res, next) {
  const pw = process.env.APP_PASSWORD;
  if (!pw) return next();
  if (req.headers['x-app-password'] === pw) return next();
  res.status(401).json({ error: 'Unauthorized' });
};
