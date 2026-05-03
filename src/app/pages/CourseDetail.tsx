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
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Student"}');
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [progress, setProgress] = useState(0); // Added for progress tracking

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCourse(response.data);
        
        // Check if the user is already enrolled and has progress
        // This assumes your backend sends enrollment data with the course or via a separate fetch
        if (response.data.userProgress) {
          setProgress(response.data.userProgress);
          if (response.data.userProgress === 100) setShowCertificate(true);
        }

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
      // 1. Call the backend to set progress to 100%
      await axios.patch(`http://localhost:5000/api/enroll/complete/${id}`, {}, {
  withCredentials: true 
});

      // 2. Update local UI
      setProgress(100);
      setShowCertificate(true); 
      setIsQuizActive(false); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (err) {
      console.error("Failed to update completion status:", err);
      alert("Pass recorded locally, but failed to save to server. Are you logged in?");
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
        <div className="lg:col-span-2 space-y-12">
          {isQuizActive ? (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-zinc-900">Final Course Quiz</h2>
                <button onClick={() => setIsQuizActive(false)} className="text-purple-600 font-bold">Cancel Quiz</button>
              </div>
              <div className="bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-800 shadow-2xl">
                {course?.quiz?.length > 0 ? (
                  <QuizArea quizData={course.quiz[0]} onPass={handleCourseCompletion} userName={user.name}/>
                ) : (
                  <div className="text-white text-center py-10">No quiz questions found.</div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-4xl font-black mb-4 text-zinc-900">{course?.title}</h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{course?.description}</p>
              </div>

              {showCertificate && (
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2.5rem] p-10 text-white text-center shadow-xl animate-bounce">
                  <Trophy size={48} className="mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-4">You've Earned Your Certificate!</h2>
                  <Link to="/profile" className="inline-block bg-white text-green-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-100">Claim Now</Link>
                </div>
              )}

              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6 text-zinc-900">Curriculum</h2>
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

        {/* SIDEBAR WITH PROGRESS BAR */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
            <img src={course?.imageUrl} className="w-full h-48 object-cover" alt="Course" />
            <div className="p-8">
              {/* THE PROGRESS BAR */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-black uppercase text-zinc-400 tracking-widest">Your Progress</span>
                  <span className="text-lg font-black text-purple-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-4">
                {progress === 100 ? (
                  <Link to="/profile" className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2">
                    <Award size={20} /> View Certificate
                  </Link>
                ) : (
                  <button 
                    onClick={() => { setIsQuizActive(true); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                    className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black flex items-center justify-center gap-2"
                  >
                    <ClipboardCheck size={20} className="text-purple-400" />
                    Take Final Quiz
                  </button>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <Star className="text-yellow-500" size={18} fill="currentColor" /> {course?.rating || '4.8'} Course Rating
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <Globe className="text-purple-500" size={18} /> English & Hindi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Clock, PlayCircle } from 'lucide-react';
import axios from 'axios';

interface CourseCardProps {
  course: any;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Check if this course is already in the user's wishlist on load
  useEffect(() => {
    if (user?.wishlist?.includes(course._id)) {
      setIsWishlisted(true);
    }
  }, [course._id, user?.wishlist]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to course detail when clicking heart
    e.stopPropagation();

    const previousState = isWishlisted;
    setIsWishlisted(!isWishlisted);

    try {
      if (!user) {
        alert("Please login to add to wishlist");
        setIsWishlisted(false);
        return;
      }

      // Sync with your MERN backend
      await axios.post('http://localhost:5000/api/wishlist/toggle', {
        userId: user._id,
        courseId: course._id
      });
      
      // Update local storage to keep Navbar and Modal in sync
      const updatedUser = { ...user };
      if (previousState) {
        updatedUser.wishlist = updatedUser.wishlist.filter((id: string) => id !== course._id);
      } else {
        updatedUser.wishlist = [...(updatedUser.wishlist || []), course._id];
      }
      localStorage.setItem('user', JSON.stringify(updatedUser));

    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      setIsWishlisted(previousState); // Revert UI if server fails
    }
  };

  return (
    <Link 
      to={`/course/${course._id}`} 
      className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 block"
    >
      {/* IMAGE SECTION */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={course.imageUrl || course.image} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* THE HEART BUTTON */}
        <button 
          onClick={toggleWishlist}
          className="absolute top-5 right-5 p-3 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-white transition-all z-10 active:scale-90"
        >
          <Heart 
            size={20} 
            strokeWidth={2}
            className={`transition-all duration-300 ${
              isWishlisted 
                ? 'text-purple-600 fill-purple-600 scale-110' 
                : 'text-purple-500 fill-none'
            }`} 
          />
        </button>

        {/* Level Tag */}
        <div className="absolute bottom-4 left-5 bg-zinc-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
          {course.level || 'Beginner'}
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="p-8">
        <div className="flex items-center gap-2 mb-3">
          <Star className="text-yellow-500" size={14} fill="currentColor" />
          <span className="text-xs font-bold text-gray-600">{course.rating || '4.8'}</span>
          <span className="text-gray-300 mx-1">•</span>
          <Clock className="text-gray-400" size={14} />
          <span className="text-xs font-bold text-gray-600">{course.duration || '12h 30m'}</span>
        </div>

        <h3 className="font-black text-zinc-900 text-xl mb-3 line-clamp-1 leading-tight group-hover:text-purple-700 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
          {course.description}
        </p>

        <div className="flex justify-between items-center pt-6 border-t border-gray-50">
          <div>
            <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Price</span>
            <span className="text-2xl font-black text-zinc-900">${course.price}</span>
          </div>
          
          <div className="flex gap-2">
             <div className="bg-purple-100 p-3 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
               <PlayCircle size={20} />
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
}