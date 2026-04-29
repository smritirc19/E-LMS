import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, Award, Clock, LogOut, CheckCircle, 
  ExternalLink, Mail, Calendar, User as UserIcon 
} from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const enrolled = user.enrolledCourses || [];
  const completedCount = enrolled.filter((c: any) => 
    c.status?.toLowerCase() === 'completed' || c.progress === 100
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 1. HEADER: User Identity */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 h-80 flex items-end">
        <div className="max-w-6xl mx-auto w-full px-6 pb-12 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-32 h-32 bg-white text-purple-800 rounded-3xl flex items-center justify-center text-5xl font-black shadow-2xl border-4 border-purple-400 transform -rotate-3">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-white text-center md:text-left mb-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
               <h1 className="text-4xl font-black tracking-tight">{user.name}</h1>
               <span className="bg-purple-500/30 border border-purple-400/50 px-3 py-1 rounded-full text-xs font-bold uppercase">Student</span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-purple-100 opacity-90">
              <span className="flex items-center gap-1.5"><Mail size={16}/> {user.email}</span>
              <span className="flex items-center gap-1.5"><Calendar size={16}/> Joined April 2026</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 2. SIDEBAR: Details & Stats */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserIcon className="text-purple-600" size={20} /> User Profile
            </h3>
            
            <div className="space-y-4 mb-8">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                <p className="font-semibold text-gray-800">{user.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                <p className="font-semibold text-gray-800">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Account Type</p>
                <p className="font-semibold text-gray-800">Premium Learner</p>
              </div>
            </div>

            <hr className="border-gray-50 mb-6" />

            <h3 className="font-bold text-gray-900 mb-4">Learning Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-2xl">
                <p className="text-purple-600 font-black text-2xl">{enrolled.length}</p>
                <p className="text-purple-700 text-xs font-bold">Courses</p>
              </div>
              <div className="bg-green-50 p-4 rounded-2xl">
                <p className="text-green-600 font-black text-2xl">{completedCount}</p>
                <p className="text-green-700 text-xs font-bold">Certificates</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full mt-10 flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 py-3 rounded-xl transition-all border border-red-50"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* 3. MAIN CONTENT: Courses */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black text-gray-900 mb-8">Current Enrollments</h2>
          
          <div className="grid gap-6">
            {enrolled.length > 0 ? (
              enrolled.map((course: any) => {
                // FIXED: Scoped variables inside the map
                const courseIdToOpen = course.courseId?._id || course.courseId;
                const isCompleted = course.status?.toLowerCase() === 'completed' || course.progress === 100;

                // CRITICAL: Explicit return for the map function
                return (
                  <div key={courseIdToOpen} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    {isCompleted && (
                      <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
                    )}
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl ${isCompleted ? 'bg-green-100' : 'bg-purple-100'}`}>
                          {isCompleted ? <Award className="text-green-600 w-7 h-7" /> : <BookOpen className="text-purple-600 w-7 h-7" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">
                            {course.courseId?.title || "Untitled Course"}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {isCompleted ? 'Completed' : 'In Progress'}
                            </span>
                            <span className="text-sm text-gray-400 font-medium">
                              Progress: {course.progress || 0}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {isCompleted && (
                          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                            <CheckCircle size={16} /> Certificate
                          </button>
                        )}
                        
                        <Link 
          to={`/course/${courseIdToOpen}`} 
          className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-600 transition-all flex items-center gap-2"
        >
          View Course <ExternalLink size={14} />
        
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-gray-200 text-center">
                <p className="text-gray-400 font-bold text-lg mb-6">No active courses found.</p>
                <Link to="/" className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all">
                  Start Learning Today
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}