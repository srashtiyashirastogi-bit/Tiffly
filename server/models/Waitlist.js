import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ['customer', 'provider'], default: 'customer' },
  },
  { timestamps: true }
);

export default mongoose.model('Waitlist', waitlistSchema);
