import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Mail, Lock, User, Phone } from 'lucide-react';

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ENGINEER', // defaults to ENGINEER
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all mandatory fields.');
      return false;
    }
    if (isRegister) {
      if (!formData.name) {
        setError('Name is required.');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.role,
          formData.phoneNumber
        );
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main glass panel container */}
      <div className="w-full max-w-lg glass-panel rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">
        
        {/* Logo/Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 mb-4 animate-pulse-soft">
            <Wrench className="h-8 w-8 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">SteelCare</h2>
          <p className="text-sm text-gray-400 mt-1">Preventive Maintenance Management System</p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-800 mb-6">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 pb-3 text-center text-sm font-semibold border-b-2 transition ${!isRegister ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 pb-3 text-center text-sm font-semibold border-b-2 transition ${isRegister ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Register
          </button>
        </div>

        {/* Error Messaging */}
        {error && (
          <div className="mb-5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@steelcare.com"
                className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm"
                required
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">System Role</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'ENGINEER' })}
                    className={`
                      py-2.5 rounded-xl border text-xs font-semibold transition uppercase tracking-wider text-center
                      ${formData.role === 'ENGINEER'
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-600/5'
                        : 'border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-700'}
                    `}
                  >
                    Engineer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'EMPLOYEE' })}
                    className={`
                      py-2.5 rounded-xl border text-xs font-semibold transition uppercase tracking-wider text-center
                      ${formData.role === 'EMPLOYEE'
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-600/5'
                        : 'border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-700'}
                    `}
                  >
                    Employee
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition duration-150 flex items-center justify-center text-sm disabled:opacity-50"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
