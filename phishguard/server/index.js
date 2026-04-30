import express from 'express';
import cors from 'cors';
import { apiLimiter } from './middleware/rateLimiter.js';
import { sanitizeInput } from './middleware/sanitizer.js';
import analyzeRouter from './routes/analyze.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(sanitizeInput);

app.use(['/api/analyze', '/analyze'], apiLimiter, analyzeRouter);

// Health check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  console.error(`[Error ${status}]`, err);
  res.status(status).json({
    error: err.name || 'Internal Server Error',
    message: err.message,
    status
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`PhishGuard API running on port ${PORT}`);
  });
}

export default app;
