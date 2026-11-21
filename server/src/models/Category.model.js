import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, unique: true },
    slug:  { type: String, required: true, unique: true, lowercase: true },
    label: { type: String, required: true }, // display label
    icon:  { type: String, default: '' },     // Lucide icon name
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
