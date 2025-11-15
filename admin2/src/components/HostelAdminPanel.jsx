import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X, Building2, Users, Home, Menu, XCircle, Search, Bell, ChevronDown, Edit2, Eye, Filter, Download, Upload, RefreshCw, MoreVertical, AlertCircle, TrendingUp, Calendar, Settings, IndianRupee, UserCog, MessageSquare } from 'lucide-react';
import axios from '../axios';
import StaffManagement from './Staff';
import Maintenance from './Maintenance';
import Queries from './Queries';


export default function HostelAdminPanel() {

  const [requests1, setRequests1] = useState([]);
  const [hostels, setHostels] = useState([]);



  const fetchData = async () => {
    try {
      const res = await axios.get('/admin/rooms');
      const res_student = await axios.get('/admin/pending-requests');
      console.log('Fetched hostels:', res.data);
      console.log('Fetched student requests:', res_student.data.rooms);
      setHostels(res.data.rooms);

      const getUserData = await axios.get('/user/all');
      console.log('All Users Data:', getUserData.data.users);
      setRequests1(getUserData.data.users);
      // setRequests1(res_student.data.rooms);
      setAppliedRooms(res_student.data.rooms.map(r => r?.applicants));
      // setHostels(res.data);
    }
    catch (error) {
      console.error('Error fetching hostels:', error);
    }
  }

  useEffect(() => {
    fetchData();

  }, [])

  console.log("Requests Data:", requests1);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('date');

  const [formData, setFormData] = useState({
    roomNumber: '',
    hostelName: '',
    floor: '',
    capacity: '',
    wardenName: '',
    coWardenName: '',
    amenities: []
  });

  const [editFormData, setEditFormData] = useState({
    roomNumber: '',
    hostelName: '',
    floor: '',
    capacity: '',
    wardenName: '',
    coWardenName: '',
    amenities: []
  });

  // Show toast notification
  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'floor' || name === 'capacity' ? parseInt(value) || '' : value
    }));
  };

  const handleAddHostel = async () => {
    if (!formData.roomNumber || !formData.hostelName || !formData.floor ||
      !formData.capacity || !formData.wardenName || !formData.coWardenName) {
      showNotification('Please fill all required fields', 'error');
      return;
    }
    try {
      const res = await axios.post('/admin/create', formData);
      console.log('Hostel room added:', res.data);
      fetchData();
      // setHostels(prev => [...prev, res.data]);
      showNotification('Hostel room added successfully!');
    } catch (error) {
      showNotification('Error adding hostel room', 'error');
    }

  }

  const handleUpdateHostel = async () => {
    try {
      console.log('Editing hostel:', editingHostel);
      console.log('Updating hostel with ID:', editingHostel._id);

      const res = await axios.put(`/admin/rooms/${editingHostel.hostelName}/${editingHostel.roomNumber}`, formData);
      console.log('Hostel room updated:', res.data);
      showNotification('Hostel room updated successfully!');
      fetchData();
    } catch (error) {
      showNotification('Error updating hostel room', 'error');
    }

  };

  const handleEditHostel = (hostel) => {
    setEditingHostel(hostel);
    setFormData(hostel);
    // console.log("Hostel is being edited:", hostel);

    // setEditFormData({ ...editFormData, ...hostel });
    setShowForm(true);
  };

  const handleDeleteHostel = async (id) => {
    console.log("Delete hostel with ID:", id);

    try {
      const res = await axios.delete(`/admin/rooms/${id}`);
      console.log('Hostel room deleted:', res.data);
      showNotification('Hostel room deleted successfully!');
      fetchData();
    } catch (error) {
      showNotification('Error deleting hostel room', 'error');
    }
  };

  const [appliedRooms, setAppliedRooms] = useState([]);


  //Dry Run
  const [finalAppliedRooms, setFinalAppliedRooms] = useState([]);
  const [appliedCount, setAppliedCount] = useState(0);

  useEffect(() => {
    if (appliedRooms && appliedRooms.length > 0) {
      const final = appliedRooms
        .flat()
        .filter(r => r && Object.keys(r).length > 0 && r.roomStatus === 'applied');

      setFinalAppliedRooms(final);
      setAppliedCount(final.length); // total applied requests
    } else {
      setFinalAppliedRooms([]);
      setAppliedCount(0);
    }
    // fetchData();
    console.log("Final Applied Rooms:", finalAppliedRooms);
  }, [appliedRooms]); // re-run whenever appliedRooms changes

  console.log("Total Applied Requests:", finalAppliedRooms);

  //Dry Run complete




  // console.log('Applied Rooms:', appliedRooms.filter(r => r.roomStatus === 'applied'));

  const handleRequest = async (requestId, roomNumber, action) => {
    console.log(`Request ID: ${requestId}, Room Number: ${roomNumber}, Action: ${action}`);
    try {
      const res = await axios.post('admin/approve-reject', {
        userId: requestId,
        roomNumber,
        action
      });
      fetchData();
      console.log('Request handled:', res.data);

    } catch (error) {
      console.error('Error handling request:', error);
    }
    // setLoading(true);
    // setTimeout(() => {
    //   setRequests(requests.map(req =>
    //     req.id === requestId ? { ...req, status: action } : req
    //   ));
    //   setShowRequestDetails(false);
    //   setLoading(false);
    showNotification(
      action === 'accept' ? 'Request accepted successfully!' : 'Request rejected',
      action === 'accept' ? 'success' : 'warning'
    );
    // }, 600);

  };

  const viewRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const pendingCount = requests1.filter(r => r.roomStatus === 'applied').length;
  const acceptedCount = requests1.filter(r => r.roomStatus === 'assigned').length;
  console.log("Accepted Count:", acceptedCount);
  const rejectedCount = requests1.filter(r => r.roomStatus === 'reject').length;
  const totalCapacity = hostels.reduce((sum, h) => sum + h.capacity, 0);
  const totalOccupied = hostels.reduce((sum, h) => sum + (h.assignedTo.length || 0), 0);
  const availableRooms = hostels.filter(h => h.assignedTo.length < h.capacity).length;

  const filteredHostels = hostels.filter(hostel =>
    hostel.hostelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostel.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostel.wardenName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = requests1
    .filter(req => {
      const matchesSearch =
        req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.appliedRoom.toString().includes(searchTerm);

      const matchesFilter = filterStatus === 'all' || req.roomStatus === filterStatus;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  // Export Functions
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No data to export!');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Handle nested objects and arrays
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          // Escape commas and quotes
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No data to export!');
      return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportRoomsData = (format) => {
    const roomsData = hostels.map(room => ({
      roomNumber: room.roomNumber,
      hostelName: room.hostelName,
      floor: room.floor,
      capacity: room.capacity,
      occupied: room.assignedTo?.length || 0,
      available: room.capacity - (room.assignedTo?.length || 0),
      wardenName: room.wardenName,
      coWardenName: room.coWardenName,
      amenities: Array.isArray(room.amenities) ? room.amenities.join('; ') : room.amenities,
      lastUpdated: room.lastUpdated
    }));

    if (format === 'csv') {
      exportToCSV(roomsData, 'hostel_rooms');
    } else if (format === 'json') {
      exportToJSON(roomsData, 'hostel_rooms');
    }
  };

  const exportStudentsData = (format) => {
    const studentsData = requests1.map(student => ({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      year: student.year,
      roomNumber: student.roomNumber,
      hostelName: student.hostelName,
      status: student.roomStatus,
      appliedDate: student.createdAt ? new Date(student.createdAt).toISOString().split('T')[0] : 'N/A'
    }));

    if (format === 'csv') {
      exportToCSV(studentsData, 'students_data');
    } else if (format === 'json') {
      exportToJSON(studentsData, 'students_data');
    }
  };

  const exportAllData = (format) => {
    const allData = {
      exportDate: new Date().toISOString(),
      statistics: {
        totalRooms: hostels.length,
        totalCapacity: totalCapacity,
        totalOccupied: totalOccupied,
        availableRooms: availableRooms,
        pendingRequests: pendingCount,
        approvedRequests: acceptedCount,
        rejectedRequests: rejectedCount,
        occupancyRate: `${((totalOccupied / totalCapacity) * 100).toFixed(2)}%`
      },
      rooms: hostels,
      students: requests1
    };

    if (format === 'json') {
      exportToJSON([allData], 'complete_hostel_data');
    } else {
      alert('Complete data export is only available in JSON format.');
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex overflow-hidden">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 ${toastType === 'success' ? 'bg-green-500' :
          toastType === 'error' ? 'bg-red-500' :
            'bg-yellow-500'
          } text-white animate-slide-in-right`}>
          {toastType === 'success' ? <Check size={20} /> :
            toastType === 'error' ? <AlertCircle size={20} /> :
              <AlertCircle size={20} />}
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static w-64 sm:w-72 h-screen transition-transform duration-300 bg-white shadow-2xl z-30 border-r border-gray-200`}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-lg">
                  <Building2 size={28} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Hostel Portal</h2>
                  <p className="text-indigo-200 text-xs">Admin Dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
              >
                <XCircle size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Total Rooms</p>
                <p className="text-2xl font-bold text-indigo-600">{hostels.length}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('hostels');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'hostels'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
              <Building2 size={20} />
              <div className="flex items-center justify-between flex-1">
                <span>Manage Rooms</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${activeTab === 'hostels' ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                  {hostels.length}
                </span>
              </div>
            </button>



            <button
              onClick={() => {
                setActiveTab('requests');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'requests'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
              <Users size={20} />
              <div className="flex items-center justify-between flex-1">
                <span>Applications</span>
                {pendingCount > 0 && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${activeTab === 'requests' ? 'bg-white text-red-600' : 'bg-red-500 text-white'
                    } animate-pulse`}>
                    {pendingCount}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('staff');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'staff'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
              <UserCog size={20} />
              <div className="flex items-center justify-between flex-1">
                <span>Staff Management</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('maintenance')
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'maintenance'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                : 'hover:bg-gray-100 text-gray-700'}`}

            >
              <Settings size={20} />
              <div className="flex items-center justify-between flex-1">
                <span>Maintenance</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('queries')
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'queries'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                : 'hover:bg-gray-100 text-gray-700'}`}

            >
              <MessageSquare size={20} />
              <div className="flex items-center justify-between flex-1">
                <span>Student Queries</span>
              </div>
            </button>


            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Quick Actions</p>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700 text-sm transition-all">
                <Download size={18} />
                <span>Export Reports</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700 text-sm transition-all">
                <Upload size={18} />
                <span>Import Data</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700 text-sm transition-all">
                <RefreshCw size={18} />
                <span>Sync Database</span>
              </button>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-md">
                  A
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">admin@hostel.com</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen w-full overflow-hidden">
        {/* Top Bar */}
        <div className="shadow-sm border-b border-gray-200 p-3 md:p-4 z-10 backdrop-blur-sm bg-white/95 flex-shrink-0">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 md:p-2.5 hover:bg-gray-100 rounded-xl transition-all lg:hidden flex-shrink-0"
              >
                <Menu size={20} className="text-gray-700 md:w-6 md:h-6" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">
                  {activeTab === 'dashboard' && ' Overview'}
                  {activeTab === 'hostels' && ' Rooms'}
                  {activeTab === 'requests' && ' Applications'}
                  {activeTab === 'staff' && ' Staff Management'}
                  {activeTab === 'maintenance' && ' Maintenance Requests'}
                  {activeTab === 'queries' && ' Student Queries'}
                </h1>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5 hidden sm:block truncate">
                  {activeTab === 'dashboard' && 'Monitor operations'}
                  {activeTab === 'hostels' && 'Manage rooms'}
                  {activeTab === 'requests' && 'Review applications'}
                  {activeTab === 'staff' && 'Manage hostel staff'}
                  {activeTab === 'maintenance' && 'Handle maintenance requests'}
                  {activeTab === 'queries' && 'Respond to student queries'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              <button className="relative p-2 md:p-2.5 hover:bg-gray-100 rounded-xl transition-all group">
                <Bell size={18} className="text-gray-700 md:w-5 md:h-5" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-bold text-[10px] md:text-xs">
                    {pendingCount}
                  </span>
                )}
              </button>
              <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow-md">
                <Calendar size={14} className="md:w-4 md:h-4" />
                <span className="text-xs md:text-sm font-medium hidden lg:inline">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-xs font-medium lg:hidden">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Building2 size={28} className="text-white" />
                    </div>
                    <TrendingUp size={20} className="text-green-500" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total Rooms</p>
                  <p className="text-4xl font-bold text-gray-900">{hostels.length}</p>
                  <p className="text-xs text-green-600 font-medium mt-2">↑ Active facilities</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Users size={28} className="text-white" />
                    </div>
                    <AlertCircle size={20} className="text-orange-500" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Pending Requests</p>
                  <p className="text-4xl font-bold text-gray-900">{pendingCount}</p>
                  <p className="text-xs text-orange-600 font-medium mt-2">Needs attention</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Check size={28} className="text-white" />
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">Active</span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Approved</p>
                  <p className="text-4xl font-bold text-gray-900">{acceptedCount}</p>
                  <p className="text-xs text-gray-500 font-medium mt-2">{((acceptedCount / requests1.length) * 100).toFixed(0)}% success rate</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Users size={28} className="text-white" />
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">{totalOccupied}/{totalCapacity}</span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Occupancy</p>
                  <p className="text-4xl font-bold text-gray-900">{((totalOccupied / totalCapacity) * 100).toFixed(0)}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all" style={{ width: `${(totalOccupied / totalCapacity) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Export Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Download size={24} className="text-indigo-600" />
                      Export Data
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Download your hostel management data in various formats</p>
                  </div>
                  <RefreshCw size={20} className="text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors" onClick={fetchData} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Rooms Data Export */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-500 p-2.5 rounded-lg">
                        <Building2 size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Rooms Data</h4>
                        <p className="text-xs text-gray-500">{hostels.length} total rooms</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => exportRoomsData('csv')}
                        className="flex-1 bg-white hover:bg-blue-500 hover:text-white text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm border border-blue-200"
                      >
                        📊 CSV
                      </button>
                      <button
                        onClick={() => exportRoomsData('json')}
                        className="flex-1 bg-white hover:bg-blue-500 hover:text-white text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm border border-blue-200"
                      >
                        📄 JSON
                      </button>
                    </div>
                  </div>

                  {/* Students Data Export */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-green-500 p-2.5 rounded-lg">
                        <Users size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Students Data</h4>
                        <p className="text-xs text-gray-500">{requests1.length} total students</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => exportStudentsData('csv')}
                        className="flex-1 bg-white hover:bg-green-500 hover:text-white text-green-600 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm border border-green-200"
                      >
                        📊 CSV
                      </button>
                      <button
                        onClick={() => exportStudentsData('json')}
                        className="flex-1 bg-white hover:bg-green-500 hover:text-white text-green-600 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm border border-green-200"
                      >
                        📄 JSON
                      </button>
                    </div>
                  </div>

                  {/* Complete Data Export */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2.5 rounded-lg">
                        <Download size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Complete Data</h4>
                        <p className="text-xs text-gray-500">All data with stats</p>
                      </div>
                    </div>
                    <button
                      onClick={() => exportAllData('json')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-md"
                    >
                      📦 Export All (JSON)
                    </button>
                  </div>
                </div>

                {/* Export Info */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Export Information:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong>CSV:</strong> Best for Excel and data analysis tools</li>
                        <li><strong>JSON:</strong> Best for developers and system integration</li>
                        <li><strong>Complete Data:</strong> Includes statistics, rooms, and students in one file</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity & Available Rooms */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Recent Applications</h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline">View all →</button>
                  </div>
                  <div className="space-y-3">
                    {requests1.slice(0, 4).map(req => (
                      <div key={req.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100 cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-lg">{req.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{req.name}</p>
                            <p className="text-sm text-gray-500">Room {req.roomNumber} • {new Date(req.createdAt).toISOString().split('T')[0]}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${req.roomStatus === 'applied' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                          req.roomStatus === 'assigned' ? 'bg-green-100 text-green-700 border border-green-200' :
                            'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                          {req.roomStatus === 'applied' ? '⏳ Pending' :
                            req.roomStatus === 'assigned' ? '✓ Approved' : '✗ Rejected'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-white bg-opacity-20 p-2.5 rounded-lg">
                        <Building2 size={24} className='bg-black' />
                      </div>
                      <h3 className="text-lg font-bold">Available Rooms</h3>
                    </div>
                    <p className="text-5xl font-bold mb-2">{availableRooms}</p>
                    <p className="text-indigo-200 text-sm">Rooms with vacancies</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Request Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Pending</span>
                        <span className="font-bold text-orange-600">{pendingCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Approved</span>
                        <span className="font-bold text-green-600">{acceptedCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rejected</span>
                        <span className="font-bold text-red-600">{rejectedCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hostels Tab */}
          {activeTab === 'hostels' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by room, hostel name, warden..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setEditingHostel(null);
                    setFormData({
                      roomNumber: '',
                      hostelName: '',
                      floor: '',
                      capacity: '',
                      wardenName: '',
                      coWardenName: '',
                      amenities: []
                    });
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-medium"
                >
                  <Plus size={20} />
                  Add New Room
                </button>
              </div>

              {showForm && (
                <div className="bg-white p-6 rounded-2xl mb-6 border-2 border-indigo-200 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {editingHostel ? '✏️ Edit Hostel Room' : '➕ Add New Hostel Room'}
                    </h3>
                    <button onClick={() => { setShowForm(false); setEditingHostel(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Room Number *</label>
                      <input
                        type="text"
                        name="roomNumber"
                        value={formData.roomNumber}
                        readOnly={editingHostel ? true : false}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g., 303"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Hostel Name *</label>
                      <input
                        type="text"
                        name="hostelName"
                        value={formData.hostelName}
                        readOnly={editingHostel ? true : false}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g., Ambedkar Hostel"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Floor *</label>
                      <input
                        type="number"
                        name="floor"
                        value={formData.floor}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g., 3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity *</label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g., 3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Warden Name *</label>
                      <input
                        type="text"
                        name="wardenName"
                        value={formData.wardenName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g., Mr. Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Co-Warden Name *</label>
                      <input
                        type="text"
                        name="coWardenName"
                        value={formData.coWardenName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g., Ms. Ritu"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
                      <button
                        onClick={() => { setShowForm(false); setEditingHostel(null); }}
                        className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={editingHostel ? handleUpdateHostel : handleAddHostel}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? '⏳ Processing...' : editingHostel ? '💾 Update Room' : '➕ Add Room'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredHostels.map(hostel => (
                  <div key={hostel.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:border-indigo-300 transition-all transform hover:scale-105 group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                          <Building2 size={24} className="text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-indigo-600">Room {hostel.roomNumber}</p>
                          <p className="text-sm text-gray-600 font-medium">{hostel.hostelName}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditHostel(hostel)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all transform hover:scale-110"
                          title="Edit Room"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteHostel(hostel._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all transform hover:scale-110"
                          title="Delete Room"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Floor</p>
                        <p className="text-lg font-bold text-gray-900">{hostel.floor}F</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-100">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Capacity</p>
                        <p className="text-lg font-bold text-gray-900">{hostel.capacity} beds</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-100">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Warden</p>
                        <p className="text-sm font-bold text-gray-900">{hostel.wardenName}</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-3 rounded-xl border border-orange-100">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Co-Warden</p>
                        <p className="text-sm font-bold text-gray-900">{hostel.coWardenName}</p>
                      </div>
                    </div>
                    {hostel.amenities && hostel.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                        {hostel.amenities.map((amenity, idx) => (
                          <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, ID, or room number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium"
                    >
                      <Filter size={20} />
                      <span className="hidden sm:inline">Filter</span>
                    </button>
                    {showFilters && (
                      <div className="absolute top-full mt-2 right-0 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-3 w-48 z-20">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Status</p>
                        {['all', 'applied', 'assigned', 'reject'].map(status => (
                          <button
                            key={status}
                            onClick={() => { setFilterStatus(status); setShowFilters(false); }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filterStatus === status ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-gray-100'
                              }`}
                          >
                            {status === 'all' ? 'All Requests' : status === 'applied' ? 'Applied' : status === 'assigned' ? 'Approved' : 'Rejected'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4">
                {filteredRequests.map(req => (
                  <div key={req.id} className={`border-2 rounded-2xl p-6 transition-all transform hover:scale-102 ${req.roomStatus === 'applied' ? 'bg-white border-gray-200 hover:shadow-xl hover:border-orange-300' :
                    req.roomStatus === 'assigned' ? 'bg-green-50 border-green-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Student Name</p>
                          <p className="text-lg font-bold text-gray-900">{req?.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Course</p>
                          <p className="text-base font-semibold text-gray-700">{req.course}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Room Request</p>
                          <p className="text-lg font-bold text-indigo-600">{req.appliedRoom}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Request Date</p>
                          <p className="text-base font-semibold text-gray-700">{new Date(req.createdAt).toLocaleDateString('en-GB')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Status</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${req.roomStatus === 'applied' ? 'bg-orange-100 text-orange-700' :
                            req.roomStatus === 'assigned' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                            {req.roomStatus === 'applied' ? '⏳ Pending' :
                              req.roomStatus === 'assigned' ? '✓ Approved' : '✗ Rejected'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                        <button
                          onClick={() => viewRequestDetails(req)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all font-medium"
                        >
                          <Eye size={18} />
                          View Details
                        </button>
                        {req.roomStatus === 'applied' && (
                          <>
                            <button
                              onClick={() => handleRequest(req._id, req.appliedRoom, 'accept')}
                              disabled={loading}
                              className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 font-medium disabled:opacity-50"
                            >
                              <Check size={18} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRequest(req._id, req.appliedRoom, 'reject')}
                              disabled={loading}
                              className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 font-medium disabled:opacity-50"
                            >
                              <X size={18} />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'staff' && (<div>
            <StaffManagement />
          </div>
          )}

          {activeTab==='maintenance' && (
            <div>
              <Maintenance />
            </div>
          )}

          {activeTab==='queries' && (
            <div>
              <Queries />
            </div>
          )}

        </div>
      </div>

      {/* Request Details Modal */}
      {showRequestDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold ">Application Details</h3>
                <button
                  onClick={() => setShowRequestDetails(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</label>
                    <p className="text-lg font-bold text-gray-900 mt-1">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">User ID</label>
                    <p className="text-sm font-mono text-gray-700 mt-1 break-all">{selectedRequest.userId}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                    <p className="text-sm text-gray-700 mt-1">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</label>
                    <p className="text-sm text-gray-700 mt-1">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</label>
                    <p className="text-sm text-gray-700 mt-1">{selectedRequest.transactionId}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Pay</label>
                    <p className="text-sm text-gray-700 mt-1">{selectedRequest.paidAmount}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</label>
                    <p className="text-lg font-bold text-gray-900 mt-1">{selectedRequest.course}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</label>
                    <p className="text-sm text-gray-700 mt-1">{selectedRequest.year}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested Room</label>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">{selectedRequest.appliedRoom}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Request Date</label>
                    <p className="text-sm text-gray-700 mt-1">{new Date(selectedRequest.createdAt).toLocaleDateString('en-GB')}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Status</label>
                    <p className="text-sm text-gray-700 mt-1">{selectedRequest.paymentStatus}</p>
                  </div>
                </div>
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleRequest(selectedRequest.id, 'accept')}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                  >
                    <Check size={20} />
                    Approve Request
                  </button>
                  <button
                    onClick={() => handleRequest(selectedRequest.id, 'reject')}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                  >
                    <X size={20} />
                    Reject Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}