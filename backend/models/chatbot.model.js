const mongoose = require('mongoose');

const chatbotFAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  keywords: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    enum: ['general', 'account', 'services', 'payment', 'other'],
    default: 'general'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
chatbotFAQSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create a text index for searching
chatbotFAQSchema.index({ 
  question: 'text', 
  answer: 'text', 
  keywords: 'text' 
});

const ChatbotFAQ = mongoose.model('ChatbotFAQ', chatbotFAQSchema);

module.exports = ChatbotFAQ; 