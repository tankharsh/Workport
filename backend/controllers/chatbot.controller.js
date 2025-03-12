const ChatbotFAQ = require('../models/chatbot.model');
const mongoose = require('mongoose');

// Default FAQs to be added when initializing the chatbot
const defaultFAQs = [
  {
    question: "What is Workport?",
    answer: "Workport is an online platform where users can connect with service providers for various services, and service providers can offer their services.",
    keywords: ["workport", "what is", "platform", "service"],
    category: "general"
  },
  {
    question: "How do I create an account?",
    answer: "You can create an account by clicking the 'Register' button on the homepage. You'll need to provide your name, email, phone number, and password. You'll then receive a verification email or OTP to verify your account.",
    keywords: ["account", "register", "sign up", "create"],
    category: "account"
  },
  {
    question: "How do I become a service provider?",
    answer: "To become a service provider, you need to go to the 'Service Provider Registration' page and fill in your information. You'll need to provide details about your skills, experience, and services. After verification, you can list your services.",
    keywords: ["service provider", "become", "registration"],
    category: "account"
  },
  {
    question: "How do I list my services?",
    answer: "In the Service Provider Dashboard, click on the 'Add Service' button. Then enter your service details, price, and upload photos. You can also select the category for your service.",
    keywords: ["service", "list", "add", "services"],
    category: "services"
  },
  {
    question: "How do I pay for services?",
    answer: "When you book a service, you'll be redirected to the payment page. You can pay using credit/debit cards, net banking, or UPI.",
    keywords: ["payment", "pay", "how to pay"],
    category: "payment"
  },
  {
    question: "Can I cancel my booking?",
    answer: "Yes, you can cancel your booking. Go to the 'My Bookings' section in your user dashboard and click the 'Cancel' button for the booking you want to cancel. Please note that the refund policy depends on the time of booking and the service provider's terms.",
    keywords: ["booking", "cancel", "cancellation"],
    category: "services"
  },
  {
    question: "How do I reset my password?",
    answer: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your registered email or phone number, and you'll receive a link or OTP to reset your password.",
    keywords: ["password", "reset", "forgot"],
    category: "account"
  },
  {
    question: "How do I contact a service provider?",
    answer: "You can go to the service provider's profile page and click the 'Contact' button. You can send them a message or view their contact details.",
    keywords: ["contact", "service provider", "message"],
    category: "services"
  },
  {
    question: "How do I provide feedback?",
    answer: "After the service is completed, you'll have the option to provide feedback. You can go to the 'My Bookings' section in your user dashboard and provide a rating and review for the service.",
    keywords: ["feedback", "review", "rating"],
    category: "services"
  },
  {
    question: "Is Workport available on mobile app?",
    answer: "Currently, Workport is only available as a web platform. We're planning to launch mobile apps for Android and iOS soon.",
    keywords: ["mobile", "app", "android", "ios"],
    category: "general"
  }
];

// Initialize chatbot with default FAQs
const initializeChatbot = async () => {
  try {
    console.log('Initializing chatbot...');
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected yet. Will retry initialization later.');
      // Retry after 5 seconds
      setTimeout(initializeChatbot, 5000);
      return;
    }
    
    const count = await ChatbotFAQ.countDocuments();
    console.log(`Found ${count} existing FAQs in database`);
    
    // Only add default FAQs if the collection is empty
    if (count === 0) {
      console.log('Adding default FAQs to database...');
      try {
        const result = await ChatbotFAQ.insertMany(defaultFAQs);
        console.log(`Successfully added ${result.length} default FAQs`);
      } catch (insertError) {
        console.error('Error inserting default FAQs:', insertError);
        if (insertError.code === 11000) {
          console.log('Duplicate key error. Some FAQs may already exist.');
        }
      }
    } else {
      console.log('Database already has FAQs, skipping initialization');
    }
    
    // Create text index if it doesn't exist
    try {
      await ChatbotFAQ.collection.createIndex({ 
        question: 'text', 
        answer: 'text', 
        keywords: 'text' 
      });
      console.log('Text index created or already exists');
    } catch (indexError) {
      console.error('Error creating text index:', indexError);
    }
    
    console.log('Chatbot initialization complete');
  } catch (error) {
    console.error('Error initializing chatbot:', error);
    // Retry after 10 seconds in case of error
    console.log('Will retry initialization in 10 seconds...');
    setTimeout(initializeChatbot, 10000);
  }
};

// Call initialization function with a slight delay to ensure DB connection is established
setTimeout(initializeChatbot, 3000);

// Get all FAQs
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await ChatbotFAQ.find().sort({ category: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching FAQs', error: error.message });
  }
};

// Add a new FAQ
exports.addFAQ = async (req, res) => {
  try {
    const { question, answer, keywords, category } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required' });
    }
    
    const newFAQ = new ChatbotFAQ({
      question,
      answer,
      keywords: keywords || [],
      category: category || 'general'
    });
    
    await newFAQ.save();
    res.status(201).json({ success: true, data: newFAQ, message: 'FAQ added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding FAQ', error: error.message });
  }
};

// Update an FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, keywords, category } = req.body;
    
    const updatedFAQ = await ChatbotFAQ.findByIdAndUpdate(
      id,
      { question, answer, keywords, category, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedFAQ) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    
    res.status(200).json({ success: true, data: updatedFAQ, message: 'FAQ updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating FAQ', error: error.message });
  }
};

// Delete an FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedFAQ = await ChatbotFAQ.findByIdAndDelete(id);
    
    if (!deletedFAQ) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    
    res.status(200).json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting FAQ', error: error.message });
  }
};

// Process user query and return response
exports.processQuery = async (req, res) => {
  try {
    console.log('Received chatbot query:', req.body);
    
    const { query } = req.body;
    
    if (!query) {
      console.log('No query provided in request');
      return res.status(400).json({ success: false, message: 'Query is required' });
    }
    
    console.log('Processing query:', query);
    
    // First try to find an exact match
    let faq = await ChatbotFAQ.findOne({ 
      $or: [
        { question: { $regex: new RegExp(query, 'i') } },
        { keywords: { $in: [new RegExp(query, 'i')] } }
      ]
    });
    
    console.log('Exact match result:', faq ? 'Found' : 'Not found');
    
    // If no exact match, try text search
    if (!faq) {
      console.log('Trying text search');
      try {
        const searchResults = await ChatbotFAQ.find(
          { $text: { $search: query } },
          { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } }).limit(1);
        
        console.log('Text search results:', searchResults.length);
        
        if (searchResults.length > 0) {
          faq = searchResults[0];
        }
      } catch (searchError) {
        console.error('Error during text search:', searchError);
        // Continue execution even if text search fails
      }
    }
    
    // If still no match, return default response
    if (!faq) {
      console.log('No match found, returning default response');
      return res.status(200).json({ 
        success: true, 
        answer: "Sorry, I'm having trouble understanding your question. Please try asking in a different way or contact our support." 
      });
    }
    
    console.log('Returning answer for question:', faq.question);
    res.status(200).json({ success: true, answer: faq.answer });
  } catch (error) {
    console.error('Error processing chatbot query:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing query', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 