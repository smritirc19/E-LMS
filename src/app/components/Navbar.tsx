import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut, Menu } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  
  // Check if user is logged in to show Profile vs Login
  const savedUser = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-purple-600 p-1.5 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-indigo-800 bg-clip-text text-transparent">
              LearnHub
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-purple-700 font-medium transition-colors">
              Home
            </Link>
            <Link to="/courses" className="text-gray-600 hover:text-purple-700 font-medium transition-colors">
              Courses
            </Link>
            
            {savedUser ? (
              <div className="flex items-center gap-6 border-l pl-6 ml-2">
                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-purple-700 transition-all">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">
                    {savedUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">Profile</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-purple-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-md shadow-purple-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden text-gray-600">
            <Menu className="w-6 h-6" />
          </div>
        </div>
      </div>
    </nav>
  );
}