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
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
      >
        {isOpen ? <IoClose size={24} /> : <BsChatDots size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-200">
          {/* Chat header */}
          <div className="bg-blue-600 text-white p-4 flex items-center">
            <FaRobot className="mr-2" size={20} />
            <h3 className="font-medium">Workport Assistant</h3>
            <button 
              onClick={toggleLanguage}
              className="ml-auto mr-2 text-white bg-blue-700 hover:bg-blue-800 rounded-md px-2 py-1 text-xs"
            >
              {language === 'english' ? 'हिंदी' : 'English'}
            </button>
            <button 
              onClick={toggleChat} 
              className="text-white hover:text-gray-200"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-gray-200 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-200 text-gray-800 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Common questions suggestions */}
            {showSuggestions && (
              <div className="mt-4 mb-2">
                <p className="text-sm text-gray-500 mb-2">
                  {language === 'english' ? 'Common questions:' : 'सामान्य प्रश्न:'}
                </p>
                
                {/* Category tabs */}
                <div className="flex mb-3 border-b border-gray-200">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center px-3 py-2 text-sm ${
                        activeCategory === category.id
                          ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                          : 'text-gray-500 hover:text-blue-500'
                      }`}
                    >
                      <span className="mr-1">{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
                
                {/* Questions for active category */}
                <div className="flex flex-col gap-2">
                  {commonQuestions[activeCategory].map((question) => (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionClick(language === 'english' ? question.english : question.hindi)}
                      className="bg-white text-left text-gray-800 text-sm border border-gray-300 rounded-lg px-4 py-2 hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-start"
                    >
                      <span className="text-blue-600 mr-2 mt-0.5">
                        <FaQuestion size={14} />
                      </span>
                      <span>{language === 'english' ? question.english : question.hindi}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={language === 'english' ? "Type your question here..." : "अपना प्रश्न यहां टाइप करें..."}
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`bg-blue-600 text-white px-4 rounded-r-lg flex items-center justify-center ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
              disabled={isLoading}
            >
              <IoMdSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 