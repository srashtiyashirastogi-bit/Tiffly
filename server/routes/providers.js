import { Router } from 'express';
import mongoose from 'mongoose';
import Provider from '../models/Provider.js';

const router = Router();
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const SORTS = {
  distance: { distanceKm: 1 },
  rating: { rating: -1, reviewCount: -1 },
  price: { monthlyPrice: 1 },
};

// GET /api/providers?q=&minPrice=&maxPrice=&type=&meal=&sort=
router.get('/', async (req, res, next) => {
  try {
    const { q, minPrice, maxPrice, type, meal, sort } = req.query;
    const filter = { approved: true };

    if (q) {
      const rx = new RegExp(escapeRegex(String(q).slice(0, 60)), 'i');
      filter.$or = [{ name: rx }, { area: rx }, { address: rx }];
    }
    if (minPrice || maxPrice) {
      filter.monthlyPrice = {};
      if (minPrice && !Number.isNaN(Number(minPrice))) filter.monthlyPrice.$gte = Number(minPrice);
      if (maxPrice && !Number.isNaN(Number(maxPrice))) filter.monthlyPrice.$lte = Number(maxPrice);
    }
    if (type === 'veg') filter.type = 'veg';
    if (type === 'nonveg') filter.type = { $in: ['nonveg', 'both'] };
    if (meal === 'lunch') filter.meals = { $in: ['lunch', 'both'] };
    if (meal === 'dinner') filter.meals = { $in: ['dinner', 'both'] };
    if (meal === 'both') filter.meals = 'both';

    const providers = await Provider.find(filter)
      .sort(SORTS[sort] || SORTS.distance)
      .limit(50)
      .lean();
    res.json(providers);
  } catch (err) {
    next(err);
  }
});

// GET /api/providers/:id
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid provider id' });
    }
    const provider = await Provider.findOne({ _id: req.params.id, approved: true }).lean();
    if (!provider) return res.status(404).json({ error: 'Provider not found' });
    res.json(provider);
  } catch (err) {
    next(err);
  }
});

// POST /api/providers  ("List your mess": saved as pending until approved)
router.post('/', async (req, res, next) => {
  try {
    const { name, area, address, phone, type, meals, monthlyPrice, description } = req.body || {};
    if (!name || !area || !phone || !type || !meals || monthlyPrice === undefined) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }
    if (!/^[6-9]\d{9}$/.test(String(phone))) {
      return res.status(400).json({ error: 'Enter a valid 10-digit mobile number.' });
    }
    const price = Number(monthlyPrice);
    if (!Number.isFinite(price) || price < 0 || price > 50000) {
      return res.status(400).json({ error: 'Enter a valid monthly price.' });
    }
    await Provider.create({
      name, area, address, phone, type, meals, description,
      monthlyPrice: price,
      plans: [{ name: 'Monthly', durationDays: 30, meals, price }],
      approved: false,
    });
    res.status(201).json({ message: 'Thanks! We will review your mess and get back to you.' });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: 'Some details are invalid.' });
    next(err);
  }
});

export default router;
