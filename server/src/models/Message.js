const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  taggedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for faster queries
messageSchema.index({ candidateId: 1, createdAt: -1 });
messageSchema.index({ taggedUsers: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);