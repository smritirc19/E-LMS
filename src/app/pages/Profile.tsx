import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, Award, LogOut, CheckCircle, 
  ExternalLink, Mail, Calendar, User as UserIcon,
  PlusCircle, ShieldCheck, Fingerprint
} from 'lucide-react';
import InstructorMode from './InstructorMode';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [showInstructor, setShowInstructor] = useState(false);
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
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return null;

  const enrolled = user.enrolledCourses || [];
  const completedCount = enrolled.filter((c: any) => 
    c.status?.toLowerCase() === 'completed' || c.progress === 100
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 1. HEADER HERO */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 h-80 flex items-end">
        <div className="max-w-6xl mx-auto w-full px-6 pb-12 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-32 h-32 bg-white text-purple-800 rounded-3xl flex items-center justify-center text-5xl font-black shadow-2xl border-4 border-purple-400 transform -rotate-3">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-white text-center md:text-left mb-2">
            <h1 className="text-4xl font-black tracking-tight mb-1">{user.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-purple-100 opacity-90">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                <ShieldCheck size={14}/> {user.role?.toUpperCase() || 'STUDENT'}
              </span>
              <span className="flex items-center gap-1.5 text-sm"><Calendar size={16}/> Joined April 2026</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 2. SIDEBAR (USER DETAILS & ACTIONS) */}
        <div className="space-y-6">
          
          {/* USER DATA CARD */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Fingerprint size={80} />
            </div>
            
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserIcon className="text-purple-600" size={20} /> Account Information
            </h3>
            
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-xs">Full Name</p>
                <p className="font-bold text-gray-800 text-lg">{user.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-xs">Email Address</p>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Mail size={14} className="text-purple-400" />
                  <span>{user.email}</span>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-xs">Account Role</p>
                {/* DYNAMIC ROLE BADGE */}
                <span className="inline-block bg-purple-50 text-purple-700 px-4 py-1.5 rounded-xl text-xs font-black border border-purple-100 uppercase tracking-wider">
                  {user.role || 'Student'}
                </span>
              </div>
            </div>

            <hr className="my-8 border-gray-100" />

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                <p className="text-purple-600 font-black text-2xl">{enrolled.length}</p>
                <p className="text-purple-700 text-[10px] font-bold uppercase">Courses</p>
              </div>
              <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                <p className="text-green-600 font-black text-2xl">{completedCount}</p>
                <p className="text-green-700 text-[10px] font-bold uppercase">Finished</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full mt-8 flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 py-4 rounded-2xl transition-all border border-red-50"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          {/* INSTRUCTOR PANEL (Conditional) */}
          {user.role === 'instructor' && (
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-[2rem] text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-2 rounded-xl">
                  <PlusCircle size={24} />
                </div>
                <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full uppercase tracking-tighter">Instructor Access</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Creator Hub</h3>
              <p className="text-indigo-100 text-xs mb-4 opacity-80">Publish new content for your students.</p>
              <button 
                onClick={() => setShowInstructor(true)}
                className="w-full bg-white text-indigo-600 font-black py-3 rounded-xl hover:shadow-lg transition-all active:scale-95"
              >
                Launch Creator Tool
              </button>
            </div>
          )}
        </div>

        {/* 3. MAIN CONTENT: ENROLLMENTS */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900">Your Learning Journey</h2>
          </div>
          
          <div className="grid gap-6">
            {enrolled.length > 0 ? (
              enrolled.map((course: any, index: number) => {
                const courseIdToOpen = course.courseId?._id || course.courseId;
                const isCompleted = course.status?.toLowerCase() === 'completed' || course.progress === 100;

                return (
                  <div key={courseIdToOpen || index} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl ${isCompleted ? 'bg-green-100' : 'bg-purple-100'}`}>
                          {isCompleted ? <Award className="text-green-600 w-7 h-7" /> : <BookOpen className="text-purple-600 w-7 h-7" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">
                            {course.courseId?.title || course.title || "Untitled Course"}
                          </h4>
                          <div className="flex items-center gap-4 mt-2">
                             <div className="flex items-center gap-2">
                               <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                                  <div className={`h-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-purple-500'}`} style={{ width: `${course.progress || 0}%` }} />
                               </div>
                               <span className="text-[10px] text-gray-400 font-black">{course.progress || 0}%</span>
                             </div>
                             {isCompleted && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-bold uppercase">Passed</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Link 
                          to={`/course/${courseIdToOpen}`} 
                          className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-purple-600 transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
                        >
                          Continue Learning <ExternalLink size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-gray-200 text-center">
                <div className="bg-purple-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                   <BookOpen size={40} className="text-purple-200" />
                </div>
                <h3 className="text-gray-900 font-black text-xl mb-2">No Active Courses</h3>
                <p className="text-gray-400 font-medium mb-8 max-w-xs mx-auto">Explore our high-quality courses and start building your skills today.</p>
                <Link 
                  to="/courses" 
                  className="bg-purple-600 text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-purple-200 hover:bg-purple-700 hover:scale-105 transition-all inline-block"
                >
                  Browse Catalog
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {showInstructor && <InstructorMode onClose={() => setShowInstructor(false)} />}
    </div>
  );
}