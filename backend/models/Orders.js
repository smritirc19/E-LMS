const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // The user who bought it
  courseId: { type: String, required: true }, // The simple ID (3, 6, 8, 10)
  mongoCourseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Link to the full course doc
  courseTitle: { type: String },
  amount: { type: Number },
  status: { type: String, default: 'completed' }, // In dummy mode, it's always completed
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);