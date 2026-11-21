import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    tool:    { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating:  { type: Number, min: 1, max: 5, required: true },
    body:    { type: String, default: '' },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ tool: 1, approved: 1 });
reviewSchema.index({ user: 1 });

export default mongoose.model('Review', reviewSchema);
