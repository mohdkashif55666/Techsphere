import mongoose from 'mongoose';

const searchLogSchema = new mongoose.Schema(
  {
    query:       { type: String, default: '' },
    filters:     { type: mongoose.Schema.Types.Mixed, default: {} },
    resultCount: { type: Number, default: 0 },
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

searchLogSchema.index({ query: 1, createdAt: -1 });

export default mongoose.model('SearchLog', searchLogSchema);
