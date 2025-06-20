import React from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import QuestionCard, { Question } from './QuestionCard';

/**
 * Props for QuestionsList component.
 */
export interface QuestionsListProps {
  questions: Question[];
  selectedQuestions: string[];
  openQuestionId: string | null;
  viewedQuestions: string[];
  darkMode: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  updateStudyStreak: (id: string) => void;
  DIFFICULTY_EMOJIS: Record<string, string>;
  CATEGORY_COLORS: Record<string, string>;
  onDragEnd: (event: DragEndEvent) => void;
}

/**
 * Renders a list of questions with drag-and-drop, selection, and open/close logic.
 */
const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  selectedQuestions,
  openQuestionId,
  viewedQuestions,
  darkMode,
  onToggle,
  onSelect,
  onDelete,
  updateStudyStreak,
  DIFFICULTY_EMOJIS,
  CATEGORY_COLORS,
  onDragEnd,
}) => {
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
        <div className="questions-list">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              isOpen={openQuestionId === q.id}
              isViewed={viewedQuestions.includes(q.id)}
              selectedQuestions={selectedQuestions}
              darkMode={darkMode}
              onToggle={() => onToggle(q.id)}
              onSelect={(e) => { e.stopPropagation(); onSelect(q.id); }}
              onDelete={(e) => { e.stopPropagation(); onDelete(q.id); }}
              updateStudyStreak={updateStudyStreak}
              DIFFICULTY_EMOJIS={DIFFICULTY_EMOJIS}
              CATEGORY_COLORS={CATEGORY_COLORS}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default QuestionsList; 