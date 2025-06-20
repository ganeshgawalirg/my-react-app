import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
 * Props for QuestionCard component.
 */
export interface QuestionCardProps {
  question: Question;
  isOpen: boolean;
  isViewed: boolean;
  selectedQuestions: string[];
  darkMode: boolean;
  onToggle: () => void;
  onSelect: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  updateStudyStreak: (id: string) => void;
  DIFFICULTY_EMOJIS: Record<string, string>;
  CATEGORY_COLORS: Record<string, string>;
}

/**
 * Renders a single question card with drag-and-drop, open/close, select, delete, and view logic.
 */
const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isOpen,
  isViewed,
  selectedQuestions,
  darkMode,
  onToggle,
  onSelect,
  onDelete,
  updateStudyStreak,
  DIFFICULTY_EMOJIS,
  CATEGORY_COLORS,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const categoryKey = typeof question.category === 'string' ? question.category.toLowerCase() : '';
  const difficultyEmoji = DIFFICULTY_EMOJIS[question.category as keyof typeof DIFFICULTY_EMOJIS] || '❓';

  return (
    <div
      ref={setNodeRef}
      className={`question-card${isOpen ? ' open' : ''}`}
      onClick={onToggle}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : (isViewed ? 0.85 : 1),
        cursor: 'pointer',
        position: 'relative',
        background: darkMode ? '#1e293b' : '#ffffff',
        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '12px',
        marginBottom: '20px',
        boxShadow: isViewed
          ? '0 4px 12px rgba(0,0,0,0.08)'
          : '0 8px 25px rgba(139, 92, 246, 0.12)',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px) scale(1.02)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = darkMode
          ? '0 20px 40px rgba(0,0,0,0.3)'
          : '0 20px 40px rgba(139, 92, 246, 0.15)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = isViewed ? 'scale(0.98)' : 'scale(1)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = isViewed
          ? '0 4px 12px rgba(0,0,0,0.08)'
          : '0 8px 25px rgba(139, 92, 246, 0.12)';
      }}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        style={{
          position: 'absolute',
          top: '18px',
          left: '18px',
          width: '18px',
          height: '18px',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          zIndex: 10,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = 'rgba(139, 92, 246, 0.2)';
          (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = 'rgba(139, 92, 246, 0.1)';
          (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
        }}
        onClick={(e) => e.stopPropagation()}
      >
        ⋮⋮
      </div>

      {/* Gradient background overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #8b5cf6, #6366f1, #06b6d4, #10b981)',
        borderRadius: '16px 16px 0 0',
      }} />

      <input
        type="checkbox"
        checked={selectedQuestions.includes(question.id)}
        onChange={(e) => {
          // Synthesize a MouseEvent to match the onSelect prop signature
          const event = {
            ...e,
            stopPropagation: () => e.stopPropagation(),
            preventDefault: () => e.preventDefault(),
            currentTarget: e.currentTarget,
            target: e.target,
            nativeEvent: e.nativeEvent,
            bubbles: e.bubbles,
            cancelable: e.cancelable,
            defaultPrevented: e.defaultPrevented,
            eventPhase: e.eventPhase,
            isTrusted: e.isTrusted,
            timeStamp: e.timeStamp,
            type: e.type,
          } as unknown as React.MouseEvent;
          onSelect(event);
        }}
        style={{
          position: 'absolute',
          left: 60,
          top: 20,
          zIndex: 2,
          transform: 'scale(1.2)',
          accentColor: '#8b5cf6',
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Viewed indicator */}
      {isViewed && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          fontSize: '1.4rem',
          color: '#10b981',
          animation: 'pulse 2s infinite',
          filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))',
        }}>
          👁️
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', marginTop: '8px', marginLeft: '40px' }}>
        <div style={{
          fontSize: '2rem',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          animation: isOpen ? 'bounce 0.6s ease-in-out' : 'none',
        }}>
          {difficultyEmoji}
        </div>
        <div className="question-title" style={{
          flex: 1,
          color: darkMode ? '#f1f5f9' : '#1e293b',
          fontSize: '1.2rem',
          fontWeight: '600',
          lineHeight: '1.4',
        }}>
          {question.question}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', marginLeft: '40px' }}>
        <span className={`category-tag ${CATEGORY_COLORS[categoryKey as keyof typeof CATEGORY_COLORS] || ''}`} style={{
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: '600',
          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {question.category}
        </span>
        {isViewed && (
          <span style={{
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '0.75rem',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            VIEWED
          </span>
        )}
      </div>

      <button
        className="button secondary"
        style={{
          float: 'right',
          marginLeft: 10,
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '12px',
          fontSize: '0.85rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
        }}
        onClick={onDelete}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
        }}
      >
        🗑️ Delete
      </button>

      {isOpen && (
        <div style={{
          marginTop: '20px',
          textAlign: 'left',
          padding: '20px',
          background: darkMode ? '#334155' : '#f8fafc',
          borderRadius: '12px',
          border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
          animation: 'slideDown 0.4s ease',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Answer section background pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60px',
            height: '60px',
            background: 'linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
            borderRadius: '50%',
          }} />

          <div style={{ marginBottom: '16px', position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}>
              <span style={{ fontSize: '1.2rem' }}>💡</span>
              <strong style={{
                color: '#10b981',
                fontSize: '1rem',
                fontWeight: '600',
              }}>
                Answer:
              </strong>
            </div>
            <span style={{
              color: darkMode ? '#f1f5f9' : '#1e293b',
              marginLeft: '28px',
              fontSize: '1rem',
              lineHeight: '1.5',
            }}>
              {question.answer}
            </span>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}>
              <span style={{ fontSize: '1.2rem' }}>📖</span>
              <strong style={{
                color: '#8b5cf6',
                fontSize: '1rem',
                fontWeight: '600',
              }}>
                Explanation:
              </strong>
            </div>
            <div style={{
              color: darkMode ? '#f1f5f9' : '#1e293b',
              marginLeft: '28px',
              fontSize: '1rem',
              lineHeight: '1.6',
            }} dangerouslySetInnerHTML={{ __html: question.explanation }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard; 