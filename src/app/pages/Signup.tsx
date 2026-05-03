import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); 
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pw: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(pw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // DEBUG: Check what the role is right now
    console.log("Current role state before sending:", role);

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      setError('');
      
      // We wrap the data in a clear object to avoid any state delay issues
      const registrationPayload = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        role: role.toLowerCase() // Forces 'instructor' or 'student'
      };

      console.log("Payload being sent to backend:", registrationPayload);

      const response = await axios.post("http://127.0.0.1:5000/api/auth/register", registrationPayload);

      if (response.status === 201) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPassword('');
        
        setTimeout(() => {
          setSuccess(false);
          navigate('/login'); 
        }, 2000);
      }
    } catch (err: any) {
      console.error("Signup error details:", err.response?.data);
      setError(err.response?.data?.message || 'Registration failed.');
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
              type="text" value={name} onChange={e => setName(e.target.value)} required
              placeholder="Smriti R"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">Email Address</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="smriti@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-semibold text-sm">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-sm text-center">Register as:</label>
            <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200">
              <button
                type="button" // Important: Keeps it from submitting the form too early
                onClick={() => {
                   console.log("Setting role to student");
                   setRole('student');
                }}
                className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-all ${role === 'student' ? 'bg-white shadow-md text-purple-600' : 'text-gray-400'}`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => {
                   console.log("Setting role to instructor");
                   setRole('instructor');
                }}
                className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-all ${role === 'instructor' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400'}`}
              >
                Instructor
              </button>
            </div>
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