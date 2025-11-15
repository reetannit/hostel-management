import { useState} from 'react';
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../axios';

export default function SignupPage() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/register', input);
            console.log('Signup successful:', res.data);
        }
        catch (err) { }
        if (!agreeTerms) {
            alert('Please agree to the terms and conditions');
            return;
        }
        console.log('Signup submitted:', { name: input.name, email: input.email, password: input.password, phone: input.phone });
        alert(`Signup attempt with name: ${input.name} and email: ${input.email}`);
        navigate("/login");
    };

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-[calc(100vh-70px)] w-full bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center px-4 py-8 overflow-x-hidden">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-[95%] sm:max-w-md mx-auto p-6 sm:p-8">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-purple-600 rounded-full mb-3 sm:mb-4">
                        <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Join us today and get started
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Name Field */}
                    <div className="w-full">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            Full Name
                        </label>
                        <div className="relative w-full">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={input.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-sm outline-none transition-all text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="w-full">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            Email Address
                        </label>
                        <div className="relative w-full">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={input.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-sm outline-none transition-all text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            Phone Number
                        </label>
                        <div className="relative w-full">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={input.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-sm outline-none transition-all text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="w-full">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            Password
                        </label>
                        <div className="relative w-full">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={input.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg text-sm outline-none transition-all text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Create a password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-2 w-full">
                        <input
                            id="terms"
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="w-4 h-4 mt-0.5 cursor-pointer text-purple-600 border-gray-300 rounded focus:ring-purple-500 flex-shrink-0"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700 text-left leading-relaxed">
                            I agree to the{' '}
                            <button type="button" className="text-purple-600 underline hover:text-purple-700">
                                Terms and Conditions
                            </button>
                            {' '}and{' '}
                            <button type="button" className="text-purple-600 underline hover:text-purple-700">
                                Privacy Policy
                            </button>
                        </label>
                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-base transition-all hover:bg-purple-700 focus:ring-4 focus:ring-purple-200"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-700">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
