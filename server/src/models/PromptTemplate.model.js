import mongoose from 'mongoose';

const promptTemplateSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, default: '' },
    body:        { type: String, required: true },
    tags:        [String],
    copyCount:   { type: Number, default: 0 },
    sortOrder:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

promptTemplateSchema.index({ sortOrder: 1 });

export default mongoose.model('PromptTemplate', promptTemplateSchema);
