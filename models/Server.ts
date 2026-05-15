import mongoose from 'mongoose';

const ServerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'Running',
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.models.Server || mongoose.model('Server', ServerSchema);
