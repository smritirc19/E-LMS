import { Link, useNavigate } from 'react-router-dom';
import { mockCourses, mockUser } from '../data/mockData';
import { PlayCircle, Award, CheckCircle, TrendingUp } from 'lucide-react';

export default function MyCourses() {
  const navigate = useNavigate();

  const enrolledCoursesData = (mockUser?.enrolledCourses || [])
    .map((enrolled) => {
      const course = mockCourses.find(
        (c) => String(c.id) === String(enrolled.courseId)
      );
      if (!course) return null;
      return { ...enrolled, course };
    })
    .filter((item): item is any => item !== null);

  const inProgressCourses = enrolledCoursesData.filter(ec => ec.progress < 100);
  const completedCourses = enrolledCoursesData.filter(ec => ec.progress === 100);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">My Learning</h1>
          <p className="text-purple-100">Welcome back, {mockUser.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<PlayCircle className="text-purple-600" />} count={enrolledCoursesData.length} label="Enrolled" />
          <StatCard icon={<TrendingUp className="text-blue-600" />} count={inProgressCourses.length} label="In Progress" />
          <StatCard icon={<CheckCircle className="text-green-600" />} count={completedCourses.length} label="Completed" />
          <StatCard icon={<Award className="text-amber-500" />} count={completedCourses.length} label="Certificates" />
        </div>

        {/* 1. IN PROGRESS SECTION */}
        {inProgressCourses.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Currently Studying</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {inProgressCourses.map(({ course, progress }) => (
                <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Image Fix: Ensure course.imageUrl exists */}
                  <img 
                    src={course.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'} 
                    alt={course.title} 
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-1 leading-tight">{course.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{course.instructor}</p>
                    <div className="w-full bg-gray-100 h-2 rounded-full mb-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mb-4">{progress}% Complete</p>
                    <button 
                      onClick={() => navigate(`/course-page/${course.id}`)}
                      className="w-full bg-purple-600 text-white py-2.5 rounded-xl font-bold hover:bg-purple-700 transition-all"
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. COMPLETED SECTION (Golden Button Update) */}
        {completedCourses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Completed & Certified</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedCourses.map(({ course }) => (
                <div key={course.id} className="bg-white rounded-2xl shadow-sm border-2 border-amber-100 p-6 relative">
                  <div className="bg-amber-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Award className="text-amber-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-6">Mastered under {course.instructor}</p>
                  
                  {/* THE GOLDEN BUTTON */}
                  <button 
                    onClick={() => navigate(`/certificate/${course.id}`)}
                    className="w-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-yellow-200/50 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Award size={18} className="animate-pulse" />
                    Claim Certificate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, count, label }: { icon: React.ReactNode, count: number, label: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-gray-100">
      <div className="bg-gray-50 p-3 rounded-xl">{icon}</div>
      <div>
        <div className="text-2xl font-bold">{count}</div>
        <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}