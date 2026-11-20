import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    planName: { type: String, required: true },
    customerName: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true },
    startDate: { type: Date, required: true },
    status: { type: String, enum: ['requested', 'confirmed', 'cancelled'], default: 'requested' },
  },
  { timestamps: true }
);

export default mongoose.model('Subscription', subscriptionSchema);
