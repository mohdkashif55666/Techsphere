import mongoose from 'mongoose';

const codeSnippetSchema = new mongoose.Schema(
  {
    label:    { type: String, default: '' },
    language: { type: String, default: 'javascript' },
    code:     { type: String, required: true },
  },
  { _id: false }
);

const blueprintSchema = new mongoose.Schema(
  {
    slug:         { type: String, required: true, unique: true, lowercase: true },
    pillar:       { type: String, enum: ['database', 'backend', 'frontend'], required: true },
    title:        { type: String, required: true },
    summary:      { type: String, default: '' },
    bodyMarkdown: { type: String, default: '' },
    codeSnippets: [codeSnippetSchema],
    tags:         [String],
    sortOrder:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

blueprintSchema.index({ pillar: 1, sortOrder: 1 });

export default mongoose.model('Blueprint', blueprintSchema);
