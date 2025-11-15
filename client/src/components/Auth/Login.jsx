import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Link ,useNavigate} from 'react-router-dom';

import axios from '../../axios';

export default function LoginPage() {
  const navigate=useNavigate();
  const [input,setInput]=useState({
    email:"",
    password:""
  })
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res=await axios.post('/auth/login',input);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate("/dashboard/" + res.data.userId);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  };
  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  } 

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', width: '100%' }} className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8 overflow-x-hidden">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-[95%] sm:max-w-md mx-auto" style={{ padding: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '3.5rem', 
            height: '3.5rem', 
            backgroundColor: '#4f46e5', 
            borderRadius: '50%', 
            marginBottom: '1rem' 
          }}>
            <Lock style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} />
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: '#6b7280', fontSize: 'clamp(0.875rem, 3vw, 1rem)' }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ width: '100%' }}>
            <label htmlFor="email" style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem',
              textAlign: 'left'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <Mail style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '1.25rem', 
                height: '1.25rem', 
                color: '#9ca3af' 
              }} />
              <input
                id="email"
                name="email"
                type="email"
                value={input.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  color: '#000'
                }}
                className="focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem',
              textAlign: 'left'
            }}>
              Password
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <Lock style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '1.25rem', 
                height: '1.25rem', 
                color: '#9ca3af' 
              }} />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={input.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  paddingLeft: '2.5rem',
                  paddingRight: '3rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  color: '#000'
                }}
                className="focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? <EyeOff style={{ width: '1.25rem', height: '1.25rem' }} /> : <Eye style={{ width: '1.25rem', height: '1.25rem' }} />}
              </button>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
            alignItems: window.innerWidth < 640 ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            width: '100%'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '1rem',
                  height: '1rem',
                  cursor: 'pointer'
                }}
                className="text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="remember" style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                Remember me
              </label>
            </div>
            <button type="button" style={{ 
              fontSize: '0.875rem', 
              color: '#4f46e5', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              textAlign: 'left'
            }}>
              Forgot password?
            </button>
          </div>

          <button
            style={{
              width: '100%',
              backgroundColor: '#4f46e5',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
            className="hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200"
          >
            Sign In
          </button>
        </div>

        </form>

       

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Don't have an account?{' '}
            <button style={{ 
              color: '#4f46e5', 
              fontWeight: '600', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer' 
            }}>
                <Link to="/signup">
                  Sign up
                </Link>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}