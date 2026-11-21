import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema(
  {
    model: { type: String, enum: ['free', 'freemium', 'paid', 'open-source'], required: true },
    startingPriceUSD: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const scoresSchema = new mongoose.Schema(
  {
    reasoning:    { type: Number, min: 0, max: 10, default: 5 },
    speed:        { type: Number, min: 0, max: 10, default: 5 },
    uiDesignSense:{ type: Number, min: 0, max: 10, default: 5 },
    coding:       { type: Number, min: 0, max: 10, default: 5 },
    ml:           { type: Number, min: 0, max: 10, default: 5 },
    context:      { type: Number, min: 0, max: 10, default: 5 },
    agentic:      { type: Number, min: 0, max: 10, default: 5 },
    easeOfUse:    { type: Number, min: 0, max: 10, default: 5 },
  },
  { _id: false }
);

const capabilitiesSchema = new mongoose.Schema(
  {
    hasApi:          { type: Boolean, default: false },
    hasIdeIntegration: { type: Boolean, default: false },
    multimodal:      { type: Boolean, default: false },
    openSource:      { type: Boolean, default: false },
    selfHostable:    { type: Boolean, default: false },
    runsLocally:     { type: Boolean, default: false },
    agentic:         { type: Boolean, default: false },
  },
  { _id: false }
);

const localReqSchema = new mongoose.Schema(
  {
    minRamGB:  { type: Number, default: 0 },
    minVramGB: { type: Number, default: 0 },
    ollamaTag: { type: String, default: '' },
  },
  { _id: false }
);

const toolSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    vendor:      { type: String, default: '' },
    type:        { type: String, enum: ['model', 'assistant', 'IDE', 'platform', 'library'], required: true },
    description: { type: String, default: '' },
    website:     { type: String, default: '' },
    pricing:     { type: pricingSchema, required: true },
    scores:      { type: scoresSchema, default: () => ({}) },
    categoryFit: { type: Map, of: Number, default: {} },
    capabilities:     { type: capabilitiesSchema, default: () => ({}) },
    localRequirements: { type: localReqSchema, default: () => ({}) },
    contextWindowTokens: { type: Number, default: 0 },
    strengths:    [String],
    weaknesses:   [String],
    bestFor:      [String],
    promptTips:   [String],
    tags:         [String],
    openAlternatives:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tool' }],
    commercialEquivalents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tool' }],
    avgRating:   { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    lastVerifiedAt: { type: Date, default: Date.now },
    isFeatured:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Full-text search index
toolSchema.index({ name: 'text', description: 'text', tags: 'text' });
// Compound index for filtered queries
toolSchema.index({ 'pricing.model': 1, isFeatured: -1 });
toolSchema.index({ tags: 1, 'capabilities.openSource': 1 });

export default mongoose.model('Tool', toolSchema);
