import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle, Clock, Search, Filter, X, Eye } from 'lucide-react';
import axios from '../axios';

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Fetch all queries from users
  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await axios.get('/user/all');
      // Filter users who have queries that are NOT "Maintenance Issue"
      const allQueries = [];
      response.data.users.forEach(user => {
        if (user.queryType && user.queryType !== 'Maintenance Issue') {
          allQueries.push({
            userId: user._id,
            userName: user.name,
            email: user.email,
            phone: user.phone,
            querySubject: user.querySubject,
            queryType: user.queryType,
            queryDescription: user.queryDescription,
            queryResponse: user.queryResponse || '',
            status: user.queryResponse ? 'replied' : 'pending'
          });
        }
      });
      setQueries(allQueries);
    } catch (error) {
      console.error('Error fetching queries:', error);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      alert('Please enter a response');
      return;
    }

    try {
      await axios.put(`/user/query-response/${selectedQuery.userId}`, {
        queryResponse: replyText
      });
      alert('Response sent successfully!');
      setShowReplyModal(false);
      setReplyText('');
      setSelectedQuery(null);
      fetchQueries(); // Refresh the list
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Error: ' + (error.response?.data?.message || 'Failed to send response'));
    }
  };

  const filteredQueries = queries.filter(query => {
    const matchesSearch = 
      query.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.querySubject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || query.queryType === filterType;
    const matchesStatus = filterStatus === 'all' || query.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Statistics
  const totalQueries = queries.length;
  const pendingQueries = queries.filter(q => q.status === 'pending').length;
  const repliedQueries = queries.filter(q => q.status === 'replied').length;

  const getTypeColor = (type) => {
    switch(type) {
      case 'Room Related': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Payment Related': return 'bg-green-100 text-green-800 border-green-300';
      case 'Food & Mess': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Other': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  const QueryCard = ({ query }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">{query.userName.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{query.userName}</h3>
            <p className="text-sm text-gray-600">{query.email}</p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(query.queryType)}`}>
            {query.queryType}
          </span>
          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              query.status === 'replied' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
            }`}>
              {query.status === 'replied' ? 'Replied' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">{query.querySubject}</h4>
        <p className="text-sm text-gray-700 mb-3">{query.queryDescription}</p>
        
        {query.queryResponse && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
            <p className="text-xs text-green-700 font-semibold mb-1">Admin Response:</p>
            <p className="text-sm text-green-900">{query.queryResponse}</p>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        {query.status === 'pending' && (
          <button
            onClick={() => {
              setSelectedQuery(query);
              setShowReplyModal(true);
            }}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Send size={16} />
            Reply
          </button>
        )}
        {query.status === 'replied' && (
          <button
            onClick={() => {
              setSelectedQuery(query);
              setReplyText(query.queryResponse);
              setShowReplyModal(true);
            }}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            View/Edit Reply
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Student Queries</h2>
        <p className="text-gray-600">Manage and respond to student queries</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="text-blue-600" size={28} />
            <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full font-semibold">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{totalQueries}</h3>
          <p className="text-sm text-gray-600 mt-1">Total Queries</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-yellow-600" size={28} />
            <span className="text-xs bg-yellow-200 text-yellow-700 px-2 py-1 rounded-full font-semibold">Pending</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{pendingQueries}</h3>
          <p className="text-sm text-gray-600 mt-1">Awaiting Response</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="text-green-600" size={28} />
            <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full font-semibold">Replied</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{repliedQueries}</h3>
          <p className="text-sm text-gray-600 mt-1">Responded</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, subject, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="all">All Types</option>
              <option value="Room Related">Room Related</option>
              <option value="Payment Related">Payment Related</option>
              <option value="Food & Mess">Food & Mess</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQueries.length > 0 ? (
          filteredQueries.map((query, index) => (
            <QueryCard key={index} query={query} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg font-medium">No queries found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Reply to Query</h3>
                <button 
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyText('');
                    setSelectedQuery(null);
                  }}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">From: <span className="font-semibold text-gray-900">{selectedQuery.userName}</span></p>
                <p className="text-sm text-gray-600 mb-1">Email: <span className="font-semibold text-gray-900">{selectedQuery.email}</span></p>
                <p className="text-sm text-gray-600">Type: <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(selectedQuery.queryType)}`}>{selectedQuery.queryType}</span></p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{selectedQuery.querySubject}</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {selectedQuery.queryDescription}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Response *</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Write your response here..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleReply}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Response
                </button>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyText('');
                    setSelectedQuery(null);
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Queries;
