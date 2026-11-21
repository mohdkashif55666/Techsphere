import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema(
  {
    label:   { type: String, required: true },
    command: { type: String, required: true },
  },
  { _id: false }
);

const terminalTemplateSchema = new mongoose.Schema(
  {
    os:        { type: String, enum: ['macos', 'linux', 'windows'], required: true },
    stack:     { type: String, required: true },   // e.g. "mern", "next", "python-ml"
    goal:      { type: String, required: true },   // e.g. "scaffold", "local-model"
    minRamGB:  { type: Number, default: 0 },
    minVramGB: { type: Number, default: 0 },
    steps:     { type: [stepSchema], required: true },
    verifiedAt: { type: Date, default: Date.now },
    notes:     { type: String, default: '' },
  },
  { timestamps: true }
);

terminalTemplateSchema.index({ os: 1, stack: 1, goal: 1 });

export default mongoose.model('TerminalTemplate', terminalTemplateSchema);
