import { useState, useEffect, useCallback } from 'react';
import { Home, FileText, CreditCard, MessageSquare, User, Building2, Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import './HostelDashboard.css';
import axios from "../../axios"

const DetailsPage = ({ setActiveTab }) => {
    const [rooms, setRooms] = useState([]);
    const [selectedHostel, setSelectedHostel] = useState("");
    const availableRooms = rooms.filter(r => r.status === 'empty').length;
    const partialRooms = rooms.filter(r => r.status === 'partially filled').length;
    const fullRooms = rooms.filter(r => r.status === 'full').length;

    let [formData, setFormData] = useState({
        address: '',
        guardianName: '',
        guardianContact: '',
        course: '',
        year: '',
        gender: '',
        appliedRoom: ''
    })
    const [selectedRoom, setSelectedRoom] = useState('');
    const handleRoomSelect = (room) => {
        if (room.status !== 'full') {
            setSelectedRoom(room.roomNumber);
            setFormData(prevData => ({ ...prevData, appliedRoom: room.roomNumber }));
        }
    };
    const fetchRoomAvailability = async () => {
        const res = await axios.get('/user/rooms');
        setRooms(res.data.rooms);
    }
    useEffect(() => {
        fetchRoomAvailability();
    }, []);


    const getRoomColor = (status) => {
        switch (status) {
            case 'empty': return 'bg-green-500 hover:bg-green-600';
            case 'partially filled': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'full': return 'bg-red-500 cursor-not-allowed';
            default: return 'bg-gray-400';
        }
    };

    const getRoomBorderColor = (status) => {
        switch (status) {
            case 'available': return 'border-green-600';
            case 'partial': return 'border-yellow-600';
            case 'full': return 'border-red-600';
            default: return 'border-gray-400';
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const handleFormSubmit = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                alert('User not found. Please login again.');
                return;
            }

            const user = JSON.parse(userStr);
            const userId = user.userId || user.id || user._id;

            if (!userId) {
                alert('User ID not found. Please login again.');
                return;
            }

            if (!formData.address || !formData.guardianName || !formData.guardianContact ||
                !formData.course || !formData.year || !formData.gender || !formData.appliedRoom) {
                alert('Please fill all the required fields before submitting.');
                return;
            }

            if (formData.guardianContact.length < 10) {
                alert('Please enter a valid guardian contact number (at least 10 digits).');
                return;
            }

            const res = await axios.put(`/user/${userId}/details-apply`, formData);

            alert('Details submitted successfully! Your application has been received.');
            setActiveTab('payment');

        } catch (error) {
            if (error.response) {
                const errorMsg = error.response.data?.message || error.response.data?.error || 'Failed to submit details';
                alert(`Error: ${errorMsg}`);
            } else if (error.request) {
                alert('Network error. Please check your connection and try again.');
            } else {
                alert('Error submitting form. Please try again later.');
            }
        }
    };
    const handleHostelChange = (e) => {
        setSelectedHostel(e.target.value);
        setSelectedRoom(null);
    };

    const filteredRooms = selectedHostel
        ? rooms.filter((r) => r.hostelName === selectedHostel)
        : [];




    return (
        <div className="space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Fill All Details</h1>
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                    <div className='text-left'>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Address</label>
                        <input
                            type="text"
                            name='address'

                            value={formData.address}
                            onChange={handleFormChange}
                            className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-left"

                            placeholder="Enter your address"
                        />
                    </div>

                    <div className='text-left'>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Guardian Name</label>
                        <input
                            type="text"
                            name="guardianName"
                            value={formData.guardianName}
                            onChange={handleFormChange}
                            className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-left"
                            placeholder="Enter guardian name"
                        />
                    </div>

                    <div className='text-left'>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Guardian Contact</label>
                        <input
                            type="tel"
                            name="guardianContact"
                            value={formData.guardianContact}
                            onChange={handleFormChange}
                            className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-left"
                            placeholder="Enter contact number"
                        />
                    </div>

                    <div className='text-left'>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Course</label>
                        <select
                            name="course"
                            value={formData.course}
                            onChange={handleFormChange}
                            className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-left"
                        >
                            <option value="">Select Course</option>
                            <option value="B.Tech">B.Tech</option>
                            <option value="M.Tech">M.Tech</option>
                            <option value="BBA">BBA</option>
                            <option value="MCA">MCA</option>
                            <option value="B.Sc">B.Sc</option>
                        </select>
                    </div>

                    <div className='text-left'>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Year</label>
                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleFormChange}
                            className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-left"
                        >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>

                    <div className='text-left'>
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleFormChange}
                            className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-left"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="border-t pt-4 md:pt-6">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        Room Availability Calendar
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                        <div className="bg-green-50 rounded-lg p-3 md:p-4 flex items-center space-x-3 md:space-x-4 border-2 border-green-500">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500"></div>
                            <div>
                                <p className="text-sm md:text-base font-semibold text-gray-800">Available</p>
                                <p className="text-xs md:text-sm text-gray-600">{availableRooms} rooms</p>
                            </div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3 md:p-4 flex items-center space-x-3 md:space-x-4 border-2 border-yellow-500">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-yellow-500"></div>
                            <div>
                                <p className="text-sm md:text-base font-semibold text-gray-800">Partially Full</p>
                                <p className="text-xs md:text-sm text-gray-600">{partialRooms} rooms</p>
                            </div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3 md:p-4 flex items-center space-x-3 md:space-x-4 border-2 border-red-500">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-500"></div>
                            <div>
                                <p className="text-sm md:text-base font-semibold text-gray-800">Full</p>
                                <p className="text-xs md:text-sm text-gray-600">{fullRooms} rooms</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                        <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-3 md:mb-4">Select Your Room (Click on available rooms)</h4>

                        <div>
                            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Select Hostel</label>
                            <select className='text-black w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg'
                                value={selectedHostel}
                                onChange={handleHostelChange}>
                                    <option value="">-- Select Hostel --</option>
                                {[...new Set(rooms.map(r => r.hostelName))].map((hostel, index) => (
                                    <option key={index} value={hostel}>
                                        {hostel}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3 mt-4 md:mt-5">
                            {filteredRooms.map((room) => (
                                <button
                                    key={room.roomNumber}
                                    onClick={() => handleRoomSelect(room)}
                                    disabled={room.status === 'full'}
                                    className={`${getRoomColor(room.status)} ${selectedRoom === room.roomNumber ? `ring-4 ring-blue-400 ${getRoomBorderColor(room.status)}` : ''
                                        } text-white font-bold py-2 md:py-3 px-1 md:px-2 rounded-lg transition-all duration-200 text-xs md:text-sm border-2 ${getRoomBorderColor(room.status)}`}
                                >
                                    {room.roomNumber}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 md:mt-6 text-left">
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Selected Room</label>
                        <input
                            type="text"
                            name="appliedRoom"
                            value={formData.appliedRoom}
                            onChange={handleFormChange}
                            className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 text-black text-left"
                            placeholder="Select a room from calendar above"
                            readOnly
                        />
                    </div>
                </div>

                <button
                    onClick={handleFormSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 md:py-3 px-4 md:px-6 text-sm md:text-base rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Submit Details</span>
                </button>
            </div>

        </div>
    );
};

export default DetailsPage;