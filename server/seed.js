// Fills the database with SAMPLE providers so the app has something to show.
// These are made-up demo entries, not real businesses. Run: npm run seed
import 'dotenv/config';
import mongoose from 'mongoose';
import Provider from './models/Provider.js';

const plans = (price, meals) => [
  { name: 'Weekly', durationDays: 7, meals, price: Math.round((price / 4) * 1.1 / 10) * 10 },
  { name: 'Monthly', durationDays: 30, meals, price },
];

const sample = [
  { name: 'Annapurna Mess', area: 'Hostel Road', distanceKm: 0.4, type: 'veg', meals: 'both', monthlyPrice: 2400, rating: 4.6, reviewCount: 128, verified: true, openHours: '7am - 10pm',
    menu: { lunch: ['Dal Tadka', '4 Roti', 'Aloo Gobi', 'Jeera Rice', 'Salad'], dinner: ['Paneer Masala', '4 Roti', 'Dal', 'Rice', 'Sweet'] },
    reviews: [{ author: 'Riya, Hostel B', rating: 5, text: 'Tastes like home and fits my budget.' }] },
  { name: 'Maa Ka Dabba', area: 'Campus Gate', distanceKm: 0.7, type: 'veg', meals: 'dinner', monthlyPrice: 1400, rating: 4.4, reviewCount: 86, verified: true, openHours: '6pm - 10pm',
    menu: { lunch: [], dinner: ['Seasonal Sabzi', '4 Roti', 'Dal Fry', 'Rice'] }, reviews: [] },
  { name: 'Sharma Tiffin Service', area: 'Sector 5', distanceKm: 1.1, type: 'both', meals: 'lunch', monthlyPrice: 2100, rating: 4.3, reviewCount: 54, verified: false, openHours: '11am - 2pm',
    menu: { lunch: ['Rajma', '4 Roti', 'Rice', 'Chicken curry (Wed, Sun)'], dinner: [] }, reviews: [] },
  { name: 'Home Taste Mess', area: 'Green Park', distanceKm: 1.4, type: 'veg', meals: 'both', monthlyPrice: 3000, rating: 4.5, reviewCount: 97, verified: true, openHours: '7am - 10pm',
    menu: { lunch: ['Chole', '4 Roti', 'Pulao', 'Raita'], dinner: ['Kadhai Paneer', '4 Roti', 'Dal', 'Rice'] }, reviews: [] },
  { name: 'Student Thali Point', area: 'Library Road', distanceKm: 1.6, type: 'both', meals: 'both', monthlyPrice: 2200, rating: 4.1, reviewCount: 41, verified: false, openHours: '8am - 9pm',
    menu: { lunch: ['Dal', '4 Roti', 'Sabzi', 'Rice'], dinner: ['Dal', '4 Roti', 'Sabzi', 'Rice'] }, reviews: [] },
].map((p) => ({ ...p, plans: plans(p.monthlyPrice, p.meals), approved: true, description: `Homestyle meals near ${p.area}.` }));

await mongoose.connect(process.env.MONGO_URI);
await Provider.deleteMany({ approved: true });
await Provider.insertMany(sample);
console.log(`Seeded ${sample.length} sample providers.`);
await mongoose.disconnect();
