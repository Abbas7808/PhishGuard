import { Router } from 'express';
import { computeRiskScore } from '../engine/riskScorer.js';

const router = Router();

router.post('/', (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }

  const result = computeRiskScore(url);

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  res.json(result);
});

export default router;
