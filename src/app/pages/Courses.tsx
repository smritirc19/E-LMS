import { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function Courses() {
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 1. Fetch live courses from MongoDB
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/courses");
        setAllCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // 2. Handle Enrollment Logic
  const handleEnroll = async (courseId: string) => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (!savedUser.id) {
      alert("Please log in to enroll in courses!");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/enroll", {
        userId: savedUser.id,
        courseId: courseId
      });

      if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert("Enrolled successfully! Head to your profile to see the course.");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  // 3. Filter Logic
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Section */}
      <div className="bg-purple-700 py-16 shadow-inner">
  <div className="max-w-7xl mx-auto px-4 text-center md:text-left">
    
    {/* WHITE AND BOLD TITLE */}
    <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight uppercase">
      All Courses
    </h1>
    
    {/* Subtle White Description */}
    <p className="text-purple-100 text-lg max-w-2xl font-medium leading-relaxed">
      Browse our full catalog of world-class learning content. 
      Your journey to mastering new skills starts here.
    </p>

    {/* Small Accent Line */}
    <div className="mt-6 w-20 h-1.5 bg-white rounded-full opacity-80"></div>
    
  </div>
</div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <select 
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer shadow-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
            </select>
            
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard 
                key={course._id} 
                course={course} 
                onEnroll={handleEnroll} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
}