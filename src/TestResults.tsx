import React from 'react';

/**
 * Type for a single question.
 */
export interface Question {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  category: string;
}

/**
 * Props for TestResults component.
 */
interface TestResultsProps {
  questions: Question[];
  revealedAnswers: string[];
  markedForReview: string[];
  darkMode: boolean;
  showConfetti: boolean;
  onFinishTest: () => void;
  onJump: (idx: number) => void;
  DIFFICULTY_EMOJIS: Record<string, string>;
}

/**
 * Renders the test results, confetti, score, and review summary.
 */
const TestResults: React.FC<TestResultsProps> = ({
  questions,
  revealedAnswers,
  markedForReview,
  darkMode,
  showConfetti,
  onFinishTest,
  onJump,
  DIFFICULTY_EMOJIS,
}) => {
  const total = questions.length;
  const score = total - revealedAnswers.length;
  const percentage = total > 0 ? ((score / total) * 100) : 0;

  return (
    <div className={`test-results-view ${darkMode ? 'dark-mode' : ''}`} style={{ position: 'relative' }}>
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 1000 }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: Math.random() * 100 + '%',
                top: -10,
                width: '12px',
                height: '12px',
                backgroundColor: ['#4ecdc4', '#f093fb', '#f5576c', '#6366f1', '#ffd166', '#06d6a0'][Math.floor(Math.random() * 6)],
                borderRadius: '50%',
                animation: `confetti-fall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: Math.random() * 2 + 's',
              }}
            />
          ))}
        </div>
      )}
      <h2>🎉 Test Completed!</h2>
      <h3>Your Score: {score} / {total} ({percentage.toFixed(0)}%)</h3>
      <p>You revealed the answer for {revealedAnswers.length} out of {questions.length} questions.</p>
      <button className="button" onClick={onFinishTest}>Back to Questions</button>
      <div className="results-summary">
        <h4>Review Your Answers:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {questions.map((q, idx) => (
            <button
              key={q.id}
              className={`button secondary ${revealedAnswers.includes(q.id) ? 'revealed' : 'correct'}`}
              style={{ minWidth: 36, fontWeight: 700, border: markedForReview.includes(q.id) ? '2px solid #f59e42' : undefined }}
              onClick={() => onJump(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        {questions.map((q, idx) => (
          <div key={q.id} className={`question-card-result ${revealedAnswers.includes(q.id) ? 'revealed' : 'correct'}`} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.2rem' }}>{DIFFICULTY_EMOJIS[q.category] || '❓'}</span>
              <strong>Q{idx + 1}:</strong> {q.question}
              {markedForReview.includes(q.id) && <span style={{ color: '#f59e42', marginLeft: 8 }}>★ Marked</span>}
            </div>
            <p style={{ color: revealedAnswers.includes(q.id) ? '#ef4444' : '#10b981', margin: '8px 0' }}>
              {revealedAnswers.includes(q.id) ? 'You revealed the answer.' : 'You answered this correctly (presumably).'}
            </p>
            <details>
              <summary>Show Answer & Explanation</summary>
              <div className="answer-content">
                <p><strong>Answer:</strong> {q.answer}</p>
                <div dangerouslySetInnerHTML={{ __html: q.explanation }} />
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestResults; 