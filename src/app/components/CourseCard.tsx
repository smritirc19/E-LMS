import { Link, useNavigate } from 'react-router-dom';
import Rating from './Rating';
import { Clock, Users, BarChart3, TrendingUp } from 'lucide-react';

interface CourseCardProps {
  course: any; 
  onEnroll: (courseId: string) => void; 
}

export default function CourseCard({ course, onEnroll }: CourseCardProps) {
  const navigate = useNavigate();

  // 1. Calculate discount logic
  const hasDiscount = course.originalPrice && course.originalPrice > course.price;
  const discount = hasDiscount
    ? Math.round((1 - course.price / course.originalPrice) * 100)
    : 0;

  // Check if course is free
  const isFree = course.price === 0 || course.price === "0";

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    // PAID IDS LOGIC: Define which simple IDs require payment
    const paidIds = ['3', '6', '8', '10'];

    if (paidIds.includes(course.id)) {
      // If it's a paid course, REDIRECT to the mock payment page
      // We pass the mongo _id in the URL and the simple id + title in the search query
      navigate(`/checkout/${course._id}?title=${encodeURIComponent(course.title)}&id=${course.id}`);
    } else {
      // If it's a free course (1, 2, 4, 5, 7, 9), enroll directly
      onEnroll(course._id);
    }
  };

  return (
    <Link to={`/course/${course.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden h-48">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {course.isBestseller && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-3 py-1 text-xs font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Bestseller
            </div>
          )}

          {discount > 0 && !isFree && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              {discount}% OFF
            </div>
          )}
          
          {isFree && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
              FREE
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
            {course.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>

          <div className="mb-3">
            <Rating rating={course.rating} reviewCount={course.reviewCount} size="sm" />
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.students > 999 ? `${(course.students / 1000).toFixed(1)}k` : course.students}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              <span>{course.level}</span>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                {isFree ? (
                  <span className="text-2xl font-bold text-green-600">Free</span>
                ) : (
                  <>
                    <span className="text-2xl font-semibold text-gray-900">${course.price}</span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-500 line-through ml-2">${course.originalPrice}</span>
                    )}
                  </>
                )}
              </div>

              <button 
                onClick={handleEnrollClick}
                className={`${
                  isFree ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'
                } text-white text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95`}
              >
                {isFree ? "Get Free" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}