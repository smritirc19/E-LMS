import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, ShieldCheck, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function MockPayment() {
  const { mongoId } = useParams(); 
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const courseTitle = searchParams.get('title') || 'Your Selected Course';
  const simpleId = searchParams.get('id') || '3'; 
  const coursePrice = searchParams.get('price') || '24.99'; 
  
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // NEW: State for the success card

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userId = localStorage.getItem('userId') || '65f1234567890abcdef12345';
    const finalMongoId = mongoId || '65f1234567890abcdef12345';

    try {
      await axios.post('http://localhost:5000/api/enroll', {
        userId: userId,
        courseId: simpleId, 
        mongoId: finalMongoId,   
        amount: coursePrice,
        isPaid: true 
      });

      // Instead of an alert, show our custom success card
      setLoading(false);
      setShowSuccess(true);

      // Wait 3 seconds so they can see the success card, then navigate
      setTimeout(() => {
        navigate(`/course/${simpleId}`);
      }, 3000);

    } catch (err: any) {
      console.log("Database Update Error:", err.response?.data || err.message);
      // Even on error, show success for the demo flow
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => navigate(`/course/${simpleId}`), 3000);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      
      {/* SUCCESS OVERLAY - Only shows when showSuccess is true */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white/90 p-10 rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col items-center text-center scale-110 transition-transform">
            <div className="bg-emerald-100 p-4 rounded-full mb-6 animate-bounce">
              <CheckCircle2 size={60} className="text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 font-medium">Redirecting you to your course...</p>
          </div>
        </div>
      )}

      <div className={`max-w-4xl w-full grid md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 transition-all ${showSuccess ? 'blur-md scale-95' : ''}`}>
        
        {/* LEFT SECTION: BILLING SUMMARY */}
        <div className="bg-zinc-900 p-10 text-white flex flex-col justify-between">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
              <ArrowLeft size={18} /> Back
            </button>
            <h2 className="text-3xl font-black mb-2 tracking-tight">Checkout</h2>
            <div className="space-y-4 mt-8">
              <div className="flex justify-between py-4 border-b border-zinc-800">
                <span className="text-zinc-400">Course</span>
                <span className="font-bold text-right ml-4 line-clamp-1">{courseTitle}</span>
              </div>
              <div className="flex justify-between py-4 text-xl">
                <span className="font-bold text-purple-400 uppercase text-xs tracking-widest self-center">Total Amount</span>
                <span className="font-black text-white text-2xl">${coursePrice}</span>
              </div>
            </div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-2xl flex gap-3 items-center">
            <ShieldCheck className="text-emerald-400" size={24} />
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Secure Sandbox Mode</p>
          </div>
        </div>

        {/* RIGHT SECTION: DUMMY FORM */}
        <div className="p-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Lock size={20} /></div>
            <h3 className="font-bold text-gray-800 uppercase text-sm tracking-tighter">Payment Details</h3>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Cardholder</label>
              <input type="text" required placeholder="SMRITI R" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Card Number</label>
              <div className="relative">
                <input type="text" required maxLength={19} placeholder="4242 4242 4242 4242" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Expiry</label>
                <input type="text" required placeholder="MM/YY" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">CVC</label>
                <input type="text" required maxLength={3} placeholder="123" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none" />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || showSuccess}
              className={`w-full py-4 rounded-2xl font-black text-lg text-white shadow-lg transition-all active:scale-95 ${loading ? 'bg-zinc-400' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {loading ? "Verifying..." : "Pay Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}