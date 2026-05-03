import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      
      // 1. Send Login Request
      const response = await axios.post("http://127.0.0.1:5000/api/auth/login", { 
        email: email.toLowerCase(), 
        password 
      });
      
      if (response.status === 200) {
        setSuccess(true);
        
        // 2. STORE THE DATA
        // Store the JWT token for API authorization
        localStorage.setItem('token', response.data.token);
        
        // Store the user object (includes name, email, and role)
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 3. REDIRECT
        // Short delay so the user sees the success message
        setTimeout(() => {
          navigate('/'); 
        }, 1500);
      }
    } catch (err: any) {
      // Handle various error scenarios
      const message = err.response?.data?.message || 'Login failed. Please check your connection.';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-700 to-pink-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Log in to continue your learning journey</p>
        </div>

        {/* Success Feedback */}
        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6 text-center border border-green-200 font-bold animate-pulse">
            Login Successful! Redirecting... 🎓
          </div>
        )}

        {/* Error Feedback */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center border border-red-100 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="smriti@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              className="w-full px-5 py-3 border border-gray-200 rounded-xl text-gray-900 bg-gray-50 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
              className="w-full px-5 py-3 border border-gray-200 rounded-xl text-gray-900 bg-gray-50 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 transform active:scale-95 transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account? {' '}
            <button 
              onClick={() => navigate('/signup')} 
              className="text-purple-600 font-bold hover:underline"
            >
              Create one for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}