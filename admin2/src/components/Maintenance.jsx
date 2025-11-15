import React from 'react'
import { AlertCircle, Ban, CheckCircle, ClipboardPenLine, Search, Wrench } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from '../axios';

const Maintenance = () => {
  const [data, setData] = useState({
    maintenance: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch maintenance issues from backend
  useEffect(() => {
    fetchMaintenanceIssues();
  }, []);

  const fetchMaintenanceIssues = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/user/all');
      
      // Filter users who have queryType = "Maintenance Issue"
      const maintenanceIssues = [];
      response.data.users.forEach(user => {
        if (user.queryType === 'Maintenance Issue' && user.querySubject) {
          maintenanceIssues.push({
            id: user._id,
            userId: user._id,
            room: user.roomAssigned || user.appliedRoom || 'Not assigned',
            issue: user.querySubject,
            description: user.queryDescription,
            priority: determinePriority(user.queryDescription),
            status: user.queryStatus || 'pending', // Use queryStatus from backend
            reportedBy: user.name,
            reportedByEmail: user.email,
            assignedTo: user.assignedTo || null,
            reportedAt: user.createdAt || new Date(),
            adminResponse: user.queryResponse || null
          });
        }
      });
      
      setData({ maintenance: maintenanceIssues });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching maintenance issues:', error);
      setLoading(false);
    }
  };

  // Auto-detect priority based on keywords in description
  const determinePriority = (description) => {
    const lowercaseDesc = description?.toLowerCase() || '';
    if (lowercaseDesc.includes('urgent') || lowercaseDesc.includes('emergency') || lowercaseDesc.includes('leak')) {
      return 'high';
    } else if (lowercaseDesc.includes('soon') || lowercaseDesc.includes('important')) {
      return 'medium';
    }
    return 'low';
  };

  // Calculate statistics dynamically
  const totalRequests = data.maintenance.length;
  const pendingRequests = data.maintenance.filter(issue => issue.status === 'pending').length;
  const inProgressRequests = data.maintenance.filter(issue => issue.status === 'in-progress').length;
  const completedRequests = data.maintenance.filter(issue => issue.status === 'completed').length;

  const handleAssign = async (issueId) => {
    try {
      // Update status in backend
      await axios.put(`/user/maintenance-status/${issueId}`, {
        status: 'in-progress',
        assignedTo: 'Maintenance Staff'
      });
      
      alert('Issue assigned to maintenance staff!');
      fetchMaintenanceIssues(); // Refresh data
    } catch (error) {
      console.error('Error assigning issue:', error);
      alert('Failed to assign issue');
    }
  };

  const handleMarkComplete = async (issueId) => {
    const response = prompt('Enter completion notes:');
    if (response === null) return; // User cancelled
    
    try {
      // Update status and response in backend
      await axios.put(`/user/maintenance-status/${issueId}`, {
        status: 'completed',
        response: response || 'Issue has been resolved.'
      });
      
      alert('Issue marked as complete!');
      fetchMaintenanceIssues(); // Refresh data
    } catch (error) {
      console.error('Error marking complete:', error);
      alert('Failed to mark issue as complete');
    }
  };

  const handleReject = async (issueId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return; // User cancelled
    
    try {
      // Update status to rejected in backend
      await axios.put(`/user/maintenance-status/${issueId}`, {
        status: 'rejected',
        response: reason || 'Request has been rejected.'
      });
      
      alert('Issue rejected!');
      fetchMaintenanceIssues(); // Refresh data
    } catch (error) {
      console.error('Error rejecting issue:', error);
      alert('Failed to reject issue');
    }
  };

  const handleViewDetails = (issue) => {
    setSelectedIssue(issue);
    setShowDetailsModal(true);
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  const filteredIssues = data.maintenance.filter(issue => {
    const matchesSearch = issue.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || issue.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

    const MaintenanceCard = ({ issue }) => (

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${issue.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30' :
                            issue.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                'bg-green-100 dark:bg-green-900/30'
                        }`}>
                        <Wrench className={`h-5 w-5 ${issue.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                                issue.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-green-600 dark:text-green-400'
                            }`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 ">Room {issue.room}</h3>
                        <p className="text-sm text-gray-600 ">{issue.issue}</p>
                    </div>
                </div>
                <div className="text-right space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[issue.priority]}`}>
                        {issue.priority.toUpperCase()}
                    </span>
                    <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[issue.status]}`}>
                            {issue.status.replace('-', ' ').toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-sm text-black mb-4">{issue.description}</p>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 ">Reported by:</span>
                    <span className="font-medium text-gray-900 ">{issue.reportedBy}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 ">Assigned to:</span>
                    <span className="font-medium text-gray-900 ">{issue.assignedTo || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 ">Reported:</span>
                    <span className="font-medium text-gray-900 ">
                        {new Date(issue.reportedAt).toLocaleDateString()}
                    </span>
                </div>
                {issue.estimatedCompletion && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 ">Estimated completion:</span>
                        <span className="font-medium text-gray-900 ">
                            {new Date(issue.estimatedCompletion).toLocaleDateString()}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex space-x-2">
                {issue.status === 'pending' && (
                    <>
                        <button 
                            onClick={() => handleAssign(issue.id)}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Assign
                        </button>
                        <button 
                            onClick={() => handleReject(issue.id)}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Reject
                        </button>
                    </>
                )}
                {issue.status === 'in-progress' && (
                    <button 
                        onClick={() => handleMarkComplete(issue.id)}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Mark Complete
                    </button>
                )}
                <button 
                    onClick={() => handleViewDetails(issue)}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                >
                    View Details
                </button>
            </div>
        </div>
    );
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Maintenance Requests</h2>
                    <p className="text-gray-600">Manage maintenance issues reported by students</p>
                </div>
                <button
                    onClick={fetchMaintenanceIssues}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <CheckCircle size={18} />
                    Refresh
                </button>
            </div>

            {/* Statistics Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
                <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200'>
                    <div className='flex justify-between items-center mb-4'>
                        <ClipboardPenLine size={24} className='' />
                        <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full font-semibold">Total</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{totalRequests}</h3>
                    <p className="text-sm text-gray-600 mt-1">Total requests</p>
                </div>

                <div className='bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200'>
                    <div className='flex justify-between items-center mb-4'>
                        <AlertCircle className="text-yellow-600" size={28} />
                        <span className="text-xs bg-yellow-200 text-yellow-700 px-2 py-1 rounded-full font-semibold">Pending</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{pendingRequests}</h3>
                    <p className="text-sm text-gray-600 mt-1">Total pending requests</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="text-green-600" size={28} />
                        <span className="text-xs bg-gradient-to-r from-amber-200 to-amber-200 text-green-700 px-2 py-1 rounded-full font-semibold">Active</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{inProgressRequests}</h3>
                    <p className="text-sm text-gray-600 mt-1">Currently Working</p>
                </div>

                <div className='bg-gradient-to-br from-red-50 to-amber-900-50 rounded-xl p-6 border-2 border-red-200'>
                    <div className='flex justify-between items-center mb-4'>
                        <Ban className="text-red-600" size={28} />
                        <span className="text-xs bg-red-200 text-red-700 px-2 py-1 rounded-full font-semibold">Completed</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{completedRequests}</h3>
                    <p className="text-sm text-gray-600 mt-1">Total completed</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by room, issue, name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
                    <p className="text-gray-600 mt-4">Loading maintenance requests...</p>
                </div>
            ) : (
                <>
                    {/* Maintenance Cards Grid */}
                    {filteredIssues.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredIssues.map(issue => (
                                <MaintenanceCard key={issue.id} issue={issue} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <Wrench size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500 text-lg font-medium">No maintenance requests found</p>
                            <p className="text-gray-400 text-sm mt-2">
                                {searchTerm ? 'Try adjusting your search' : 'No maintenance issues reported yet'}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Maintenance