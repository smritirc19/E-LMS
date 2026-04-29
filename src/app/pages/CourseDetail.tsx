import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
const Player = ReactPlayer as unknown as React.FC<any>; 

import Rating from '../components/Rating';
import QuizArea from '../components/QuizArea'; 
import {
  Clock, Users, Award, PlayCircle, 
  FileText, CheckCircle, ChevronDown, ChevronUp, 
  ArrowLeft, HelpCircle, Lock, Trophy, ClipboardCheck,
  Star, Globe
} from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Tip: Double check your console to see the data structure!
        const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
        console.log("Course Data Loaded:", response.data); 
        setCourse(response.data);
        setLoading(false);
        if (response.data.curriculum?.[0]?.lessons?.[0]?.videoUrl) {
          setCurrentVideo(response.data.curriculum[0].lessons[0].videoUrl);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setLoading(false);
      }
    };
    if (id) fetchCourseData();
  }, [id]);

  const handleCourseCompletion = async () => {
    try {
      setShowCertificate(true); 
      setIsQuizActive(false); 
      await axios.patch(`http://localhost:5000/api/enrollments/complete/${id}`, {}, {
        withCredentials: true 
      });
    } catch (err) {
      console.error("Failed to update completion status:", err);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId) ? prev.filter(i => i !== moduleId) : [...prev, moduleId]
    );
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* VIDEO PLAYER SECTION */}
      <div className="bg-zinc-950 w-full">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </button>
          
          <div className="rounded-[2rem] overflow-hidden shadow-2xl aspect-video bg-black relative border border-white/5">
            <Player url={currentVideo} width="100%" height="100%" controls />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: CURRICULUM OR QUIZ */}
        <div className="lg:col-span-2 space-y-12">
          {isQuizActive ? (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Final Exam</h2>
                <button 
                  onClick={() => setIsQuizActive(false)} 
                  className="text-purple-600 font-bold hover:text-purple-800 transition-colors"
                >
                  Back to Lessons
                </button>
              </div>
              <div className="bg-zinc-900 rounded-[2.5rem] p-4 border border-zinc-800 shadow-2xl">
                {/* 
                   FIXED: Accessing the first item of the quiz array 
                   since your seed.js defines quiz: [{...}] 
                */}
                {course?.quiz && course.quiz.length > 0 ? (
                  <QuizArea quizData={course.quiz[0]} onPass={handleCourseCompletion} />
                ) : (
                  <div className="text-white p-20 text-center">
                    <HelpCircle size={48} className="mx-auto mb-4 text-zinc-700" />
                    <p className="text-xl font-medium">No quiz found for this course.</p>
                    <p className="text-zinc-500 mt-2">Check your database seeding.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-4xl font-black mb-4 text-zinc-900">{course?.title}</h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{course?.description}</p>
                
                <div className="lg:hidden flex flex-wrap gap-4 mb-8">
                   <span className="flex items-center gap-1 text-yellow-600 font-bold"><Star size={18} fill="currentColor"/> {course?.rating || '4.8'}</span>
                   <span className="flex items-center gap-1 text-gray-600 font-bold"><Clock size={18}/> {course?.duration || '28 hours'}</span>
                </div>
              </div>

              {showCertificate && (
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2.5rem] p-10 text-white text-center shadow-xl">
                  <Trophy size={48} className="mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-4">Congratulations! You've Mastered this Course.</h2>
                  <Link to="/profile" className="inline-block bg-white text-green-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">View Certificate</Link>
                </div>
              )}

              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                {course?.curriculum?.map((module: any, index: number) => (
                  <div key={module._id || index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:border-purple-200 transition-colors">
                    <button onClick={() => toggleModule(module._id)} className="w-full flex justify-between p-6 hover:bg-gray-50 transition-colors">
                      <div className="text-left">
                        <span className="block text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Section {index + 1}</span>
                        <span className="font-bold text-gray-900">{module.title}</span>
                      </div>
                      {expandedModules.includes(module._id) ? <ChevronUp className="text-gray-400"/> : <ChevronDown className="text-gray-400"/>}
                    </button>
                    {expandedModules.includes(module._id) && (
                      <div className="p-6 pt-0 space-y-2 border-t border-gray-50 mt-2">
                        {module.lessons.map((lesson: any) => (
                          <button 
                            key={lesson._id} 
                            onClick={() => { setCurrentVideo(lesson.videoUrl); setIsQuizActive(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                            className="w-full flex justify-between items-center p-4 rounded-xl hover:bg-purple-50 group transition-all text-sm"
                          >
                            <span className="flex items-center gap-3 font-medium text-gray-700 group-hover:text-purple-700">
                              <PlayCircle size={18} className="text-gray-400 group-hover:text-purple-600"/> 
                              {lesson.title}
                            </span>
                            <span className="text-gray-400 font-mono">{lesson.duration || "10:00"}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* RIGHT COLUMN: THE SIDEBAR INFO CARD */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
            <div className="relative group">
                <img src={course?.imageUrl} className="w-full h-56 object-cover" alt="Course Thumbnail" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <PlayCircle size={48} className="text-white opacity-80" />
                </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6 text-sm font-bold">
                <span className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full"><Star size={14} fill="currentColor"/> {course?.rating || '4.8'}</span>
                <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full"><Clock size={14}/> {course?.duration || '28 hours'}</span>
              </div>

              <div className="space-y-4 mb-10">
                <button 
                  onClick={() => { setIsQuizActive(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                >
                  Start Learning Now
                </button>

                {!showCertificate && (
                  <button 
                    onClick={() => {
                      setIsQuizActive(true);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-2 border-2 border-zinc-800"
                  >
                    <ClipboardCheck size={20} className="text-purple-400" />
                    Take Interactive Quiz
                  </button>
                )}

                {showCertificate && (
                  <Link to="/profile" className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-green-100">
                    <Award size={20} /> View Certificate
                  </Link>
                )}
              </div>

              <div className="pt-8 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-5 uppercase tracking-widest text-[10px]">Course Includes</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                    <Award size={18} className="text-purple-500" /> Professional Certificate
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                    <Globe size={18} className="text-purple-500" /> Lifetime Access
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                    <HelpCircle size={18} className="text-purple-500" /> Interactive Quizzes
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}