import { Router } from 'express';
import mongoose from 'mongoose';
import Provider from '../models/Provider.js';
import Subscription from '../models/Subscription.js';

const router = Router();

// POST /api/subscriptions  (a subscription *request*; payment happens directly with the provider)
router.post('/', async (req, res, next) => {
  try {
    const { providerId, planName, customerName, phone, startDate } = req.body || {};
    if (!mongoose.isValidObjectId(providerId)) return res.status(400).json({ error: 'Invalid provider.' });
    if (!customerName || String(customerName).trim().length < 2) return res.status(400).json({ error: 'Enter your name.' });
    if (!/^[6-9]\d{9}$/.test(String(phone))) return res.status(400).json({ error: 'Enter a valid 10-digit mobile number.' });

    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(start.getTime()) || start < today) return res.status(400).json({ error: 'Choose a start date from today onwards.' });

    const provider = await Provider.findOne({ _id: providerId, approved: true }).lean();
    if (!provider) return res.status(404).json({ error: 'Provider not found.' });
    if (!provider.plans.some((p) => p.name === planName)) return res.status(400).json({ error: 'Choose a valid plan.' });

    await Subscription.create({ provider: providerId, planName, customerName: String(customerName).trim(), phone, startDate: start });
    res.status(201).json({ message: 'Request sent! The provider will contact you to confirm your plan.' });
  } catch (err) {
    next(err);
  }
});

export default router;
