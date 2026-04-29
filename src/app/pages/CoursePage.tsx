import { useParams, useNavigate } from "react-router-dom";
import { mockCourses } from "../data/mockData";
import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, Play, CheckCircle, BookOpen, Clock, Star, Award, SkipForward, SkipBack } from "lucide-react";

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // 1. STABLE FINDING LOGIC
  const course = useMemo(() => {
    return mockCourses.find(c => String(c.id).trim() === String(courseId).trim());
  }, [courseId]);

  // 2. VIEW STATE (Landing vs Player)
  const [isLearning, setIsLearning] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const allLessons = useMemo(() => {
    if (!course || !course.curriculum) return [];
    return course.curriculum.flatMap((module: any) => module.lessons);
  }, [course]);

  useEffect(() => {
    setIsLearning(false);
    setCurrentLessonIndex(0);
  }, [courseId]);

  if (!course) return <div className="p-20 text-center text-white bg-[#0f172a] min-h-screen">Course Not Found</div>;

  // --- VIEW A: THE BRIEF INTRODUCTION & CONTENT DISPLAY ---
  if (!isLearning) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-[#0f172a] text-white py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <button onClick={() => navigate('/courses')} className="flex items-center gap-2 text-slate-400 mb-8 hover:text-white transition-colors">
              <ChevronLeft size={20} /> Back to Catalog
            </button>
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl text-slate-300 mb-6 leading-relaxed">{course.description}</p>
                <div className="flex flex-wrap gap-6 mb-8 text-sm text-slate-400">
                  <div className="flex items-center gap-2"><Star className="text-yellow-400" size={18}/> {course.rating} (Rating)</div>
                  <div className="flex items-center gap-2"><Clock size={18}/> {course.duration || "12 Hours"}</div>
                  <div className="flex items-center gap-2"><BookOpen size={18}/> {allLessons.length} Lessons</div>
                </div>
                <button 
                  onClick={() => setIsLearning(true)} 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-purple-900/20 transition-all transform hover:scale-105"
                >
                  <Play fill="white" size={20} /> Start Learning Now
                </button>
              </div>
              <div className="w-full md:w-80 aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800">
                <img src={course.imageUrl} className="w-full h-full object-cover" alt="Course Preview" />
              </div>
            </div>
          </div>
        </div>

        {/* Syllabus Section */}
        <div className="max-w-5xl mx-auto py-16 px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                <CheckCircle className="text-purple-600" /> Course Content
              </h2>
              <div className="space-y-4">
                {course.curriculum.map((module: any, idx: number) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 p-4 font-bold text-slate-700 border-b border-slate-200 flex justify-between">
                      <span>Section {idx + 1}: {module.title}</span>
                      <span className="text-slate-400 font-normal">{module.lessons.length} lessons</span>
                    </div>
                    {module.lessons.map((lesson: any, lIdx: number) => (
                      <div key={lIdx} className="p-4 flex items-center gap-4 text-slate-600 hover:bg-slate-50 transition-colors">
                        <Play size={14} className="text-slate-300" />
                        <span className="text-sm font-medium">{lesson.title}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 h-fit">
              <h3 className="font-bold text-lg mb-4 text-slate-900">Course Includes</h3>
              <ul className="space-y-4 text-slate-600 text-sm">
                <li className="flex gap-3 items-center"><Award size={18} className="text-purple-600" /> Professional Certificate</li>
                <li className="flex gap-3 items-center"><Play size={18} className="text-purple-600" /> Lifetime Access</li>
                <li className="flex gap-3 items-center"><CheckCircle size={18} className="text-purple-600" /> Interactive Quizzes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW B: THE VIDEO PLAYER (Exactly what we built before) ---
  const currentLesson = allLessons[currentLessonIndex];
  return (
    <div className="min-h-screen bg-[#1c1d1f] text-white flex flex-col">
      <div className="h-16 bg-[#2d2f31] border-b border-gray-700 flex items-center justify-between px-6">
        <button onClick={() => setIsLearning(false)} className="flex items-center gap-2 hover:text-purple-400 transition-colors">
          <ChevronLeft size={20} /> <span>Exit Player</span>
        </button>
        <h1 className="font-bold truncate">{course.title}</h1>
        <div className="w-10"></div>
      </div>
      
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="flex-1 bg-black flex flex-col overflow-y-auto">
          <div className="aspect-video w-full">
            <iframe src={currentLesson?.videoUrl} className="w-full h-full" allowFullScreen />
          </div>
          <div className="p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{currentLesson?.title}</h2>
              <div className="flex gap-2">
                <button disabled={currentLessonIndex === 0} onClick={() => setCurrentLessonIndex(p => p - 1)} className="p-3 bg-gray-800 rounded-xl disabled:opacity-20"><SkipBack/></button>
                <button disabled={currentLessonIndex === allLessons.length - 1} onClick={() => setCurrentLessonIndex(p => p + 1)} className="p-3 bg-purple-600 rounded-xl disabled:opacity-20"><SkipForward/></button>
              </div>
            </div>
          </div>
        </div>
        {/* ... (Keep the Sidebar logic from previous response) ... */}
      </div>
    </div>
  );
}