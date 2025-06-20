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
 * Props for TestQuestionCard component.
 */
interface TestQuestionCardProps {
  question: Question;
  revealed: boolean;
  markedForReview: boolean;
  darkMode: boolean;
  onReveal: (id: string) => void;
  onMarkForReview: (id: string) => void;
  DIFFICULTY_EMOJIS: Record<string, string>;
}

/**
 * Renders a single question in test mode, with reveal and mark for review functionality.
 */
const TestQuestionCard: React.FC<TestQuestionCardProps> = ({
  question,
  revealed,
  markedForReview,
  darkMode,
  onReveal,
  onMarkForReview,
  DIFFICULTY_EMOJIS,
}) => {
  return (
    <div
      className="test-question-card"
      style={{
        background: darkMode ? '#232946' : '#fff',
        boxShadow: '0 4px 16px rgba(102,126,234,0.08)',
        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
        borderRadius: 16,
        padding: 32,
        marginBottom: 24,
        minHeight: 180,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: '1.5rem' }}>{DIFFICULTY_EMOJIS[question.category] || '❓'}</span>
        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Question:</span>
        {markedForReview && <span style={{ color: '#f59e42', marginLeft: 8 }}>★ Marked for Review</span>}
      </div>
      <div style={{ fontSize: '1.15rem', fontWeight: 500, marginBottom: 18 }}>{question.question}</div>
      {!revealed ? (
        <button className="button secondary" style={{ marginBottom: 10, alignSelf: 'flex-start' }} onClick={() => onReveal(question.id)}>
          Show Answer
        </button>
      ) : (
        <div className="answer-revealed" style={{ marginBottom: 10 }}>
          <p><strong>Answer:</strong> {question.answer}</p>
          <div dangerouslySetInnerHTML={{ __html: question.explanation }} />
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className={`button secondary${markedForReview ? ' glow' : ''}`} onClick={() => onMarkForReview(question.id)}>
          {markedForReview ? 'Unmark' : 'Mark for Review'}
        </button>
      </div>
    </div>
  );
};

export default TestQuestionCard; 