import { useState } from 'react';
import axios from 'axios';
import { Video, Type, AlignLeft, Send, X, AlertCircle } from 'lucide-react';

interface InstructorModeProps {
  onClose: () => void;
}

export default function InstructorMode({ onClose }: InstructorModeProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnail: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) throw new Error("No user found");
      
      const { token } = JSON.parse(savedUser);

      // POST request to the new backend route we created
      await axios.post('http://localhost:5000/api/courses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Course Published Successfully! It is now live for all students.");
      onClose(); 
      window.location.reload(); // Refresh to show the new course on the home page
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to publish course. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X size={28} />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Course</h2>
          <p className="text-gray-500 font-medium mt-1">Fill in the details to launch your lesson.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input */}
          <div>
            <label className="text-[10px] font-black uppercase text-indigo-400 ml-4 mb-2 block tracking-widest">Course Title</label>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-indigo-300 transition-all">
              <Type size={20} className="text-indigo-500" />
              <input 
                required 
                className="bg-transparent outline-none w-full font-semibold text-gray-800 placeholder:text-gray-300"
                placeholder="e.g. Advanced MERN Stack 2026"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="text-[10px] font-black uppercase text-indigo-400 ml-4 mb-2 block tracking-widest">Description</label>
            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-indigo-300 transition-all">
              <AlignLeft size={20} className="text-indigo-500 mt-1" />
              <textarea 
                required 
                className="bg-transparent outline-none w-full h-28 resize-none font-medium text-gray-700 placeholder:text-gray-300"
                placeholder="What will your students learn in this course?"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          {/* Video URL Input */}
          <div>
            <label className="text-[10px] font-black uppercase text-indigo-400 ml-4 mb-2 block tracking-widest">YouTube URL</label>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-indigo-300 transition-all">
              <Video size={20} className="text-indigo-500" />
              <input 
                required 
                className="bg-transparent outline-none w-full font-semibold text-gray-800 placeholder:text-gray-300"
                placeholder="https://www.youtube.com/watch?v=..."
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "Publishing..." : <><Send size={20}/> Publish Now</>}
          </button>
        </form>
      </div>
    </div>
  );
}