import { useState, useEffect, useCallback } from 'react';
import { Home, FileText, CreditCard, MessageSquare, User, Building2, Calendar, DollarSign, AlertCircle, CheckCircle, Menu } from 'lucide-react';
import './HostelDashboard.css';
import axios from "../../axios"
import DetailsPage from './DetailsPage';

export default function HostelDashboard() {
  const [rooms, setRooms] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [query, setQuery] = useState('');
  const [totalFee, setTotalFee] = useState(12000);







  const Sidebar = () => {
    const [studentInfo, setStudentInfo] = useState({});
    const [isScrolled, setIsScrolled] = useState(false);

    const fetchData = async () => {
      const userstr = localStorage.getItem('user');
      if (!userstr) {
        alert('User not found. Please login again.');
        return;
      }
      const user = JSON.parse(userstr);
      const userId = user.userId || user.id || user._id;
      const res = await axios.get(`user/${userId}/data`);
      if (res.status === 200) {
        setStudentInfo(res.data.user);
      }
    }

    useEffect(() => {
      fetchData();
      
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    return (
      <>
        <button 
          onClick={toggleSidebar} 
          className={`md:hidden w-10 h-10 fixed top-4 left-4 z-50 bg-blue-800 p-2 rounded-lg transition-opacity duration-300 ${
            isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <Menu size={24} className="w-6 h-6" />
        </button>
        <div className={`w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen fixed left-0 top-0 shadow-2xl
    transform transition-transform duration-300 z-40
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
    md:translate-x-0 md:block
    flex flex-col space-y-6`}>
          <div className="p-6 border-b border-blue-700 ">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">{studentInfo.name}</h2>
                <p className="text-xs text-blue-200">Student Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="mt-6">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'details', icon: FileText, label: 'Fill All Details' },
              { id: 'payment', icon: CreditCard, label: 'Payment Details' },
              { id: 'query', icon: MessageSquare, label: 'Query Rise' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-6 py-4 transition-all duration-200 ${activeTab === item.id
                  ? 'bg-blue-700 border-l-4 border-white'
                  : 'hover:bg-blue-800'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </>
    )
  };

  const HomePage = () => {
    const [studentInfo, setStudentInfo] = useState({});
    const fetchData = async () => {
      const userstr = localStorage.getItem('user');
      if (!userstr) {
        alert('User not found. Please login again.');
        return;
      }
      const user = JSON.parse(userstr);
      const userId = user.userId || user.id || user._id;
      const res = await axios.get(`user/${userId}/data`);
      if (res.status === 200) {
        setStudentInfo(res.data.user);
      }
    }

    useEffect(() => {
      fetchData();
    }, [])


    return (
      <div className="flex flex-col space-y-4 md:space-y-6 items-start absolute top-7 left-0 right-0 md:ml-64 p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome Back, {studentInfo.name}!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 border-blue-600">
            <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
              <User className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Personal Information</h2>
            </div>
            <div className="space-y-2 text-sm md:text-base text-gray-600">
              <p><span className="font-semibold">Name:</span> {studentInfo.name}</p>
              <p><span className="font-semibold">Roll No:</span> {studentInfo.rollNo}</p>
              <p><span className="font-semibold">Email:</span> {studentInfo.email}</p>
              <p><span className="font-semibold">Phone:</span> {studentInfo.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 border-green-600">
            <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
              <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Payment Status</h2>
            </div>
            <div className="space-y-2 text-sm md:text-base text-gray-600">
              <p><span className="font-semibold">Total Fee:</span> ₹{studentInfo.totalFee}</p>
              <p><span className="font-semibold">Paid Amount:</span> ₹{studentInfo.paidAmount}</p>
              <p><span className="font-semibold">Remaining:</span> ₹{studentInfo.remainingAmount}</p>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2 md:h-3">
                <div
                  className="bg-green-600 h-2 md:h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(studentInfo.paidAmount / studentInfo.totalFee) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md p-4 md:p-6 w-full md:w-3/4">
          <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <button
              onClick={() => setActiveTab('details')}
              className="bg-white hover:bg-blue-50 text-blue-700 font-semibold py-2 md:py-3 px-3 md:px-4 text-sm md:text-base rounded-lg shadow transition-all duration-200"
            >
              Complete Your Profile
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className="bg-white hover:bg-green-50 text-green-700 font-semibold py-2 md:py-3 px-3 md:px-4 text-sm md:text-base rounded-lg shadow transition-all duration-200"
            >
              Make Payment
            </button>
            <button
              onClick={() => setActiveTab('query')}
              className="bg-white hover:bg-purple-50 text-purple-700 font-semibold py-2 md:py-3 px-3 md:px-4 text-sm md:text-base rounded-lg shadow transition-all duration-200"
            >
              Submit Query
            </button>
          </div>
        </div>

        {/* My Queries Section */}
        {studentInfo.querySubject && (
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 border-purple-600 w-full">
            <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
              <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">My Query</h2>
            </div>

            <div className="space-y-3 md:space-y-4">
              {/* Query Details */}
              <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2 flex-col md:flex-row gap-2">
                  <div className="flex-1">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">{studentInfo.querySubject}</h3>
                    <span className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${studentInfo.queryType === 'Room Related' ? 'bg-blue-100 text-blue-800' :
                      studentInfo.queryType === 'Payment Related' ? 'bg-green-100 text-green-800' :
                        studentInfo.queryType === 'Maintenance Issue' ? 'bg-red-100 text-red-800' :
                          studentInfo.queryType === 'Food & Mess' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                      }`}>
                      {studentInfo.queryType}
                    </span>
                  </div>
                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${studentInfo.queryResponse
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    }`}>
                    {studentInfo.queryResponse ? 'Replied' : 'Pending'}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-700 mt-2">{studentInfo.queryDescription}</p>
              </div>

              {/* Admin Response */}
              {studentInfo.queryResponse ? (
                <div className="bg-green-50 rounded-lg p-3 md:p-4 border-l-4 border-green-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                    <h4 className="text-sm md:text-base font-semibold text-green-900">Admin Response</h4>
                  </div>
                  <p className="text-xs md:text-sm text-green-800">{studentInfo.queryResponse}</p>
                </div>
              ) : (
                <div className="bg-yellow-50 rounded-lg p-3 md:p-4 border-l-4 border-yellow-500">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                    <p className="text-xs md:text-sm text-yellow-800 font-medium">Waiting for admin response...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  };



  const PaymentPage = () => {

    const [totalFee, setTotalFee] = useState(12000);
    const [paymentData, setPaymentData] = useState({
      paidAmount: 0,
    });

    const handleSubmit = async () => {
      try {
        if (!paymentData.paidAmount || paymentData.paidAmount <= 0) {
          alert('Please enter a valid payment amount');
          return;
        }

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

        const paymentPayload = {
          userId: userId,
          paidAmount: Number(paymentData.paidAmount),
          totalFee: totalFee
        };

        const res = await axios.put(`user/${userId}/payment`, paymentPayload);

        alert('Payment submitted successfully!');

      } catch (err) {
        if (err.response) {
          const errorMsg = err.response.data?.message || err.response.data?.error || 'Payment failed';
          alert(`Error: ${errorMsg}`);
        } else if (err.request) {
          alert('Network error. Please check your connection.');
        } else {
          alert('Error submitting payment. Please try again.');
        }
      }
    };

    const remainingAmount = totalFee - paymentData.paidAmount;

    return (
      <div className="space-y-4 md:space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payment Details</h1>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 text-left">Set Your Total Fee</h3>
            <div className="bg-blue-50 rounded-lg p-3 md:p-4">
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2 text-left">Total Fee Amount (₹)</label>
              <input
                type="number"
                value={totalFee}
                onChange={(e) => setTotalFee(Number(e.target.value))}
                className="w-full px-3 md:px-4 py-2 md:py-3 text-black border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base md:text-lg font-semibold"
                placeholder="Enter total fee"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="bg-blue-50 rounded-lg p-4 md:p-6 border-l-4 border-blue-600">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Fee Summary</h3>
              <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Fee:</span>
                  <span className="font-bold text-gray-800">₹{totalFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid Amount:</span>
                  <span className="font-bold text-green-600">₹{paymentData.paidAmount}</span>
                </div>
                <div className="border-t pt-2 md:pt-3 flex justify-between">
                  <span className="text-gray-600 font-semibold">Remaining:</span>
                  <span className="font-bold text-red-600">₹{remainingAmount}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Payment Progress</h3>
              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-gray-800">
                    {totalFee > 0 ? ((paymentData.paidAmount / totalFee) * 100).toFixed(0) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 md:h-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 md:h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-1 md:pr-2"
                    style={{ width: `${totalFee > 0 ? (paymentData.paidAmount / totalFee) * 100 : 0}%` }}
                  >
                    <span className="text-[10px] md:text-xs text-white font-bold">
                      {totalFee > 0 ? ((paymentData.paidAmount / totalFee) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Make Payment</h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Amount to Pay</label>
                <input
                  type="number"
                  className="w-full px-3 md:px-4 text-black py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter amount"
                  max={remainingAmount}
                  value={paymentData.paidAmount}
                  onChange={(e) => setPaymentData({ ...paymentData, paidAmount: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <select className="w-full px-3 md:px-4 text-black py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option>UPI</option>
                  <option>Credit/Debit Card</option>
                  <option>Net Banking</option>
                  <option>Cash</option>
                </select>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 md:py-3 px-4 md:px-6 text-sm md:text-base rounded-lg shadow-lg transition-all duration-200">
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const QueryPage = () => {
    const [query, setQuery] = useState({
      querySubject: '',
      queryType: '',
      queryDescription: ''
    });
    const [studentInfo, setStudentInfo] = useState({});
    const fetchData = async () => {
      const userstr = localStorage.getItem('user');
      if (!userstr) {
        alert('User not found. Please login again.');
        return;
      }
      const user = JSON.parse(userstr);
      const userId = user.userId || user.id || user._id;
      setStudentInfo(user);
    }
    useEffect(() => {
      fetchData();
    }, []);


    const handleQuerySubmit = async (e) => {
      e.preventDefault();
      try {
        const userId = studentInfo.userId || studentInfo.id || studentInfo._id;
        const res = await axios.put('/user/query-rise/' + userId, query);
      } catch (error) {
        console.error("Error submitting query:", error);
      }

      setQuery('');
    };

    const handleChange = (e) => {
      setQuery({
        ...query,
        [e.target.name]: e.target.value
      });
    }





    return (
      <div className="space-y-4 md:space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Submit Query</h1>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 space-y-4 md:space-y-6 text-black text-left">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Query Subject</label>
            <input
              type="text"
              name='querySubject'
              value={query.querySubject}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter subject"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Query Type</label>
            <select className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              name='queryType'
              value={query.queryType}
              onChange={handleChange}
            >
              <option>Room Related</option>
              <option>Payment Related</option>
              <option>Maintenance Issue</option>
              <option>Food & Mess</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Describe Your Query</label>
            <textarea
              name='queryDescription'
              value={query.queryDescription}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32 md:h-40"
              placeholder="Please describe your query in detail..."
            ></textarea>
          </div>

          <button
            onClick={handleQuerySubmit}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 md:py-3 px-4 md:px-6 text-sm md:text-base rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
            <span>Submit Query</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="md:ml-64 p-4 md:p-8">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'details' && <DetailsPage setActiveTab={setActiveTab} />}
        {activeTab === 'payment' && <PaymentPage />}
        {activeTab === 'query' && <QueryPage />}
      </div>
    </div>
  );
}