import React, { useState } from 'react';
import TestQuestionCard, { Question } from './TestQuestionCard';
import TestResults from './TestResults';

/**
 * Props for TestView component.
 */
interface TestViewProps {
  questions: Question[];
  onFinishTest: () => void;
  darkMode: boolean;
  DIFFICULTY_EMOJIS: Record<string, string>;
}

/**
 * TestView is the main test-taking experience. It shows one question per page, allows navigation, marking for review, and shows results at the end.
 */
const TestView: React.FC<TestViewProps> = ({ questions, onFinishTest, darkMode, DIFFICULTY_EMOJIS }) => {
  const [current, setCurrent] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<string[]>([]);
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const total = questions.length;
  const q = questions[current];

  /** Reveal the answer for a question by id. */
  const handleRevealAnswer = (id: string) => {
    if (!revealedAnswers.includes(id)) {
      setRevealedAnswers([...revealedAnswers, id]);
    }
  };

  /** Mark or unmark a question for review by id. */
  const handleMarkForReview = (id: string) => {
    setMarkedForReview(prev => prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]);
  };

  /** Go to the next question. */
  const handleNext = () => {
    if (current < total - 1) setCurrent(current + 1);
  };
  /** Go to the previous question. */
  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  /** Finish the test and show results. */
  const handleFinish = () => {
    setShowResults(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  /** Jump to a specific question by index. */
  const handleJump = (idx: number) => setCurrent(idx);

  if (showResults) {
    return (
      <TestResults
        questions={questions}
        revealedAnswers={revealedAnswers}
        markedForReview={markedForReview}
        darkMode={darkMode}
        showConfetti={showConfetti}
        onFinishTest={onFinishTest}
        onJump={handleJump}
        DIFFICULTY_EMOJIS={DIFFICULTY_EMOJIS}
      />
    );
  }

  return (
    <div className={`test-view ${darkMode ? 'dark-mode' : ''}`} style={{ maxWidth: 600, margin: '0 auto', minHeight: 500, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {/* Progress Bar */}
      <div style={{ margin: '24px 0 16px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1, height: 8, background: darkMode ? '#334155' : '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ width: `${((current + 1) / total) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #4ecdc4, #6366f1)', borderRadius: 6, transition: 'width 0.5s' }} />
        </div>
        <span style={{ fontWeight: 600, fontSize: '1rem', color: darkMode ? '#f1f5f9' : '#6366f1' }}>
          {current + 1} / {total}
        </span>
      </div>
      {/* Question Card */}
      <TestQuestionCard
        question={q}
        revealed={revealedAnswers.includes(q.id)}
        markedForReview={markedForReview.includes(q.id)}
        darkMode={darkMode}
        onReveal={handleRevealAnswer}
        onMarkForReview={handleMarkForReview}
        DIFFICULTY_EMOJIS={DIFFICULTY_EMOJIS}
      />
      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button className="button secondary" onClick={handlePrev} disabled={current === 0} style={{ opacity: current === 0 ? 0.5 : 1 }}>
          ← Previous
        </button>
        <div style={{ display: 'flex', gap: 4 }}>
          {questions.map((_, idx) => (
            <button
              key={idx}
              className={`button secondary${idx === current ? ' glow' : ''}`}
              style={{ minWidth: 32, fontWeight: 700, background: idx === current ? 'linear-gradient(135deg, #4ecdc4, #6366f1)' : undefined, color: idx === current ? 'white' : undefined }}
              onClick={() => handleJump(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        {current === total - 1 ? (
          <button className="button" onClick={handleFinish}>
            Finish Test
          </button>
        ) : (
          <button className="button" onClick={handleNext}>
            Next →
          </button>
        )}
      </div>
      <button className="button secondary" onClick={onFinishTest} style={{ alignSelf: 'center', marginTop: 10 }}>
        Cancel Test
      </button>
    </div>
  );
};

export default TestView; 