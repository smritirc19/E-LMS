import React, { useState } from 'react';
import { jsPDF } from "jspdf"; 

interface QuizProps {
  quizData: any[]; 
  onPass: () => void;
  courseTitle?: string; 
  userName?: string; 
}

export default function QuizArea({ quizData, onPass, courseTitle = "Certification Course" }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // --- THE IMPROVED CERTIFICATE GENERATION ---
  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // 1. DYNAMIC DATA (Pulls "Kylie" or current user)
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const nameToPrint = currentUser?.name || "Student"; 
    
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Unique ID for project authenticity
    const certId = `LH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // 2. PREMIUM BORDERS & THEME
    doc.setDrawColor(124, 58, 237); // LearnHub Purple
    doc.setLineWidth(4);
    doc.rect(5, 5, 287, 200); 

    doc.setDrawColor(214, 211, 209); // Stone-300
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 277, 190);

    // Decorative Modern Accents
    doc.setFillColor(124, 58, 237);
    doc.triangle(5, 5, 40, 5, 5, 40, 'F'); 
    doc.setFillColor(30, 41, 59);
    doc.triangle(292, 205, 257, 205, 292, 170, 'F');

    // 3. LEARN HUB BRANDING
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(124, 58, 237);
    doc.text("LEARN HUB", 148.5, 25, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("ACADEMY OF DIGITAL EXCELLENCE", 148.5, 31, { align: "center" });

    // 4. CERTIFICATE TEXT
    doc.setFont("times", "bold");
    doc.setFontSize(44);
    doc.setTextColor(30, 41, 59);
    doc.text("Certificate of Completion", 148.5, 55, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(100, 116, 139);
    doc.text("PROUDLY PRESENTED TO", 148.5, 78, { align: "center" });

    // The Recipient Name
    doc.setFont("times", "bolditalic");
    doc.setFontSize(46);
    doc.setTextColor(124, 58, 237);
    doc.text(nameToPrint, 148.5, 98, { align: "center" });

    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(1);
    

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(100, 116, 139);
    doc.text("for the successful completion of the course", 148.5, 115, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(15, 23, 42);
    doc.text(courseTitle, 148.5, 132, { align: "center" });

    // 5. METADATA & VERIFICATION
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`Issued on ${date}`, 148.5, 150, { align: "center" });
    
    doc.setFont("courier", "bold");
    doc.setTextColor(124, 58, 237);
    doc.text(`Verification ID: ${certId}`, 148.5, 158, { align: "center" });

    // 6. SIGNATURES & OFFICIAL SEAL
    doc.setDrawColor(203, 213, 225);
    doc.line(40, 185, 100, 185);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text("HEAD OF CURRICULUM", 70, 191, { align: "center" });

    doc.line(196, 185, 256, 185);
    doc.text("LEARNHUB REGISTRAR", 226, 191, { align: "center" });

    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(0.8);
    doc.circle(148.5, 185, 12);
    doc.setFontSize(7);
    doc.text("OFFICIAL", 148.5, 183, { align: "center" });
    doc.text("SEAL", 148.5, 187, { align: "center" });

    // SAVE FILE
    doc.save(`LearnHub_Certificate_${nameToPrint.replace(/\s+/g, '_')}.pdf`);
    
    onPass();
  };

  // --- QUIZ LOGIC UI ---
  if (!quizData || quizData.length === 0) return <div className="text-red-400 p-10">Quiz array is empty.</div>;

  const q = quizData[current];
  const questionText = q.question || q.questionText || q.title || null;
  const optionsArray = q.options || q.choices || [];

  const handleSelect = (idx: number) => {
    if (idx === q.correctAnswer) setScore(s => s + 1);
    if (current + 1 < quizData.length) setCurrent(c => c + 1);
    else setFinished(true);
  };

  if (finished) {
    const passed = (score / quizData.length) >= 0.8;
    return (
      <div className="text-center p-10 bg-slate-900/50 rounded-3xl border border-slate-700 shadow-2xl">
        <div className="mb-6"><span className="text-6xl">{passed ? "🎓" : "📚"}</span></div>
        <h2 className={`text-4xl font-black mb-2 ${passed ? "text-green-400" : "text-red-400"}`}>
          {passed ? "Passed!" : "Keep Learning"}
        </h2>
        <p className="text-slate-400 mb-8 text-lg">
          You scored <span className="text-white font-bold">{score}</span> out of <span className="text-white font-bold">{quizData.length}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {passed ? (
            <button onClick={generateCertificate} className="bg-gradient-to-r from-purple-600 to-indigo-600 px-10 py-4 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all">
              Claim Certificate
            </button>
          ) : (
            <button onClick={() => {setCurrent(0); setScore(0); setFinished(false);}} className="bg-slate-700 px-10 py-4 rounded-2xl font-bold text-white hover:bg-slate-600 transition-all">
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="text-xs font-mono text-purple-400 uppercase tracking-widest">Question {current + 1} / {quizData.length}</div>
        <div className="h-1 w-32 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${((current + 1) / quizData.length) * 100}%` }} />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white leading-tight">{questionText}</h3>

      <div className="grid gap-4">
        {optionsArray.map((opt: string, i: number) => (
          <button key={i} onClick={() => handleSelect(i)} className="w-full text-left p-5 rounded-2xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-purple-500 hover:bg-slate-800 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold group-hover:bg-purple-600 transition-colors">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}