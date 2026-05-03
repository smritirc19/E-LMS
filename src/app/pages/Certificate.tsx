import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Download, Share2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function Certificate() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- 1. DYNAMIC USER LOGIC ---
  // This pulls the actual logged-in user instead of using 'mockUser'
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const userName = currentUser?.name || "Student"; 

  // --- 2. FETCH COURSE DATA FROM MONGODB ---
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course for certificate:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Certificate...</div>;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate not available</h2>
          <p className="text-gray-600 mb-6">Course record not found.</p>
          <Link to="/my-courses" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all">
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  const completionDate = new Date();
  const certificateId = `LH-${courseId?.toUpperCase()}-${userName.replace(/\s+/g, '-').toUpperCase()}-${completionDate.getFullYear()}`;

  const handleDownload = () => {
    window.print(); 
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
              {/* ✅ DYNAMIC NAME: This now uses the logged-in user's name */}
              <h2 className="text-5xl font-extrabold text-gray-900 mt-4 mb-6 italic font-serif underline decoration-purple-200">
                {userName}
              </h2>
              <span className="text-sm text-gray-400 uppercase tracking-[0.2em] font-bold">has successfully mastered</span>
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mt-4 mb-10">
                {course.title}
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12 text-center border-y border-gray-100 py-10">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Instructor</p>
                <p className="text-lg font-bold text-gray-900">{course.instructor || "LearnHub Academy"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Date Issued</p>
                <p className="text-lg font-bold text-gray-900">
                  {completionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Category</p>
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

            {/* Print-only signature line */}
            <div className="hidden print:flex justify-between mt-20">
              <div className="text-center border-t border-gray-300 pt-2 w-48">
                <p className="text-xs font-bold uppercase">Candidate Signature</p>
              </div>
              <div className="text-center border-t border-gray-300 pt-2 w-48">
                <p className="text-xs font-bold uppercase">Director of Education</p>
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