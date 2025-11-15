import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Search, Phone, Mail, Calendar, MapPin, Users, Shield, AlertCircle, CheckCircle, X, Eye, Filter, Download,Check } from 'lucide-react';
import axios from '../axios'

export default function StaffManagement() {
  // const [staffList, setStaffList] = useState([

  //   {
  //     id: 2,
  //     name: 'Ms. Priya Sharma',
  //     role: 'Co-Warden',
  //     hostelName: 'Ambedkar Hostel',
  //     phone: '+91-9876543211',
  //     email: 'priya.sharma@hostel.edu',
  //     joinDate: '2021-08-20',
  //     salary: 38000,
  //     address: 'Staff Quarters, Block B',
  //     status: 'active',
  //     experience: '3 years'
  //   },
  //   {
  //     id: 3,
  //     name: 'Mr. Amit Patel',
  //     role: 'Security Guard',
  //     hostelName: 'Gandhi Hostel',
  //     phone: '+91-9876543212',
  //     email: 'amit.patel@hostel.edu',
  //     joinDate: '2019-03-10',
  //     salary: 25000,
  //     address: 'Security Quarters',
  //     status: 'active',
  //     experience: '6 years'
  //   },
  //   {
  //     id: 4,
  //     name: 'Mrs. Sunita Devi',
  //     role: 'Housekeeper',
  //     hostelName: 'Ambedkar Hostel',
  //     phone: '+91-9876543213',
  //     email: 'sunita.devi@hostel.edu',
  //     joinDate: '2022-01-05',
  //     salary: 20000,
  //     address: 'Staff Quarters, Block C',
  //     status: 'active',
  //     experience: '2 years'
  //   },
  //   {
  //     id: 5,
  //     name: 'Mr. Vikram Singh',
  //     role: 'Maintenance Staff',
  //     hostelName: 'Gandhi Hostel',
  //     phone: '+91-9876543214',
  //     email: 'vikram.singh@hostel.edu',
  //     joinDate: '2020-11-22',
  //     salary: 28000,
  //     address: 'Maintenance Block',
  //     status: 'active',
  //     experience: '4 years'
  //   }
  // ]);


  const [staffList, setStaffList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Warden',
    hostelName: '',
    phone: '',
    email: '',
    joinDate: '',
    salary: '',
    address: '',
    status: 'active',
    experience: ''
  });
  useEffect(() => {
    fetchData();
  }, []);

  const roles = ['Warden', 'Co-Warden', 'Security Guard', 'Housekeeper', 'Maintenance Staff', 'Mess Manager', 'Accountant'];
  const statusTypes = ['active', 'on-leave', 'inactive'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const fetchData = async () => {
    try {
      const response = await axios.get('/admin/get-staff');
      setStaffList(response.data.staff);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();


    // Update existing staff
    try {
      if (editingStaff) {
        const updateStaff = await axios.put(`/admin/update-staff/${editingStaff._id}`, formData);
        setStaffList(prevList => prevList.map(staff => staff._id === editingStaff._id ? updateStaff.data : staff));
        showNotification('Staff updated successfully!');
        fetchData();
      }
      else {
        const createStaff = await axios.post('/admin/add-staff', formData);
        showNotification('Staff added successfully!');
        fetchData();
      }

    } catch (error) {
      console.error('Error submitting staff data:', error);
      alert('Error: ' + (error.response?.data?.message || 'Failed to save staff data'));
    }

    setShowForm(false);
    setEditingStaff(null);
    setFormData({
      name: '',
      role: 'Warden',
      hostelName: '',
      phone: '',
      email: '',
      joinDate: '',
      salary: '',
      address: '',
      status: 'active',
      experience: ''
    });
  };

  const handleEdit = (staff) => {
    console.log('Editing staff:', staff);
    setEditingStaff(staff);
    setFormData(staff);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        await axios.delete(`/admin/delete-staff/${id}`);
        showNotification('Staff removed successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting staff:', error);
        showNotification('Error: ' + (error.response?.data?.message || 'Failed to delete staff'), 'error');
      }
    }
  };

  const viewDetails = (staff) => {
    setSelectedStaff(staff);
    setShowDetails(true);
  };

  const filteredStaff = staffList?.filter(staff => {
    const matchesSearch =
      (staff?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff?.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff?.hostelName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff?.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || staff?.role === filterRole;
    const matchesStatus = filterStatus === 'all' || staff?.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  // Statistics
  const totalStaff = staffList?.length || 0;
  const activeStaff = staffList?.filter(s => s?.status === 'active').length || 0;
  const onLeaveStaff = staffList?.filter(s => s?.status === 'on-leave').length || 0;
  const totalSalary = staffList?.filter(s => s?.status === 'active').reduce((sum, s) => sum + Number(s?.salary || 0), 0) || 0;

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Warden': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Co-Warden': return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'Security Guard': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Housekeeper': return 'bg-pink-100 text-pink-700 border-pink-300';
      case 'Maintenance Staff': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Mess Manager': return 'bg-green-100 text-green-700 border-green-300';
      case 'Accountant': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-300';
      case 'on-leave': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'inactive': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' or 'error'

  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingStaff(null);
            setFormData({
              name: '',
              role: 'Warden',
              hostelName: '',
              phone: '',
              email: '',
              joinDate: '',
              salary: '',
              address: '',
              status: 'active',
              experience: ''
            });
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 md:px-6 py-3 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-medium"
        >
          <UserPlus size={20} />
          Add New Staff
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-blue-600" size={28} />
            <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full font-semibold">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{totalStaff}</h3>
          <p className="text-sm text-gray-600 mt-1">Total Staff Members</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="text-green-600" size={28} />
            <span className="text-xs bg-gradient-to-r from-amber-200 to-amber-200 text-green-700 px-2 py-1 rounded-full font-semibold">Active</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{activeStaff}</h3>
          <p className="text-sm text-gray-600 mt-1">Currently Working</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="text-yellow-600" size={28} />
            <span className="text-xs bg-yellow-200 text-yellow-700 px-2 py-1 rounded-full font-semibold">Leave</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{onLeaveStaff}</h3>
          <p className="text-sm text-gray-600 mt-1">On Leave</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Shield className="text-purple-600" size={28} />
            <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full font-semibold">Monthly</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">₹{totalSalary.toLocaleString()}</h3>
          <p className="text-sm text-gray-600 mt-1">Total Salary</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, role, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
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
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {editingStaff ? '✏️ Edit Staff Member' : '➕ Add New Staff Member'}
            </h3>
            <button onClick={() => { setShowForm(false); setEditingStaff(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Mr. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hostel Name *</label>
              <input
                type="text"
                name="hostelName"
                value={formData.hostelName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Ambedkar Hostel"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="+91-9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Join Date *</label>
              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Salary (₹) *</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="25000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 5 years"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Staff Quarters, Block A"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                {editingStaff ? 'Update Staff' : 'Add Staff'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingStaff(null); }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Staff Members ({filteredStaff.length})
            </h3>
            <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hostel</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">

              {/* filtered or unfiltered staff list */}
              {filteredStaff.map((staff) => (
                <tr key={staff._id || staff.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-sm">{staff?.name?.charAt(0) || '?'}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{staff?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{staff?.experience || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getRoleBadgeColor(staff?.role)}`}>
                      {staff?.role || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="font-medium">{staff?.hostelName || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        {staff?.phone || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        {staff?.email || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">₹{Number(staff?.salary || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">per month</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusBadgeColor(staff?.status)}`}>
                      {staff?.status ? (staff.status.charAt(0).toUpperCase() + staff.status.slice(1)) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewDetails(staff)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(staff)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(staff._id || staff.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg font-medium">No staff members found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Staff Details Modal */}
      {showDetails && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Staff Details</h3>
                <button onClick={() => setShowDetails(false)} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-3xl">{selectedStaff.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedStaff.name}</h4>
                  <span className={`inline-block mt-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${getRoleBadgeColor(selectedStaff.role)}`}>
                    {selectedStaff.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin size={18} />
                    <span className="text-sm font-semibold">Hostel</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedStaff.hostelName}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Phone size={18} />
                    <span className="text-sm font-semibold">Phone</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedStaff.phone}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Mail size={18} />
                    <span className="text-sm font-semibold">Email</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 break-all">{selectedStaff.email}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar size={18} />
                    <span className="text-sm font-semibold">Join Date</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{new Date(selectedStaff.joinDate).toLocaleDateString()}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Shield size={18} />
                    <span className="text-sm font-semibold">Salary</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">₹{Number(selectedStaff.salary).toLocaleString()}/month</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <CheckCircle size={18} />
                    <span className="text-sm font-semibold">Status</span>
                  </div>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusBadgeColor(selectedStaff.status)}`}>
                    {selectedStaff.status.charAt(0).toUpperCase() + selectedStaff.status.slice(1)}
                  </span>
                </div>

                <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin size={18} />
                    <span className="text-sm font-semibold">Address</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedStaff.address}</p>
                </div>

                <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Users size={18} />
                    <span className="text-sm font-semibold">Experience</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedStaff.experience}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


