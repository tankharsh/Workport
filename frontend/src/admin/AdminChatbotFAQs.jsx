import { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminChatbotFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    keywords: '',
    category: 'general'
  });

  // Fetch all FAQs
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axiosInstance.get('/api/chatbot/faqs');
      setFaqs(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setError(true);
      setFaqs([]);
      toast.error('Error loading FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      keywords: '',
      category: 'general'
    });
    setEditingFaq(null);
    setShowForm(false);
  };

  // Set up form for editing
  const handleEdit = (faq) => {
    setEditingFaq(faq._id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      keywords: Array.isArray(faq.keywords) ? faq.keywords.join(', ') : '',
      category: faq.category || 'general'
    });
    setShowForm(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const keywordsArray = formData.keywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword !== '');
      
      const payload = {
        question: formData.question,
        answer: formData.answer,
        keywords: keywordsArray,
        category: formData.category
      };
      
      if (editingFaq) {
        // Update existing FAQ
        await axiosInstance.put(`/api/chatbot/faqs/${editingFaq}`, payload);
        toast.success('FAQ updated successfully');
      } else {
        // Add new FAQ
        await axiosInstance.post('/api/chatbot/faqs', payload);
        toast.success('FAQ added successfully');
      }
      
      resetForm();
      fetchFAQs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Error saving FAQ');
    }
  };

  // Delete FAQ
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await axiosInstance.delete(`/api/chatbot/faqs/${id}`);
        toast.success('FAQ deleted successfully');
        fetchFAQs();
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        toast.error('Error deleting FAQ');
      }
    }
  };

  // Get category label
  const getCategoryLabel = (category) => {
    const categories = {
      general: 'General',
      account: 'Account',
      services: 'Services',
      payment: 'Payment',
      other: 'Other'
    };
    return categories[category] || category;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chatbot FAQs Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" />
          {showForm ? 'Close Form' : 'Add New FAQ'}
        </button>
      </div>

      {/* FAQ Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Question</label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Answer</label>
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Keywords (comma separated)</label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="general">General</option>
                <option value="account">Account</option>
                <option value="services">Services</option>
                <option value="payment">Payment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {editingFaq ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAQs List */}
      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-2">Loading...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Error loading FAQs. Please refresh the page or try again later.</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {faqs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No FAQs found. Use the button above to add a new FAQ.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Answer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {faqs.map((faq) => (
                    <tr key={faq._id}>
                      <td className="px-6 py-4 whitespace-normal">
                        <div className="text-sm font-medium text-gray-900">
                          {faq.question}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-normal">
                        <div className="text-sm text-gray-500 max-w-md">
                          {faq.answer && faq.answer.length > 100
                            ? `${faq.answer.substring(0, 100)}...`
                            : faq.answer}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getCategoryLabel(faq.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(faq._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminChatbotFAQs; 