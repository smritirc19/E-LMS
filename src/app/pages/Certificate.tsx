import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockCourses, mockUser } from '../data/mockData';
import { Award, Download, Share2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function Certificate() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Find course safely
  const course = mockCourses.find(c => c.id === courseId);
  const enrolledCourse = mockUser.enrolledCourses.find(ec => ec.courseId === courseId);

  // Logic check: We'll consider it "earned" if progress is 100
  const isEarned = enrolledCourse && enrolledCourse.progress === 100;

  if (!course || !isEarned) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate not available</h2>
          <p className="text-gray-600 mb-6">Complete 100% of the course to unlock your official certification.</p>
          <Link to="/my-courses" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all">
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  // Fallback for missing ID in mockUser
  const userId = (mockUser as any).id || 'USER77';
  const completionDate = new Date(); // In a real app, this would come from the DB
  const certificateId = `LH-${courseId?.toUpperCase()}-${userId}-${completionDate.getFullYear()}`;

  const handleDownload = () => {
    window.print(); // Best way to "download" a web-based certificate!
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate - ${course.title}`,
        text: `I just completed ${course.title} on LearnHub!`,
        url: window.location.href
      }).catch(() => alert('Link copied to clipboard!'));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Certificate link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 print:bg-white print:py-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation - Hidden on Print */}
        <button
          onClick={() => navigate('/my-courses')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 font-semibold print:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Courses
        </button>

        {/* Certificate Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 border border-gray-100 print:shadow-none print:border-0">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-10 text-white text-center print:from-black print:to-black">
            <Award className="w-20 h-20 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-4xl font-bold mb-2 tracking-tight">Certificate of Completion</h1>
            <p className="text-purple-100 text-lg">Official Verified Achievement</p>
          </div>

          <div className="p-12 relative">
            {/* Decorative Gold Bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400"></div>

            <div className="text-center mb-12">
              <span className="text-sm text-gray-400 uppercase tracking-[0.2em] font-bold">This is to certify that</span>
              <h2 className="text-5xl font-extrabold text-gray-900 mt-4 mb-6 italic font-serif">{mockUser.name}</h2>
              <span className="text-sm text-gray-400 uppercase tracking-[0.2em] font-bold">has successfully mastered</span>
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mt-4 mb-10">
                {course.title}
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12 text-center border-y border-gray-100 py-10">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Instructor</p>
                <p className="text-lg font-bold text-gray-900">{course.instructor}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Date Issued</p>
                <p className="text-lg font-bold text-gray-900">
                  {completionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Curriculum</p>
                <p className="text-lg font-bold text-gray-900">{course.category}</p>
              </div>
            </div>

            {/* Validation Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="text-center md:text-left">
                <p className="text-xs text-gray-400 uppercase font-bold">Verification ID</p>
                <p className="text-purple-600 font-mono font-bold">{certificateId}</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold text-sm">SECURE & VERIFIED</span>
              </div>
            </div>

            {/* Skills Badges */}
            <div className="mt-12 text-center">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Core Competencies Developed</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {course.whatYouLearn?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-purple-50 text-purple-700 px-4 py-1.5 rounded-lg text-sm font-medium border border-purple-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Print-only signature line */}
            <div className="hidden print:flex justify-between mt-20">
              <div className="text-center border-t border-gray-300 pt-2 w-48">
                <p className="text-xs font-bold uppercase">Candidate Signature</p>
              </div>
              <div className="text-center border-t border-gray-300 pt-2 w-48">
                <p className="text-xs font-bold uppercase">Registrar</p>
              </div>
            </div>

            {/* Actions - Hidden on Print */}
            <div className="mt-16 flex flex-wrap gap-4 justify-center print:hidden">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg"
              >
                <Download className="w-5 h-5" /> Download PDF
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-white hover:border-purple-300 transition-all"
              >
                <Share2 className="w-5 h-5" /> Share Achievement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}