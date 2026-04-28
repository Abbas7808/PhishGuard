export function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body.url === 'string') {
    req.body.url = req.body.url
      .replace(/[<>'"]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .trim()
      .slice(0, 2048);
  }
  next();
}
