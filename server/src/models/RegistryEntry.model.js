import mongoose from 'mongoose';

const registryEntrySchema = new mongoose.Schema(
  {
    taskTitle:     { type: String, required: true },
    commercialTool: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
    openTool:      { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
    tag:           { type: String, default: '' },
    category:      { type: String, default: 'general' },
    sortOrder:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

registryEntrySchema.index({ sortOrder: 1 });
registryEntrySchema.index({ category: 1 });

export default mongoose.model('RegistryEntry', registryEntrySchema);
