import React, { useState } from 'react';

// Assuming Question and DIFFICULTY_EMOJIS are defined elsewhere and passed as props
// We'll define a minimal Question interface here for now.
interface Question {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  category: string;
}

interface TestViewProps {
  questions: Question[];
  onFinishTest: () => void;
  darkMode: boolean;
  DIFFICULTY_EMOJIS: Record<string, string>;
}

const TestView: React.FC<TestViewProps> = ({ questions, onFinishTest, darkMode, DIFFICULTY_EMOJIS }) => {
  const [current, setCurrent] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<string[]>([]);
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const total = questions.length;
  const q = questions[current];

  const handleRevealAnswer = (id: string) => {
    if (!revealedAnswers.includes(id)) {
      setRevealedAnswers([...revealedAnswers, id]);
    }
  };

  const handleMarkForReview = (id: string) => {
    setMarkedForReview(prev => prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]);
  };

  const handleNext = () => {
    if (current < total - 1) setCurrent(current + 1);
  };
  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleFinish = () => {
    setShowResults(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleJump = (idx: number) => setCurrent(idx);

  const results = {
    score: total - revealedAnswers.length,
    total,
    percentage: total > 0 ? ((total - revealedAnswers.length) / total) * 100 : 0,
  };

  if (showResults) {
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
        <h3>Your Score: {results.score} / {results.total} ({results.percentage.toFixed(0)}%)</h3>
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
                onClick={() => handleJump(idx)}
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
      <div className="test-question-card" style={{ background: darkMode ? '#232946' : '#fff', boxShadow: '0 4px 16px rgba(102,126,234,0.08)', border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0', borderRadius: 16, padding: 32, marginBottom: 24, minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: '1.5rem' }}>{DIFFICULTY_EMOJIS[q.category] || '❓'}</span>
          <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Question {current + 1}:</span>
          {markedForReview.includes(q.id) && <span style={{ color: '#f59e42', marginLeft: 8 }}>★ Marked for Review</span>}
        </div>
        <div style={{ fontSize: '1.15rem', fontWeight: 500, marginBottom: 18 }}>{q.question}</div>
        {!revealedAnswers.includes(q.id) ? (
          <button className="button secondary" style={{ marginBottom: 10, alignSelf: 'flex-start' }} onClick={() => handleRevealAnswer(q.id)}>
            Show Answer
          </button>
        ) : (
          <div className="answer-revealed" style={{ marginBottom: 10 }}>
            <p><strong>Answer:</strong> {q.answer}</p>
            <div dangerouslySetInnerHTML={{ __html: q.explanation }} />
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className={`button secondary${markedForReview.includes(q.id) ? ' glow' : ''}`} onClick={() => handleMarkForReview(q.id)}>
            {markedForReview.includes(q.id) ? 'Unmark' : 'Mark for Review'}
          </button>
        </div>
      </div>
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