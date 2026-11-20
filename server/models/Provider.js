import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    durationDays: { type: Number, required: true },
    meals: { type: String, enum: ['lunch', 'dinner', 'both'], required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    area: { type: String, required: true, trim: true, maxlength: 80 },
    address: { type: String, trim: true, maxlength: 200 },
    distanceKm: { type: Number, default: 1, min: 0 },
    type: { type: String, enum: ['veg', 'nonveg', 'both'], required: true },
    meals: { type: String, enum: ['lunch', 'dinner', 'both'], required: true },
    monthlyPrice: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    verified: { type: Boolean, default: false },
    openHours: { type: String, default: '' },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    menu: {
      lunch: { type: [String], default: [] },
      dinner: { type: [String], default: [] },
    },
    plans: { type: [planSchema], default: [] },
    reviews: {
      type: [{ author: String, rating: Number, text: String }],
      default: [],
    },
    // Private contact number: never sent to the public API
    phone: { type: String, select: false },
    // Providers added through the "List your mess" form wait for approval
    approved: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Provider', providerSchema);
