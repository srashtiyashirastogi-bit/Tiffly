import { Router } from 'express';
import Waitlist from '../models/Waitlist.js';

const router = Router();

// POST /api/waitlist
router.post('/', async (req, res, next) => {
  try {
    const { email, role } = req.body || {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || ''))) {
      return res.status(400).json({ error: 'Enter a valid email address.' });
    }
    const safeRole = role === 'provider' ? 'provider' : 'customer';
    await Waitlist.updateOne({ email: String(email).toLowerCase().trim() }, { $setOnInsert: { role: safeRole } }, { upsert: true });
    res.status(201).json({ message: 'You are on the list! We will email you when Tiffly opens near you.' });
  } catch (err) {
    next(err);
  }
});

export default router;
