import React, { useState } from 'react';

export default function QuizArea({ quizData, onPass }: any) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore(score + 1);

    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
      // If they get 100%, trigger the completion logic
      if (isCorrect ? score + 1 : score === quizData.length) {
        onPass(); 
      }
    }
  };

  if (quizFinished) {
    return (
      <div className="p-10 text-center bg-zinc-900 text-white rounded-3xl">
        <h2 className="text-2xl font-bold mb-4">Quiz Finished!</h2>
        <p>{score === quizData.length ? "Perfect Score! Certificate Unlocked." : "You missed a few. Try again!"}</p>
        {score !== quizData.length && (
          <button onClick={() => window.location.reload()} className="mt-4 bg-purple-600 px-6 py-2 rounded-lg">Try Again</button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 p-8 rounded-3xl text-white shadow-xl">
      <h3 className="text-purple-400 font-bold mb-2">Question {currentQuestion + 1}</h3>
      <p className="text-xl mb-8">{quizData[currentQuestion].question}</p>
      <div className="grid gap-4">
        {quizData[currentQuestion].options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleAnswer(index === quizData[currentQuestion].correctAnswer)}
            className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-600 transition-all"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}