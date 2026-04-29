import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCourses } from '../data/mockData';
import { Play, CheckSquare, ArrowLeft, ChevronRight, Award } from 'lucide-react';


export default function CoursePlayer() {
  const { id } = useParams();
const course = mockCourses.find(c => c.id === id);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');
  const [quizScore, setQuizScore] = useState<number | null>(null);

  if (!course) return <div className="p-20 text-center">Course Not Found</div>;

  const handleQuizSubmit = (selected: number, correct: number) => {
    if (selected === correct) setQuizScore(100);
    else setQuizScore(0);
  };

  return (
    <div className="min-h-screen bg-[#1c1d1f] text-white flex flex-col">
      {/* 1. TOP NAVIGATION BAR */}
      <div className="h-16 bg-[#2d2f31] border-b border-gray-700 flex items-center justify-between px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 hover:text-purple-400">
          <ArrowLeft className="w-5 h-5" /> <span>Back to Course Info</span>
        </button>
        <h1 className="font-bold truncate max-w-md hidden md:block">{course.title}</h1>
        {quizScore === 100 && (
          <div className="bg-green-600 px-3 py-1 rounded text-sm font-bold flex items-center gap-2">
            <Award className="w-4 h-4" /> Quiz Passed!
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* 2. LEFT SIDE: MAIN PLAYER AREA */}
        <div className="flex-1 bg-black flex flex-col">
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full"
              src={course.videoUrl}
              title="Course Content"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">About this Lesson</h2>
            <p className="text-gray-400">{course.description}</p>
          </div>
        </div>

        {/* 3. RIGHT SIDE: CURRICULUM & QUIZ TABS */}
        <div className="w-full lg:w-96 bg-[#2d2f31] border-l border-gray-700 flex flex-col">
          <div className="flex border-b border-gray-700">
            <button 
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-4 font-bold ${activeTab === 'content' ? 'border-b-4 border-purple-500' : 'text-gray-400'}`}
            >
              Course Content
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-4 font-bold ${activeTab === 'quiz' ? 'border-b-4 border-purple-500' : 'text-gray-400'}`}
            >
              Quiz
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'content' ? (
              <div className="space-y-2">
                {course.curriculum.map((module, mIdx) => (
                  <div key={module.id} className="mb-4">
                    <h3 className="text-sm font-bold text-gray-400 mb-2">Section {mIdx + 1}: {module.title}</h3>
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center gap-3 p-3 hover:bg-[#3e4143] cursor-pointer rounded">
                        <Play className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{lesson.title}</span>
                        <span className="ml-auto text-xs text-gray-500">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="font-bold flex items-center gap-2">
                  <CheckSquare className="text-purple-400" /> Lesson Quiz
                </h3>
                {course.quiz?.map((q, i) => (
                  <div key={i} className="bg-[#3e4143] p-4 rounded-lg">
                    <p className="text-sm mb-4">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, idx) => (
                        <button 
                          key={idx}
                          onClick={() => handleQuizSubmit(idx, q.correctAnswer)}
                          className="w-full text-left p-3 text-xs border border-gray-600 rounded hover:border-purple-500 transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {quizScore !== null && (
                  <div className={`p-4 rounded text-center font-bold ${quizScore === 100 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                    {quizScore === 100 ? "Correct! You're ready for the next lesson." : "Try again!"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}