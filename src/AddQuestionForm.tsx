import React, { useState, useEffect } from 'react';
import { Question } from './QuestionCard';

/**
 * Props for AddQuestionForm component.
 */
export interface AddQuestionFormProps {
  initialQuestion?: Partial<Question>;
  onSubmit: (question: Omit<Question, 'id'>) => void;
  onCancel: () => void;
  darkMode: boolean;
}

/**
 * Renders a form for adding or editing a question.
 */
const AddQuestionForm: React.FC<AddQuestionFormProps> = ({
  initialQuestion = {},
  onSubmit,
  onCancel,
  darkMode,
}) => {
  const [question, setQuestion] = useState(initialQuestion.question || '');
  const [answer, setAnswer] = useState(initialQuestion.answer || '');
  const [explanation, setExplanation] = useState(initialQuestion.explanation || '');
  const [category, setCategory] = useState(initialQuestion.category || 'Easy');

  useEffect(() => {
    setQuestion(initialQuestion.question || '');
    setAnswer(initialQuestion.answer || '');
    setExplanation(initialQuestion.explanation || '');
    setCategory(initialQuestion.category || 'Easy');
  }, [initialQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || !explanation.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    onSubmit({
      question: question.trim(),
      answer: answer.trim(),
      explanation: explanation.trim(),
      category: category.trim(),
    });
  };

  return (
    <form className="question-form" onSubmit={handleSubmit} style={{ background: darkMode ? '#232946' : '#fff', borderRadius: 12, padding: 24, boxShadow: darkMode ? '0 2px 12px #232946' : '0 2px 12px #e0e0e0', marginBottom: 24 }}>
      <label htmlFor="question">Question:</label>
      <input
        id="question"
        name="question"
        type="text"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Enter question"
        required
        style={{ marginBottom: 12 }}
      />

      <label htmlFor="answer">Answer:</label>
      <input
        id="answer"
        name="answer"
        type="text"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="Enter answer"
        required
        style={{ marginBottom: 12 }}
      />

      <label htmlFor="explanation">Explanation (HTML/Markdown supported):</label>
      <textarea
        id="explanation"
        name="explanation"
        value={explanation}
        onChange={e => setExplanation(e.target.value)}
        placeholder="Enter detailed explanation"
        required
        style={{ marginBottom: 8 }}
      />
      <span className="field-note">Supports HTML and Markdown formatting</span>

      <label htmlFor="category">Category:</label>
      <select
        id="category"
        name="category"
        value={category}
        onChange={e => setCategory(e.target.value)}
        style={{ marginBottom: 18 }}
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
        <option>Tricky</option>
        <option>Java</option>
        <option>Spring Boot</option>
        <option>Docker</option>
        <option>Redis</option>
        <option>Multitenancy</option>
        <option>Microservices</option>
      </select>

      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <button type="button" className="button secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button">
          {initialQuestion && initialQuestion.id ? 'Update Question' : 'Add Question'}
        </button>
      </div>
    </form>
  );
};

export default AddQuestionForm; 