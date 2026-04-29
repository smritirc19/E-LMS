import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pw: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(pw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Frontend Validation
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      setError('');
      
      // 2. THE HANDSHAKE
      // We send the specific state variables as an object. 
      // Using 127.0.0.1 fixes the "Connection Refused" issue on many Windows setups.
      const response = await axios.post("http://127.0.0.1:5000/api/auth/register", {
        name,
        email,
        password
      });

      // 3. Handle Success
      if (response.status === 201) {
        setSuccess(true);
        // Clear fields after success
        setName('');
        setEmail('');
        setPassword('');
        
        setTimeout(() => {
          setSuccess(false);
          // 🚀 Move to Login page so the user can test their new account!
          navigate('/'); 
        }, 2000);
      }
    } catch (err: any) {
      // 4. Handle Server Errors (e.g., User already exists)
      setError(err.response?.data?.message || 'Registration failed. Check if your backend is running!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-blue-500 to-purple-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create Your Account</h2>
        
        {success && (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-6 text-center border border-green-200 font-medium animate-pulse">
            Signup Successful! Welcome to LMS. ✨
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-6 text-center border border-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Smriti R"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="smriti@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-gray-50"
            />
            <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
              * Must include 8+ chars, Uppercase, Lowercase, Number, and Special Symbol.
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 active:scale-95 transition-all shadow-md mt-4"
          >
            Create My Account
          </button>
        </form>
        
        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account? <span onClick={() => navigate('/login')} className="text-purple-600 font-bold cursor-pointer hover:underline">Log In</span>
        </p>
      </div>
    </div>
  );
}