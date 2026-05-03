import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { Play, CheckSquare, ArrowLeft, Award, Loader2 } from 'lucide-react';
import QuizArea from '../components/QuizArea';

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. STATE MANAGEMENT FOR REAL DATA
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');
  const [isCompleted, setIsCompleted] = useState(false);

  // 2. FETCH DATA FROM YOUR BACKEND
  useEffect(() => {
  const fetchCourseData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
      console.log("SUCCESS! Data from MongoDB:", response.data); // <--- Add this!
      setCourse(response.data);
    } catch (err) {
      console.error("BACKEND ERROR:", err); // <--- This will tell you why it's failing
    } finally {
      setLoading(false);
    }
  };
  fetchCourseData();
}, [id]);
  // 3. PERSIST PROGRESS TO DATABASE
  const handlePass = async () => {
    setIsCompleted(true);
    
    try {
      const token = localStorage.getItem('token');
      // Update the user's progress in MongoDB
      await axios.patch(`http://localhost:5000/api/users/progress`, 
        { courseId: id, progress: 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to update database progress:", error);
    }
  };

  // 4. LOADING & ERROR STATES
  if (loading) return (
    <div className="min-h-screen bg-[#1c1d1f] flex flex-col items-center justify-center text-white">
      <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
      <p className="animate-pulse tracking-widest text-sm font-bold">LOADING CONTENT</p>
    </div>
  );

  if (!course) return <div className="p-20 text-center text-white">Course Not Found</div>;

  return (
    <div className="min-h-screen bg-[#1c1d1f] text-white flex flex-col">
      
      {/* TOP NAVIGATION BAR */}
      <div className="h-16 bg-[#2d2f31] border-b border-gray-700 flex items-center justify-between px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 hover:text-purple-400">
          <ArrowLeft className="w-5 h-5" /> <span>Back</span>
        </button>
        <h1 className="font-bold truncate max-w-md hidden md:block">{course.title}</h1>
        
        {isCompleted && (
          <div className="bg-green-600 px-3 py-1 rounded text-sm font-bold flex items-center gap-2 animate-bounce">
            <Award className="w-4 h-4" /> Course Completed!
          </div> 
        )}
      </div>

      {/* DYNAMIC PROGRESS BAR */}
      <div className="w-full bg-[#2d2f31] border-b border-gray-800 px-6 py-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Your Progress</span>
          <span className="text-xs font-bold text-purple-400">{isCompleted ? '100%' : '0%'}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-purple-500 h-full transition-all duration-1000 ease-out" 
            style={{ width: isCompleted ? '100%' : '0%' }}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* MAIN PLAYER AREA */}
        <div className="flex-1 bg-black flex flex-col">
          <div className="aspect-video w-full bg-slate-900">
            {/* Using course.videoUrl from Database */}
            <iframe
              className="w-full h-full"
              src={course.videoUrl}
              title="Course Content"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">About this Lesson</h2>
            <p className="text-gray-400 leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* SIDEBAR: CURRICULUM & QUIZ */}
        <div className="w-full lg:w-96 bg-[#2d2f31] border-l border-gray-700 flex flex-col">
          <div className="flex border-b border-gray-700">
            <button 
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-4 font-bold ${activeTab === 'content' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400'}`}
            >
              Content
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-4 font-bold ${activeTab === 'quiz' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400'}`}
            >
              Quiz
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'content' ? (
              <div className="p-4 space-y-6">
                {course.curriculum?.map((module: any, mIdx: number) => (
                  <div key={mIdx}>
                    <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                      Section {mIdx + 1}: {module.title}
                    </h3>
                    <div className="space-y-1">
                      {module.lessons?.map((lesson: any, lIdx: number) => (
                        <div key={lIdx} className="flex items-center gap-3 p-3 hover:bg-[#3e4143] cursor-pointer rounded-lg group">
                          <Play className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
                          <span className="text-sm text-gray-300 group-hover:text-white">{lesson.title}</span>
                          <span className="ml-auto text-[10px] text-gray-500">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CheckSquare className="text-purple-400 w-5 h-5" />
                  <h3 className="font-bold text-lg">Certification Quiz</h3>
                </div>
                
                {/* Real Quiz Data from MongoDB */}
                <QuizArea 
                  quizData={course.quiz || []} 
                  onPass={handlePass} 
                  courseTitle={course.title} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}