import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import CourseCard from '../components/CourseCard';
import { 
  ArrowRight, Award, Users, BookOpen, TrendingUp, 
  Sparkles, Target, CheckCircle2, Star, Send 
} from 'lucide-react';

export default function Home() {
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- NEW: Reviews State ---
  const [reviews, setReviews] = useState([
    { id: 1, name: "Arjun Mehta", rating: 5, comment: "The MERN stack projects are incredible. I landed an internship thanks to the portfolio I built here!", date: "2 days ago" },
    { id: 2, name: "Sanya Iyer", rating: 4, comment: "Excellent instructors. The way they explain complex backend concepts is very simple.", date: "1 week ago" },
    { id: 3, name: "Rohan Das", rating: 5, comment: "Best platform for Indian students wanting to learn industry-standard web development.", date: "3 days ago" }
  ]);

  const [newReview, setNewReview] = useState({ name: "", comment: "", rating: 5 });

  // 1. Fetch data from Backend
  useEffect(() => {
    const fetchLiveCourses = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/courses");
        setAllCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching live courses:", err);
        setLoading(false);
      }
    };
    fetchLiveCourses();
  }, []);

  // 2. Enrollment Logic
  const handleEnroll = async (courseId: string) => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!savedUser.id) {
      alert("Please log in first!");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/enroll", {
        userId: savedUser.id,
        courseId: courseId
      });
      if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert("Success! Head to your profile to start learning.");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  // 3. Review Submission Logic
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      alert("Please enter both your name and feedback.");
      return;
    }
    const reviewToAdd = {
      id: Date.now(),
      ...newReview,
      date: "Just now"
    };
    setReviews([reviewToAdd, ...reviews]);
    setNewReview({ name: "", comment: "", rating: 5 });
    alert("Review posted successfully!");
  };

  // Filters
  const featuredCourses = allCourses.filter(course => course.isBestseller === true).length > 0 
  ? allCourses.filter(course => course.isBestseller === true).slice(0, 3)
  : allCourses.slice(0, 3);
  
  const webDevCourses = allCourses.filter(course => 
    course.category?.toLowerCase().includes('web')
  ).slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Join 250,000+ learners worldwide</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Learn Without Limits</h1>
              <p className="text-xl mb-8 text-purple-100">Build skills with world-class instructors.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/courses" className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:shadow-2xl transition-all flex items-center gap-2 group">
                  Explore Courses <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" alt="Students" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Bestselling Courses */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Bestselling Courses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map(course => (
            <CourseCard key={course._id} course={course} onEnroll={handleEnroll} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose LearnHub?</h2>
            <p className="text-xl text-gray-600">Everything you need to advance your career</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureItem icon={<Target className="text-purple-600" />} title="Learn at Your Pace" desc="Lifetime access to materials on your schedule." bgColor="bg-purple-100" />
            <FeatureItem icon={<Award className="text-blue-600" />} title="Earn Certificates" desc="Recognized proof of your new skills and expertise." bgColor="bg-blue-100" />
            <FeatureItem icon={<Users className="text-green-600" />} title="Expert Instructors" desc="Learn from pros with real-world industry experience." bgColor="bg-green-100" />
            <FeatureItem icon={<BookOpen className="text-orange-600" />} title="Rich Content" desc="Video lectures, projects, and interactive quizzes." bgColor="bg-orange-100" />
            <FeatureItem icon={<CheckCircle2 className="text-pink-600" />} title="Practical Projects" desc="Build a portfolio that employers will notice." bgColor="bg-pink-100" />
            <FeatureItem icon={<TrendingUp className="text-indigo-600" />} title="Career Growth" desc="Gain the high-demand skills of 2026." bgColor="bg-indigo-100" />
          </div>
        </div>
      </section>

      {/* Web Dev Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Popular in Web Development</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {webDevCourses.map(course => (
            <CourseCard key={course._id} course={course} onEnroll={handleEnroll} />
          ))}
        </div>
      </section>

      {/* --- NEW: STUDENT REVIEWS & FEEDBACK SECTION --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            
            {/* Reviews Column */}
            <div className="lg:col-span-2">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Student Stories</h2>
              <p className="text-gray-600 mb-10">Real feedback from our Indian learning community.</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{rev.name}</h4>
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm italic leading-relaxed">"{rev.comment}"</p>
                    <p className="mt-3 text-[10px] uppercase font-bold text-gray-400 tracking-widest">{rev.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Form Column */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
              <h3 className="text-2xl font-bold mb-2">Leave a Review</h3>
              <p className="text-purple-200 text-sm mb-6">Share your learning experience</p>
              
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your Name"
                  value={newReview.name}
                  onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder:text-white/40"
                />
                
                <select 
                  value={newReview.rating}
                  onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none text-white"
                >
                  <option value="5" className="text-black">⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value="4" className="text-black">⭐⭐⭐⭐ (4 Stars)</option>
                  <option value="3" className="text-black">⭐⭐⭐ (3 Stars)</option>
                  <option value="2" className="text-black">⭐⭐ (2 Stars)</option>
                  <option value="1" className="text-black">⭐ (1 Star)</option>
                </select>

                <textarea 
                  placeholder="Your Feedback..."
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder:text-white/40"
                />

                <button 
                  type="submit" 
                  className="w-full bg-white text-indigo-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-50 transition-all active:scale-95"
                >
                  Submit Review <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper Components
function FeatureItem({ icon, title, desc, bgColor }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-50 hover:border-purple-200 transition-colors">
      <div className={`${bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-6`}>{icon}</div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}