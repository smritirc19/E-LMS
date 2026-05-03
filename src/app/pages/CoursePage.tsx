import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import axios from 'axios';
import { 
  ChevronLeft, Play, CheckCircle, BookOpen, Clock, 
  Star, Award, SkipForward, SkipBack, ClipboardCheck 
} from "lucide-react";
import QuizArea from '../components/QuizArea'; 

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // --- 1. USER SESSION (Pulls from your Login.tsx localStorage) ---
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // --- STATES ---
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLearning, setIsLearning] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isViewAQuizActive, setIsViewAQuizActive] = useState(false);

  // --- FETCH DATA FROM ATLAS ---
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
    setIsLearning(false);
    setCurrentLessonIndex(0);
    setIsViewAQuizActive(false);
  }, [courseId]);

  // --- COMPUTE LESSONS LIST ---
  const allLessons = useMemo(() => {
    if (!course || !course.curriculum) return [];
    return course.curriculum.flatMap((module: any) => module.lessons || []);
  }, [course]);

  // --- HANDLERS ---
  const handleCourseCompletion = async () => {
    try {
      // Syncing the pass status to your MongoDB Enrollment collection
      await axios.patch(`http://localhost:5000/api/enroll/complete/${course?._id || course?.id}`, {}, {
        withCredentials: true 
      });
      console.log("Progress synced with MongoDB Atlas.");
      setIsViewAQuizActive(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Sync Error:", err);
      // We don't alert here anymore so it doesn't interrupt the certificate flow
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-white">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold tracking-widest text-slate-400 uppercase">Fetching from Atlas...</p>
      </div>
    </div>
  );

  if (!course) return <div className="p-20 text-center text-white bg-[#0f172a] min-h-screen font-bold">Course Not Found</div>;

  // --- VIEW A: THE LANDING PAGE ---
  if (!isLearning) {
    return (
      <div className="min-h-screen bg-white">
        {/* HERO SECTION */}
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
                  <div className="flex items-center gap-2"><Star className="text-yellow-400" size={18}/> {course.rating || "4.8"}</div>
                  <div className="flex items-center gap-2"><Clock size={18}/> {course.duration || "Self-Paced"}</div>
                  <div className="flex items-center gap-2"><BookOpen size={18}/> {allLessons.length} Lessons</div>
                </div>
                <button 
                  onClick={() => setIsLearning(true)} 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all transform hover:scale-105"
                >
                  <Play fill="white" size={20} /> Start Learning
                </button>
              </div>
              <div className="w-full md:w-80 aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-800">
                <img src={course.imageUrl} className="w-full h-full object-cover" alt="Thumbnail" />
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="max-w-5xl mx-auto py-16 px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-16">
              
              {/* SYLLABUS SECTION */}
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                  <CheckCircle className="text-purple-600" size={24} /> Syllabus
                </h2>
                <div className="space-y-4">
                  {course.curriculum?.map((module: any, idx: number) => (
                    <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                      <div className="bg-slate-50 p-5 font-bold text-slate-800 flex justify-between">
                        <span>{module.title}</span>
                        <span className="text-slate-400 font-normal text-sm">{module.lessons?.length || 0} Lessons</span>
                      </div>
                      {module.lessons?.map((lesson: any, lIdx: number) => (
                        <div key={lIdx} className="p-4 flex items-center gap-4 text-slate-600 border-t border-slate-100">
                          <Play size={14} className="text-slate-300" />
                          <span className="text-sm">{lesson.title}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </section>

              {/* QUIZ AREA */}
              <section id="quiz-section">
                <div className="bg-slate-900 rounded-[2rem] p-1 shadow-2xl overflow-hidden border border-slate-800">
                  {!isViewAQuizActive ? (
                    <div className="p-12 text-center text-white">
                      <div className="inline-flex p-5 bg-purple-600/20 rounded-3xl mb-6 text-purple-400">
                        <ClipboardCheck size={48} />
                      </div>
                      <h2 className="text-3xl font-black mb-4">Final Assessment</h2>
                      <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                        Pass the quiz to complete the course and verify your knowledge.
                      </p>
                      <button 
                        onClick={() => setIsViewAQuizActive(true)}
                        className="bg-white text-slate-900 px-12 py-4 rounded-2xl font-bold hover:bg-purple-50 transition-all"
                      >
                        Launch Quiz
                      </button>
                    </div>
                  ) : (
                    <div className="p-10">
                      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Award className="text-purple-500" /> Course Quiz
                        </h3>
                        <button onClick={() => setIsViewAQuizActive(false)} className="text-slate-500 hover:text-white text-sm">Cancel</button>
                      </div>
                      
                      {course.quiz && course.quiz.length > 0 ? (
                        <QuizArea 
                          quizData={course.quiz[0].questions || course.quiz} 
                          onPass={handleCourseCompletion} 
                          // Passing the dynamic user name from localStorage
                          userName={user?.name || "Successful Student"}
                          courseTitle={course.title}
                        />
                      ) : (
                        <p className="text-slate-400">No Quiz Data available for this course.</p>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* SIDEBAR */}
            <div className="md:col-span-1">
              <div className="sticky top-10 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="font-bold text-xl mb-6 text-slate-900">Details</h3>
                <ul className="space-y-4 text-slate-600 text-sm mb-8">
                  <li className="flex gap-3"><Award className="text-purple-600" size={18}/> Professional Certificate</li>
                  <li className="flex gap-3"><CheckCircle className="text-purple-600" size={18}/> Progress tracked to Atlas</li>
                  <li className="flex gap-3"><BookOpen className="text-purple-600" size={18}/> Full Curriculum Access</li>
                </ul>
                <button 
                   onClick={() => document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' })}
                   className="w-full py-4 border-2 border-slate-900 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all transform active:scale-95"
                >
                  Jump to Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW B: THE VIDEO PLAYER ---
  const currentLesson = allLessons[currentLessonIndex];
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      <header className="h-20 bg-[#1e293b] border-b border-slate-800 flex items-center justify-between px-8">
        <button onClick={() => setIsLearning(false)} className="flex items-center gap-2 font-bold hover:text-purple-400 transition-colors">
          <ChevronLeft size={20} /> Exit Player
        </button>
        <span className="text-slate-400 text-sm font-bold uppercase tracking-widest hidden sm:block">
          {course.title} • {currentLessonIndex + 1} / {allLessons.length}
        </span>
      </header>
      
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* PLAYER */}
        <div className="flex-1 bg-black flex flex-col overflow-y-auto">
          <div className="aspect-video w-full shadow-2xl">
            {currentLesson?.videoUrl ? (
                <iframe 
                  src={currentLesson.videoUrl} 
                  className="w-full h-full" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                />
            ) : (
                <div className="flex items-center justify-center h-full bg-slate-900 text-slate-500 italic">Video link not found in Atlas</div>
            )}
          </div>
          <div className="p-10 max-w-4xl">
            <h2 className="text-3xl font-bold mb-4 text-white">{currentLesson?.title}</h2>
            <p className="text-slate-400 leading-relaxed mb-8">Ready to master this concept? Watch the full video and take notes for the final quiz.</p>
            <div className="flex gap-4">
              <button 
                disabled={currentLessonIndex === 0} 
                onClick={() => setCurrentLessonIndex(p => p - 1)} 
                className="p-4 bg-slate-800 rounded-xl disabled:opacity-20 hover:bg-slate-700 transition-colors"
              >
                <SkipBack />
              </button>
              <button 
                disabled={currentLessonIndex === allLessons.length - 1} 
                onClick={() => setCurrentLessonIndex(p => p + 1)} 
                className="flex-1 sm:flex-none px-8 py-4 bg-purple-600 rounded-xl disabled:opacity-20 hover:bg-purple-700 font-bold flex items-center justify-center gap-2 transition-all"
              >
                Next Lesson <SkipForward size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* PLAYLIST SIDEBAR */}
        <div className="w-full lg:w-96 bg-[#1e293b] border-l border-slate-800 overflow-y-auto">
          <div className="p-6 border-b border-slate-800 font-bold uppercase text-xs text-slate-500 tracking-widest bg-[#1e293b] sticky top-0 z-10">
            Course Content
          </div>
          {allLessons.map((lesson: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentLessonIndex(idx)}
              className={`w-full text-left p-6 border-b border-slate-800/50 transition-all ${
                currentLessonIndex === idx ? 'bg-purple-600 shadow-inner' : 'hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className={`text-xs font-bold px-2 py-1 rounded ${currentLessonIndex === idx ? 'bg-white/20' : 'bg-slate-700 text-slate-400'}`}>
                  {idx + 1}
                </span>
                <p className={`text-sm font-semibold ${currentLessonIndex === idx ? 'text-white' : 'text-slate-300'}`}>
                  {lesson.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}