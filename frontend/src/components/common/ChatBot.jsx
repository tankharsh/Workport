import React, { useState, useRef, useEffect } from 'react';
import { IoMdSend } from 'react-icons/io';
import { FaRobot } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { BsChatDots } from 'react-icons/bs';
import { FaQuestion, FaUser, FaTools, FaCreditCard } from 'react-icons/fa';
import axiosInstance from '../../config/axios';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm Workport's assistant. You can ask me any questions about the app or select from the common questions below.", 
      sender: 'bot' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activeCategory, setActiveCategory] = useState('general');
  const [language, setLanguage] = useState('english'); // 'english' or 'hindi'

  // Categories for questions
  const categories = [
    { id: 'general', name: 'General', icon: <FaQuestion /> },
    { id: 'account', name: 'Account', icon: <FaUser /> },
    { id: 'services', name: 'Services', icon: <FaTools /> },
    { id: 'payment', name: 'Payment', icon: <FaCreditCard /> }
  ];

  // Common questions that users might ask - organized by category
  const commonQuestions = {
    general: [
      { 
        id: 1, 
        english: "What is Workport?",
        hindi: "Workport क्या है?"
      },
      { 
        id: 2, 
        english: "Is Workport available on mobile app?",
        hindi: "क्या Workport मोबाइल ऐप पर उपलब्ध है?"
      }
    ],
    account: [
      { 
        id: 3, 
        english: "How do I create an account?",
        hindi: "मैं अकाउंट कैसे बना सकता हूँ?"
      },
      { 
        id: 4, 
        english: "How do I become a service provider?",
        hindi: "मैं सर्विस प्रोवाइडर कैसे बन सकता हूँ?"
      },
      { 
        id: 5, 
        english: "How do I reset my password?",
        hindi: "मैं अपना पासवर्ड कैसे रीसेट करूं?"
      }
    ],
    services: [
      { 
        id: 6, 
        english: "How do I list my services?",
        hindi: "मैं अपनी सेवाएं कैसे लिस्ट करूं?"
      },
      { 
        id: 7, 
        english: "Can I cancel my booking?",
        hindi: "क्या मैं अपनी बुकिंग रद्द कर सकता हूँ?"
      },
      { 
        id: 8, 
        english: "How do I contact a service provider?",
        hindi: "मैं सर्विस प्रोवाइडर से कैसे संपर्क करूं?"
      }
    ],
    payment: [
      { 
        id: 9, 
        english: "How do I pay for services?",
        hindi: "मैं सेवाओं के लिए भुगतान कैसे करूं?"
      },
      { 
        id: 10, 
        english: "Are there any commissions or fees?",
        hindi: "क्या Workport पर कोई कमीशन या शुल्क है?"
      }
    ]
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (inputMessage.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setShowSuggestions(false);
    
    try {
      console.log('Sending query to chatbot API:', inputMessage);
      
      // Send message to backend using axiosInstance
      const response = await axiosInstance.post('/api/chatbot/query', { 
        query: inputMessage 
      });
      
      console.log('Received response from chatbot API:', response.data);
      
      // Add bot response to chat
      setMessages(prev => [...prev, { 
        text: response.data.answer || "Sorry, I'm having trouble understanding your question.", 
        sender: 'bot' 
      }]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      
      // Log more detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble understanding your question. Please try again or contact our support.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
      setInputMessage('');
      // Show suggestions again after a response
      setTimeout(() => setShowSuggestions(true), 1000);
    }
  };

  const handleQuestionClick = (question) => {
    setInputMessage(question);
    handleSendMessage({ preventDefault: () => {} });
  };

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'hindi' : 'english');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-xl flex items-center justify-center transform hover:scale-105 transition-all duration-300 ease-in-out"
        aria-label="Toggle chat"
      >
        {isOpen ? <IoClose size={24} className="transition-transform duration-300 ease-in-out hover:rotate-90" /> : 
        <BsChatDots size={24} className="animate-bounce" />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-[95vw] md:w-[450px] lg:w-[400px] h-[80vh] max-h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 transform transition-all duration-300 ease-in-out">
          {/* Chat header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 flex items-center">
            <div className="flex items-center space-x-3">
              <FaRobot className="text-white" size={28} />
              <h3 className="font-semibold text-xl">Workport Assistant</h3>
            </div>
            <div className="ml-auto flex items-center space-x-3">
              <button 
                onClick={toggleLanguage}
                className="px-4 py-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300"
              >
                {language === 'english' ? 'हिंदी' : 'English'}
              </button>
              <button 
                onClick={toggleChat} 
                className="text-white hover:text-gray-200 p-2 hover:bg-white/20 rounded-full transition-all duration-300"
              >
                <IoClose size={24} />
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 px-6 py-4 overflow-y-auto bg-gray-50 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-3`}
              >
                {message.sender === 'bot' && (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FaRobot className="text-blue-600" size={20} />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none shadow-md'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="text-[15px] leading-relaxed">{message.text}</p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <FaUser className="text-white" size={20} />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-end space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaRobot className="text-blue-600" size={20} />
                </div>
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none p-4 shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Common questions suggestions */}
          {showSuggestions && (
            <div className="bg-white p-6 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-600 mb-4">
                {language === 'english' ? 'Common questions:' : 'सामान्य प्रश्न:'}
              </p>
              
              {/* Category tabs */}
              <div className="flex mb-5 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center px-5 py-2.5 text-sm rounded-full mr-3 transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Questions list */}
              <div className="space-y-2.5 max-h-[200px] overflow-y-auto scrollbar-hide">
                {commonQuestions[activeCategory].map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionClick(q[language])}
                    className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    {q[language]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={language === 'english' ? "Type your message..." : "अपना संदेश लिखें..."}
                className="flex-1 px-5 py-3 text-[15px] text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className={`p-3 rounded-full transition-all duration-300 ${
                  inputMessage.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <IoMdSend size={22} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 