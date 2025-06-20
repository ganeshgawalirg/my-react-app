import React, { useState, useEffect, useRef } from 'react';
import PhoneVerification from './PhoneVerification'; // Import the new component
import AddJobForm from './AddJobForm'; // Import AddJobForm
import JobsList from './JobsList'; // Import JobsList
import TestView from './TestView'; // Import TestView
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const CATEGORY_COLORS = {
  easy: 'category-easy',
  medium: 'category-medium',
  hard: 'category-hard',
  tricky: 'category-tricky',
  java: 'category-java',
  'spring boot': 'category-spring\\ boot',
  docker: 'category-docker',
  redis: 'category-redis',
  multitenancy: 'category-multitenancy',
  microservices: 'category-microservices',
};

const DIFFICULTY_EMOJIS = {
  'Easy': '🟢',
  'Medium': '🟡', 
  'Hard': '🔴',
  'Tricky': '🟣',
  'Java': '☕',
  'Spring Boot': '🌱',
  'Docker': '🐳',
  'Redis': '🔴',
  'Multitenancy': '🏢',
  'Microservices': '🔗'
};

// Sortable Question Component
interface SortableQuestionProps {
  question: any;
  isOpen: boolean;
  isViewed: boolean;
  selectedQuestions: string[];
  darkMode: boolean;
  onToggle: () => void;
  onSelect: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  updateStudyStreak: (id: string) => void;
  DIFFICULTY_EMOJIS: any;
  CATEGORY_COLORS: any;
}

const SortableQuestion = ({ 
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
  CATEGORY_COLORS
}: SortableQuestionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
        e.currentTarget.style.boxShadow = darkMode 
          ? '0 20px 40px rgba(0,0,0,0.3)' 
          : '0 20px 40px rgba(139, 92, 246, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = isViewed ? 'scale(0.98)' : 'scale(1)';
        e.currentTarget.style.boxShadow = isViewed 
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
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
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
        borderRadius: '16px 16px 0 0'
      }} />
      
      <input
        type="checkbox"
        checked={selectedQuestions.includes(question.id)}
        onChange={(e) => onSelect(e as any)}
        style={{ 
          position: 'absolute', 
          left: 60, 
          top: 20, 
          zIndex: 2,
          transform: 'scale(1.2)',
          accentColor: '#8b5cf6'
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
          filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))'
        }}>
          👁️
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', marginTop: '8px', marginLeft: '40px' }}>
        <div style={{
          fontSize: '2rem',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          animation: isOpen ? 'bounce 0.6s ease-in-out' : 'none'
        }}>
          {difficultyEmoji}
        </div>
        <div className="question-title" style={{ 
          flex: 1,
          color: darkMode ? '#f1f5f9' : '#1e293b',
          fontSize: '1.2rem',
          fontWeight: '600',
          lineHeight: '1.4'
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
          letterSpacing: '0.5px'
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
            letterSpacing: '0.5px'
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
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
        }}
        onClick={onDelete}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
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
          overflow: 'hidden'
        }}>
          {/* Answer section background pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60px',
            height: '60px',
            background: 'linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
            borderRadius: '50%'
          }} />
          
          <div style={{ marginBottom: '16px', position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '1.2rem' }}>💡</span>
              <strong style={{ 
                color: '#10b981', 
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                Answer:
              </strong>
            </div>
            <span style={{ 
              color: darkMode ? '#f1f5f9' : '#1e293b', 
              marginLeft: '28px',
              fontSize: '1rem',
              lineHeight: '1.5'
            }}>
              {question.answer}
            </span>
          </div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '1.2rem' }}>📖</span>
              <strong style={{ 
                color: '#8b5cf6', 
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                Explanation:
              </strong>
            </div>
            <div style={{ 
              color: darkMode ? '#f1f5f9' : '#1e293b', 
              marginLeft: '28px',
              fontSize: '1rem',
              lineHeight: '1.6'
            }} dangerouslySetInnerHTML={{ __html: question.explanation }} />
          </div>
        </div>
      )}
    </div>
  );
};

// Define the Job type
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  technologies: string[];
  applyLink: string;
}

function App() {
  const [isVerified, setIsVerified] = useState(false); // New state for verification
  // State definitions
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState<{
    id: string | null,
    question: string,
    answer: string,
    explanation: string,
    category: string
  }>({
        id: null,
        question: '',
        answer: '',
        explanation: '',
    category: 'Easy'
      });
      const [showForm, setShowForm] = useState(false);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
      const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
      const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState({ text: '', type: 'info' });
  const messageTimeoutRef = useRef<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDifficulty, setSortDifficulty] = useState('All');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 20;
  const [darkMode, setDarkMode] = useState(false);
  const [studyStreak, setStudyStreak] = useState(0);
  const [lastStudyDate, setLastStudyDate] = useState<string | null>(null);
  const [viewedQuestions, setViewedQuestions] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [learningPath, setLearningPath] = useState<string>('beginner');
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(10);
  const [todayProgress, setTodayProgress] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showSpacedRepetition, setShowSpacedRepetition] = useState(false);
  const [difficultyProgress, setDifficultyProgress] = useState({
    Easy: 0,
    Medium: 0,
    Hard: 0,
    Tricky: 0
  });
  const [showJobNotifications, setShowJobNotifications] = useState(false);
  const [jobNotifications, setJobNotifications] = useState<any[]>([]);
  const [notificationFilter, setNotificationFilter] = useState('All');
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsFetched, setJobsFetched] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [customOrder, setCustomOrder] = useState<any[]>([]);
  const [isCustomOrder, setIsCustomOrder] = useState(false);
  const [dragMode, setDragMode] = useState(false);

  // New states for Jobs feature
  const [view, setView] = useState('questions'); // 'questions' or 'jobs'
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showAddJobForm, setShowAddJobForm] = useState(false);

  // New states for Test feature
  const [isTestMode, setIsTestMode] = useState(false);
  const [activeTestQuestions, setActiveTestQuestions] = useState<any[]>([]);

  // Drag and Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load questions from localStorage or questions.json
      useEffect(() => {
    const stored = localStorage.getItem('questions');
    if (stored) {
      setQuestions(JSON.parse(stored));
      setLoading(false);
    } else {
    fetch('/questions.json')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => {
          // If questions.json doesn't exist, use default sample questions
          const sampleQuestions = [
            {
              id: 'q_1',
              question: 'What is the difference between == and .equals() in Java?',
              answer: '== compares object references, while .equals() compares object content',
              explanation: '<strong>== Operator:</strong> Compares the memory addresses of two objects. Returns true only if both variables point to the same object in memory.<br><br><strong>.equals() Method:</strong> Compares the actual content/values of objects. Can be overridden to provide custom comparison logic.<br><br><strong>Example:</strong><br>String s1 = "Hello";<br>String s2 = new String("Hello");<br>s1 == s2; // false (different objects)<br>s1.equals(s2); // true (same content)',
              category: 'Java'
            },
            {
              id: 'q_2',
              question: 'Explain the concept of Multithreading in Java',
              answer: 'Multithreading allows multiple threads to execute concurrently within a single process',
              explanation: '<strong>Multithreading</strong> is a programming concept where multiple threads run concurrently within a single process.<br><br><strong>Key Concepts:</strong><br>• <strong>Thread:</strong> Lightweight sub-process that shares the same memory space<br>• <strong>Concurrency:</strong> Multiple threads executing simultaneously<br>• <strong>Thread Safety:</strong> Ensuring data consistency across threads<br><br><strong>Benefits:</strong><br>• Better resource utilization<br>• Improved responsiveness<br>• Parallel processing capabilities<br><br><strong>Implementation:</strong><br>1. Extend Thread class<br>2. Implement Runnable interface<br>3. Use ExecutorService framework',
              category: 'Java'
            },
            {
              id: 'q_3',
              question: 'What is Spring Boot and its advantages?',
              answer: 'Spring Boot is a framework that simplifies Spring application development with auto-configuration',
              explanation: '<strong>Spring Boot</strong> is an opinionated framework that simplifies Spring application development.<br><br><strong>Key Advantages:</strong><br>• <strong>Auto-configuration:</strong> Automatically configures beans based on classpath<br>• <strong>Embedded Servers:</strong> Built-in Tomcat, Jetty, or Undertow<br>• <strong>Starter Dependencies:</strong> Simplified dependency management<br>• <strong>Actuator:</strong> Production-ready features for monitoring<br>• <strong>No XML Configuration:</strong> Convention over configuration<br><br><strong>Example:</strong><br>@SpringBootApplication<br>public class MyApp {<br>&nbsp;&nbsp;public static void main(String[] args) {<br>&nbsp;&nbsp;&nbsp;&nbsp;SpringApplication.run(MyApp.class, args);<br>&nbsp;&nbsp;}<br>}',
              category: 'Spring Boot'
            },
            {
              id: 'q_4',
              question: 'What are Microservices and their benefits?',
              answer: 'Microservices are small, independent services that communicate over a network',
              explanation: '<strong>Microservices</strong> is an architectural style where an application is built as a collection of small, independent services.<br><br><strong>Key Benefits:</strong><br>• <strong>Scalability:</strong> Scale individual services independently<br>• <strong>Technology Diversity:</strong> Use different technologies for different services<br>• <strong>Fault Isolation:</strong> Failure in one service doesn\'t affect others<br>• <strong>Team Autonomy:</strong> Teams can work independently<br>• <strong>Deployment Flexibility:</strong> Deploy services independently<br><br><strong>Communication Patterns:</strong><br>• REST APIs<br>• Message Queues (Kafka, RabbitMQ)<br>• gRPC<br>• Event-driven architecture',
              category: 'Microservices'
            },
            {
              id: 'q_5',
              question: 'Explain Docker containers and their advantages',
              answer: 'Docker containers are lightweight, portable units that package applications with their dependencies',
              explanation: '<strong>Docker Containers</strong> are lightweight, standalone packages that include everything needed to run an application.<br><br><strong>Key Advantages:</strong><br>• <strong>Portability:</strong> Run anywhere Docker is installed<br>• <strong>Consistency:</strong> Same environment across development, testing, production<br>• <strong>Isolation:</strong> Applications don\'t interfere with each other<br>• <strong>Efficiency:</strong> Share OS kernel, use less resources than VMs<br>• <strong>Version Control:</strong> Track changes to container images<br><br><strong>Docker Commands:</strong><br>• docker build -t myapp .<br>• docker run -p 8080:8080 myapp<br>• docker ps<br>• docker-compose up',
              category: 'Docker'
            },
            {
              id: 'q_6',
              question: 'What is Redis and when to use it?',
              answer: 'Redis is an in-memory data structure store used as a database, cache, and message broker',
              explanation: '<strong>Redis</strong> is an open-source, in-memory data structure store that can be used as a database, cache, and message broker.<br><br><strong>Use Cases:</strong><br>• <strong>Caching:</strong> Store frequently accessed data in memory<br>• <strong>Session Storage:</strong> Store user sessions<br>• <strong>Real-time Analytics:</strong> Track metrics and counters<br>• <strong>Message Broker:</strong> Pub/sub messaging<br>• <strong>Leaderboards:</strong> Sorted sets for rankings<br><br><strong>Data Structures:</strong><br>• Strings<br>• Lists<br>• Sets<br>• Sorted Sets<br>• Hashes<br><br><strong>Advantages:</strong><br>• Extremely fast (in-memory)<br>• Rich data structures<br>• Atomic operations<br>• Persistence options',
              category: 'Redis'
            },
            {
              id: 'q_7',
              question: 'What is the difference between HashMap and ConcurrentHashMap?',
              answer: 'HashMap is not thread-safe, while ConcurrentHashMap is thread-safe for concurrent access',
              explanation: '<strong>HashMap:</strong><br>• Not thread-safe<br>• Allows null keys and values<br>• Better performance for single-threaded applications<br>• Can cause ConcurrentModificationException in multi-threaded scenarios<br><br><strong>ConcurrentHashMap:</strong><br>• Thread-safe<br>• Does not allow null keys or values<br>• Uses segment-level locking for better concurrency<br>• Designed for high-concurrency scenarios<br><br><strong>Performance Comparison:</strong><br>• HashMap: O(1) average case for get/put<br>• ConcurrentHashMap: Slightly slower due to synchronization<br><br><strong>When to Use:</strong><br>• HashMap: Single-threaded applications<br>• ConcurrentHashMap: Multi-threaded applications requiring thread safety',
              category: 'Java'
            },
            {
              id: 'q_8',
              question: 'Explain JPA and Hibernate relationship',
              answer: 'JPA is a specification, Hibernate is the most popular implementation of JPA',
              explanation: '<strong>JPA (Java Persistence API):</strong><br>• A specification for object-relational mapping<br>• Defines standard annotations and APIs<br>• Vendor-independent<br>• Part of Java EE<br><br><strong>Hibernate:</strong><br>• Most popular JPA implementation<br>• Provides additional features beyond JPA<br>• Offers better performance optimizations<br>• Rich ecosystem and community support<br><br><strong>Key Annotations:</strong><br>• @Entity<br>• @Table<br>• @Column<br>• @Id<br>• @GeneratedValue<br>• @OneToMany, @ManyToOne<br><br><strong>Benefits:</strong><br>• Database independence<br>• Object-oriented approach<br>• Automatic SQL generation<br>• Caching capabilities',
              category: 'Spring Boot'
            },
            {
              id: 'q_9',
              question: 'What is the CAP theorem in distributed systems?',
              answer: 'CAP theorem states that a distributed system can only guarantee two out of three properties: Consistency, Availability, and Partition tolerance',
              explanation: '<strong>CAP Theorem</strong> states that it\'s impossible for a distributed data store to simultaneously provide more than two out of three guarantees:<br><br><strong>Consistency (C):</strong><br>• All nodes see the same data at the same time<br>• Data is consistent across all replicas<br><br><strong>Availability (A):</strong><br>• Every request receives a response<br>• System continues to operate despite failures<br><br><strong>Partition Tolerance (P):</strong><br>• System continues to operate despite network partitions<br>• Network delays or failures don\'t cause system failure<br><br><strong>Trade-offs:</strong><br>• <strong>CA:</strong> Traditional databases (MySQL, PostgreSQL)<br>• <strong>CP:</strong> MongoDB, HBase<br>• <strong>AP:</strong> Cassandra, DynamoDB',
              category: 'Microservices'
            },
            {
              id: 'q_10',
              question: 'What is Kubernetes and its main components?',
              answer: 'Kubernetes is a container orchestration platform that automates deployment, scaling, and management of containerized applications',
              explanation: '<strong>Kubernetes</strong> is an open-source container orchestration platform for automating deployment, scaling, and management of containerized applications.<br><br><strong>Main Components:</strong><br><strong>Master Components:</strong><br>• <strong>API Server:</strong> Frontend for Kubernetes control plane<br>• <strong>etcd:</strong> Distributed key-value store for cluster data<br>• <strong>Scheduler:</strong> Assigns pods to nodes<br>• <strong>Controller Manager:</strong> Runs controller processes<br><br><strong>Node Components:</strong><br>• <strong>Kubelet:</strong> Agent that runs on each node<br>• <strong>Kube-proxy:</strong> Network proxy for pod communication<br>• <strong>Container Runtime:</strong> Docker, containerd, etc.<br><br><strong>Key Concepts:</strong><br>• Pods<br>• Services<br>• Deployments<br>• Namespaces<br>• ConfigMaps and Secrets',
              category: 'Docker'
            }
          ];
          setQuestions(sampleQuestions);
            setLoading(false);
      });
    }
      }, []);

  // Save questions to localStorage whenever they change
  useEffect(() => {
    if (!loading && questions.length > 0) {
      localStorage.setItem('questions', JSON.stringify(questions));
    }
  }, [questions, loading]);

  // Load and save jobs from/to localStorage
  useEffect(() => {
    const storedJobs = localStorage.getItem('jobs');
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  // Study streak tracking
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('studyData');
    const studyData = stored ? JSON.parse(stored) : { streak: 0, lastDate: null, viewed: [] };
    
    setStudyStreak(studyData.streak || 0);
    setLastStudyDate(studyData.lastDate);
    setViewedQuestions(studyData.viewed || []);
  }, []);

  // Update study streak when questions are viewed
  const updateStudyStreak = (questionId: string) => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('studyData');
    const studyData = stored ? JSON.parse(stored) : { streak: 0, lastDate: null, viewed: [] };
    
    let newStreak = studyData.streak || 0;
    const lastDate = studyData.lastDate;
    
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastDate === yesterdayStr) {
        newStreak += 1;
      } else if (lastDate !== today) {
        newStreak = 1;
      }
    }
    
    const newViewed = studyData.viewed.includes(questionId) ? studyData.viewed : [...studyData.viewed, questionId];
    
    const newStudyData = {
      streak: newStreak,
      lastDate: today,
      viewed: newViewed
    };
    
    localStorage.setItem('studyData', JSON.stringify(newStudyData));
    setStudyStreak(newStreak);
    setLastStudyDate(today);
    setViewedQuestions(newViewed);
    
    // Update today's progress
    setTodayProgress(prev => prev + 1);
    
    // Check for achievements
    checkAchievements(newStreak, newViewed.length);
    
    // Trigger confetti for milestone streaks
    if (newStreak % 5 === 0 && newStreak > 0) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
  };

  // AI-powered achievement system
  const checkAchievements = (streak: number, viewedCount: number) => {
    const newAchievements: string[] = [];
    
    if (streak >= 1 && !achievements.includes('First Day')) {
      newAchievements.push('First Day');
    }
    if (streak >= 7 && !achievements.includes('Week Warrior')) {
      newAchievements.push('Week Warrior');
    }
    if (streak >= 30 && !achievements.includes('Monthly Master')) {
      newAchievements.push('Monthly Master');
    }
    if (viewedCount >= 50 && !achievements.includes('Knowledge Seeker')) {
      newAchievements.push('Knowledge Seeker');
    }
    if (viewedCount >= 100 && !achievements.includes('Question Crusher')) {
      newAchievements.push('Question Crusher');
    }
    if (viewedCount >= 200 && !achievements.includes('Interview Expert')) {
      newAchievements.push('Interview Expert');
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      setShowAchievements(true);
      setTimeout(() => setShowAchievements(false), 5000);
    }
  };

  // AI-powered smart recommendations
  const getAIRecommendations = () => {
    const viewedCount = viewedQuestions.length;
    const totalQuestions = questions.length;
    const completionRate = (viewedCount / totalQuestions) * 100;
    
    // Calculate difficulty progress
    const difficultyCounts = questions.reduce((acc, q) => {
      if (viewedQuestions.includes(q.id)) {
        acc[q.category] = (acc[q.category] || 0) + 1;
      }
      return acc;
    }, {} as any);
    
    setDifficultyProgress(difficultyCounts);
    
    // Generate AI insights
    const insights = {
      nextRecommended: getNextRecommendedQuestions(),
      weakAreas: getWeakAreas(),
      learningPath: getOptimalLearningPath(),
      estimatedTime: Math.ceil((totalQuestions - viewedCount) / dailyGoal),
      confidence: Math.min(completionRate + studyStreak * 2, 100)
    };
    
    setAiInsights(insights);
  };

  // Get next recommended questions based on learning pattern
  const getNextRecommendedQuestions = () => {
    const unviewed = questions.filter(q => !viewedQuestions.includes(q.id));
    const viewedCategories = questions
      .filter(q => viewedQuestions.includes(q.id))
      .map(q => q.category);
    
    // Prioritize categories with fewer viewed questions
    const categoryCounts = viewedCategories.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as any);
    
    return unviewed
      .sort((a, b) => (categoryCounts[a.category] || 0) - (categoryCounts[b.category] || 0))
      .slice(0, 5);
  };

  // Identify weak areas
  const getWeakAreas = () => {
    const categoryCounts = questions.reduce((acc, q) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {} as any);
    
    const viewedCategoryCounts = questions
      .filter(q => viewedQuestions.includes(q.id))
      .reduce((acc, q) => {
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
      }, {} as any);
    
    return Object.keys(categoryCounts)
      .map(category => ({
        category,
        progress: ((viewedCategoryCounts[category] || 0) / categoryCounts[category]) * 100
      }))
      .sort((a, b) => a.progress - b.progress)
      .slice(0, 3);
  };

  // Get optimal learning path
  const getOptimalLearningPath = () => {
    const weakAreas = getWeakAreas();
    const path = ['Java', 'Spring Boot', 'Microservices', 'Docker', 'Redis', 'Multitenancy'];
    
    return path.filter(category => 
      weakAreas.some(weak => weak.category === category && weak.progress < 50)
    );
  };

  // Spaced repetition algorithm
  const getSpacedRepetitionQuestions = () => {
    const today = new Date();
    const viewedData = localStorage.getItem('viewedQuestionsData') || '{}';
    const viewedDataObj = JSON.parse(viewedData);
    
    return Object.keys(viewedDataObj)
      .filter(questionId => {
        const lastViewed = new Date(viewedDataObj[questionId].lastViewed);
        const daysSince = Math.floor((today.getTime() - lastViewed.getTime()) / (1000 * 60 * 60 * 24));
        const repetitionInterval = viewedDataObj[questionId].repetitionCount || 1;
        
        // Spaced repetition intervals: 1, 3, 7, 14, 30 days
        const intervals = [1, 3, 7, 14, 30];
        const targetInterval = intervals[Math.min(repetitionInterval - 1, intervals.length - 1)];
        
        return daysSince >= targetInterval;
      })
      .map(questionId => questions.find(q => q.id === questionId))
      .filter(Boolean)
      .slice(0, 10);
  };

  // Shuffle questions function
  const shuffleQuestions = () => {
    const filtered = questions.filter(q => {
      const search = searchTerm.trim().toLowerCase();
      const matchesSearch =
        q.question.toLowerCase().includes(search) ||
        q.answer.toLowerCase().includes(search) ||
        q.explanation.toLowerCase().includes(search);
      const matchesDifficulty =
        sortDifficulty === 'All' ||
        (q.category && q.category.toLowerCase() === sortDifficulty.toLowerCase());
      return matchesSearch && matchesDifficulty;
    });
    
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setIsShuffled(true);
    setCurrentPage(1);
    setMessage({ text: 'Questions shuffled! 🎲', type: 'success' });
  };

  // Reset shuffle function
  const resetShuffle = () => {
    setIsShuffled(false);
    setShuffledQuestions([]);
    setCurrentPage(1);
    setMessage({ text: 'Questions order reset to original! 🔄', type: 'info' });
  };

  // Dark mode effect
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#1a1a1a' : '#ffffff';
    document.body.style.color = darkMode ? '#ffffff' : '#000000';
  }, [darkMode]);

  // Message box class
      const messageBoxClass = message.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' :
                             message.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
                             'bg-blue-100 border-blue-400 text-blue-700';

  // Filtered and sorted questions
  const filteredQuestions = questions.filter(q => {
    // Search filter
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      q.question.toLowerCase().includes(search) ||
      q.answer.toLowerCase().includes(search) ||
      q.explanation.toLowerCase().includes(search);
    // Difficulty filter
    const matchesDifficulty =
      sortDifficulty === 'All' ||
      (q.category && q.category.toLowerCase() === sortDifficulty.toLowerCase());
    return matchesSearch && matchesDifficulty;
  });

  // Use shuffled questions if available, otherwise use filtered questions
  const displayQuestions = isShuffled && shuffledQuestions.length > 0 
    ? shuffledQuestions 
    : isCustomOrder && customOrder.length > 0 
    ? customOrder 
    : filteredQuestions;

  // Pagination logic
  const totalPages = Math.ceil(displayQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = displayQuestions.slice(startIndex, endIndex);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
    // Reset shuffle and custom order when search or filter changes
    if (isShuffled) {
      setIsShuffled(false);
      setShuffledQuestions([]);
    }
    if (isCustomOrder) {
      setIsCustomOrder(false);
      setCustomOrder([]);
    }
    setDragMode(false);
  }, [searchTerm, sortDifficulty]);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Restore handleInputChange and handleSubmit
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewQuestion({ ...newQuestion, [name]: value });
      };
  const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    if (!newQuestion.question || !newQuestion.answer || !newQuestion.explanation || !newQuestion.category) {
      setMessage({ text: 'Please fill all fields.', type: 'error' });
          return;
        }
    const newId = `q_${Date.now()}`;
    setQuestions(prev => [
      ...prev,
      { ...newQuestion, id: newId }
    ]);
          setNewQuestion({ id: null, question: '', answer: '', explanation: '', category: 'Easy' });
          setShowForm(false);
    setMessage({ text: 'Question added successfully!', type: 'success' });
  };

  // Handler for single delete
  const handleSingleDelete = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    setSelectedQuestions(prev => prev.filter(qid => qid !== id));
    setMessage({ text: 'Question deleted successfully!', type: 'success' });
  };

  // Handler for select/deselect
  const handleSelect = (id: string) => {
    setSelectedQuestions(prev =>
      prev.includes(id) ? prev.filter(qid => qid !== id) : [...prev, id]
    );
  };

  // Handler for delete selected
  const handleDeleteSelected = () => {
    if (selectedQuestions.length === 0) return;
    setQuestions(prev => prev.filter(q => !selectedQuestions.includes(q.id)));
    setSelectedQuestions([]);
    setMessage({ text: 'Selected questions deleted successfully!', type: 'success' });
  };

  // Handler for reset to defaults
  const handleResetToDefaults = () => {
    localStorage.removeItem('questions');
    setLoading(true);
    fetch('/questions.json')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
        setMessage({ text: 'Reset to default questions.', type: 'success' });
      })
      .catch(() => {
        setLoading(false);
        setError('Failed to reload default questions.');
      });
    setSelectedQuestions([]);
    setOpenQuestionId(null);
  };

  // Drag end handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = displayQuestions.findIndex((item) => item.id === active.id);
      const newIndex = displayQuestions.findIndex((item) => item.id === over?.id);

      const newOrder = arrayMove(displayQuestions, oldIndex, newIndex);
      
      if (isShuffled) {
        setShuffledQuestions(newOrder);
      } else if (isCustomOrder) {
        setCustomOrder(newOrder);
      } else {
        setCustomOrder(newOrder);
        setIsCustomOrder(true);
      }
      
      setMessage({ text: 'Question order updated! 🎯', type: 'success' });
    }
  };

  // Enable drag mode
  const enableDragMode = () => {
    setDragMode(true);
    if (!isCustomOrder && !isShuffled) {
      setCustomOrder([...displayQuestions]);
      setIsCustomOrder(true);
    }
    setMessage({ text: 'Drag mode enabled! 🖱️ Drag questions to reorder', type: 'info' });
  };

  // Disable drag mode
  const disableDragMode = () => {
    setDragMode(false);
    setMessage({ text: 'Drag mode disabled! 📝', type: 'info' });
  };

  // Reset to original order
  const resetToOriginalOrder = () => {
    setIsCustomOrder(false);
    setIsShuffled(false);
    setCustomOrder([]);
    setShuffledQuestions([]);
    setDragMode(false);
    setCurrentPage(1);
    setMessage({ text: 'Questions reset to original order! 🔄', type: 'success' });
  };

  const fetchJobNotifications = async () => {
    if (jobsFetched) return; // Don't fetch if already fetched

    setJobsLoading(true);
    setJobsError(null); // Reset error on new fetch
    
    try {
      // Fetch from the local proxy server
      const response = await fetch('http://localhost:3001/api/jobs');
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Network response was not ok');
      }

      if (data && data.jobs_results) {
        const formattedJobs = data.jobs_results.map((job: any, index: number) => ({
          id: job.job_id || index,
          title: job.title,
          company: job.company_name,
          type: job.detected_extensions?.schedule_type || 'N/A',
          location: job.location,
          salary: job.detected_extensions?.salary,
          technologies: job.description.match(/Java|Spring Boot|Microservices|Docker|Kubernetes|Kafka|Redis/gi) || [],
          description: job.description.substring(0, 150) + '...', // Shorten description
          applyUrl: job.apply_options?.[0]?.link || '#',
          postedDate: job.detected_extensions?.posted_at || '',
          isNew: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000) < new Date(job.detected_extensions?.posted_at_timestamp * 1000)
        }));
        setJobNotifications(formattedJobs);
        setJobsFetched(true);
      } else {
        setJobNotifications([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch job notifications:", error);
      setJobsError(`Failed to fetch jobs: ${error.message}. Please check your API key in the .env file and ensure the proxy server is running.`);
      setJobNotifications([]); // Ensure it's empty on error
    } finally {
      setJobsLoading(false);
    }
  };

  // Handlers for Jobs feature
  const handleAddJob = (newJobData: Omit<Job, 'id'>) => {
    const newJob: Job = {
      id: `job_${Date.now()}`,
      ...newJobData,
    };
    setJobs(prevJobs => [...prevJobs, newJob]);
    setMessage({ text: 'Job added successfully!', type: 'success' });
  };

  const handleDeleteJob = (id: string) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    setMessage({ text: 'Job deleted successfully!', type: 'success' });
  };

  // Handlers for Test feature
  const handleCreateTest = () => {
    if (selectedQuestions.length === 0) {
      setMessage({ text: 'Please select questions to create a test.', type: 'error' });
      return;
    }
    const testQuestions = questions.filter(q => selectedQuestions.includes(q.id));
    setActiveTestQuestions(testQuestions);
    setIsTestMode(true);
  };

  const handleFinishTest = () => {
    setIsTestMode(false);
    setActiveTestQuestions([]);
    setSelectedQuestions([]); // Clear selection after test
    setMessage({ text: 'Test finished. Welcome back!', type: 'info' });
  };

  if (isTestMode) {
    return (
      <TestView
        questions={activeTestQuestions}
        onFinishTest={handleFinishTest}
        darkMode={darkMode}
        DIFFICULTY_EMOJIS={DIFFICULTY_EMOJIS}
      />
    );
  }

  if (!isVerified) {
    return <PhoneVerification onVerified={() => setIsVerified(true)} darkMode={darkMode} />;
  }

  // Render
  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Confetti Animation */}
      {confetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: Math.random() * 100 + '%',
                top: -10,
                width: '10px',
                height: '10px',
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)],
                borderRadius: '50%',
                animation: `confetti-fall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: Math.random() * 2 + 's'
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="header" style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #64748b 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '16px',
        marginBottom: '24px',
        boxShadow: darkMode 
          ? '0 12px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)' 
          : '0 12px 24px rgba(102, 126, 234, 0.2), 0 0 0 1px rgba(255,255,255,0.2)',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: '80px',
          height: '80px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
          backdropFilter: 'blur(5px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: -20,
          left: -20,
          width: '60px',
          height: '60px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
          backdropFilter: 'blur(5px)'
        }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '2rem', 
              fontWeight: '700',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              background: 'linear-gradient(45deg, #ffffff, #f1f5f9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.01em',
              lineHeight: '1.2'
            }}>
              🚀 Java Interview Prep
        </h1>
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="auth-status" style={{ 
                fontSize: '0.9rem', 
                opacity: 0.95,
                background: 'rgba(255,255,255,0.15)',
                padding: '6px 12px',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                👤 {userId || 'Guest User'}
              </span>
              <span style={{ 
                fontSize: '0.9rem', 
                opacity: 0.95,
                background: 'rgba(255,255,255,0.15)',
                padding: '6px 12px',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                📚 {viewedQuestions.length} of {questions.length} viewed
              </span>
              <span style={{ 
                fontSize: '0.9rem', 
                opacity: 0.95,
                background: 'rgba(255,255,255,0.15)',
                padding: '6px 12px',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                🎯 {Math.round((viewedQuestions.length / Math.max(questions.length, 1)) * 100)}% complete
              </span>
              {/* View Toggler */}
              <div className="view-toggler">
                <button onClick={() => setView('questions')} className={view === 'questions' ? 'active' : ''}>Questions</button>
                <button onClick={() => setView('jobs')} className={view === 'jobs' ? 'active' : ''}>Jobs</button>
              </div>
          </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowStats(!showStats)}
              style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              📊 Stats
            </button>
            <button
              onClick={() => {
                setShowAIRecommendations(!showAIRecommendations);
                if (!showAIRecommendations) {
                  getAIRecommendations();
                }
              }}
              style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              🤖 AI Insights
            </button>
            <button
              onClick={() => setShowLearningPath(!showLearningPath)}
              style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              🛤️ Learning Path
            </button>
            <button
              onClick={() => {
                setShowJobNotifications(!showJobNotifications);
                if (!showJobNotifications) {
                  fetchJobNotifications();
                }
              }}
              style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              💼 Job Alerts
              {jobNotifications.filter(n => n.isNew).length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  animation: 'pulse 2s infinite',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                }}>
                  {jobNotifications.filter(n => n.isNew).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.4rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Rendering based on View */}
      {view === 'questions' ? (
        <>
          {/* Stats Panel */}
          {showStats && (
            <div style={{
              background: darkMode ? '#2d2d2d' : '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: darkMode ? '1px solid #444' : '1px solid #e9ecef',
              animation: 'slideDown 0.3s ease'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: darkMode ? '#fff' : '#333' }}>📈 Your Study Progress</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{
                  background: darkMode ? '#3d3d3d' : '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: darkMode ? '1px solid #555' : '1px solid #e0e0e0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔥</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff6b6b' }}>{studyStreak}</div>
                  <div style={{ fontSize: '0.9rem', color: darkMode ? '#ccc' : '#666' }}>Day Streak</div>
                </div>
                <div style={{
                  background: darkMode ? '#3d3d3d' : '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: darkMode ? '1px solid #555' : '1px solid #e0e0e0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📚</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ecdc4' }}>{viewedQuestions.length}</div>
                  <div style={{ fontSize: '0.9rem', color: darkMode ? '#ccc' : '#666' }}>Questions Viewed</div>
                </div>
                <div style={{
                  background: darkMode ? '#3d3d3d' : '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: darkMode ? '1px solid #555' : '1px solid #e0e0e0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#45b7d1' }}>{Math.round((viewedQuestions.length / questions.length) * 100)}%</div>
                  <div style={{ fontSize: '0.9rem', color: darkMode ? '#ccc' : '#666' }}>Completion</div>
                </div>
                <div style={{
                  background: darkMode ? '#3d3d3d' : '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: darkMode ? '1px solid #555' : '1px solid #e0e0e0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⭐</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#feca57' }}>{Math.floor(studyStreak / 5)}</div>
                  <div style={{ fontSize: '0.9rem', color: darkMode ? '#ccc' : '#666' }}>Milestones</div>
                </div>
              </div>
            </div>
          )}

          {/* AI Insights Panel */}
          {showAIRecommendations && aiInsights && (
            <div style={{
              background: darkMode ? '#2d2d2d' : '#f8f9fa',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '24px',
              border: darkMode ? '1px solid #444' : '1px solid #e9ecef',
              animation: 'slideDown 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* AI Background Pattern */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: 'linear-gradient(45deg, transparent 30%, rgba(102, 126, 234, 0.1) 50%, transparent 70%)',
                animation: 'float 4s ease-in-out infinite'
              }} />
              
              <h3 style={{ 
                margin: '0 0 20px 0', 
                color: darkMode ? '#fff' : '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🤖 AI-Powered Learning Insights
                <span style={{
                  padding: '4px 12px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  LIVE
                </span>
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Confidence Score */}
                <div style={{
                  background: darkMode ? '#3d3d3d' : '#fff',
                  padding: '20px',
                  borderRadius: '12px',
                  border: darkMode ? '1px solid #555' : '1px solid #e0e0e0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎯</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea', marginBottom: '8px' }}>
                    {aiInsights.confidence}%
                  </div>
                  <div style={{ fontSize: '1rem', color: darkMode ? '#ccc' : '#666', marginBottom: '12px' }}>
                    Interview Confidence
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: darkMode ? '#555' : '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${aiInsights.confidence}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #667eea, #764ba2)',
                      borderRadius: '4px',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                </div>

                {/* Weak Areas */}
                <div style={{
                  background: darkMode ? '#3d3d3d' : '#fff',
                  padding: '20px',
                  borderRadius: '12px',
                  border: darkMode ? '1px solid #555' : '1px solid #e0e0e0'
                }}>
                  <h4 style={{ margin: '0 0 16px 0', color: darkMode ? '#fff' : '#333' }}>🔍 Focus Areas</h4>
                  {aiInsights.weakAreas.map((area: any, index: number) => (
                    <div key={area.category} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: darkMode ? '#ccc' : '#666' }}>{area.category}</span>
                        <span style={{ color: '#ff6b6b', fontWeight: '600' }}>{Math.round(area.progress)}%</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        background: darkMode ? '#555' : '#e0e0e0',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${area.progress}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #ff6b6b, #ff5252)',
                          borderRadius: '3px',
                          transition: 'width 1s ease'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next Recommendations */}
                <div style={{
                  background: darkMode ? '#3d3d3d' : '#fff',
                  padding: '20px',
                  borderRadius: '12px',
                  border: darkMode ? '1px solid #555' : '1px solid #e0e0e0'
                }}>
                  <h4 style={{ margin: '0 0 16px 0', color: darkMode ? '#fff' : '#333' }}>🚀 Next Steps</h4>
                  <div style={{ fontSize: '0.9rem', color: darkMode ? '#ccc' : '#666', marginBottom: '12px' }}>
                    Estimated completion: {aiInsights.estimatedTime} days
                  </div>
                  {aiInsights.nextRecommended.slice(0, 3).map((q: any, index: number) => (
                    <div key={q.id} style={{
                      padding: '8px 12px',
                      background: darkMode ? '#4d4d4d' : '#f8f9fa',
                      borderRadius: '6px',
                      marginBottom: '8px',
                      border: darkMode ? '1px solid #666' : '1px solid #e0e0e0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? '#5d5d5d' : '#e9ecef'}
                    onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? '#4d4d4d' : '#f8f9fa'}
                    onClick={() => {
                      setOpenQuestionId(q.id);
                      updateStudyStreak(q.id);
                    }}>
                      <div style={{ fontWeight: '600', color: darkMode ? '#fff' : '#333', marginBottom: '4px' }}>
                        {q.question.substring(0, 60)}...
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#667eea' }}>
                        {q.category} • Click to study
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Learning Path Panel */}
          {showLearningPath && (
            <div style={{
              background: darkMode ? '#2d2d2d' : '#f8f9fa',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '24px',
              border: darkMode ? '1px solid #444' : '1px solid #e9ecef',
              animation: 'slideDown 0.3s ease'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: darkMode ? '#fff' : '#333' }}>🛤️ Your Learning Journey</h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                {['Java', 'Spring Boot', 'Microservices', 'Docker', 'Redis', 'Multitenancy'].map((category, index) => {
                  const progress = (questions.filter(q => q.category === category && viewedQuestions.includes(q.id)).length / 
                                   questions.filter(q => q.category === category).length) * 100;
                  const isCompleted = progress >= 80;
                  const isInProgress = progress > 0 && progress < 80;
                  
                  return (
                    <div key={category} style={{
                      background: darkMode ? '#3d3d3d' : '#fff',
                      padding: '16px',
                      borderRadius: '12px',
                      border: darkMode ? '1px solid #555' : '1px solid #e0e0e0',
                      textAlign: 'center',
                      minWidth: '150px',
                      position: 'relative',
                      transform: isCompleted ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                      boxShadow: isCompleted ? '0 4px 20px rgba(102, 126, 234, 0.3)' : 'none'
                    }}>
                      {isCompleted && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#28a745',
                          color: 'white',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem'
                        }}>
                          ✓
                        </div>
                      )}
                      
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                        {DIFFICULTY_EMOJIS[category as keyof typeof DIFFICULTY_EMOJIS] || '📚'}
                      </div>
                      <div style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: '600', 
                        color: darkMode ? '#fff' : '#333',
                        marginBottom: '8px'
                      }}>
                        {category}
                      </div>
                      <div style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: '600', 
                        color: darkMode ? '#fff' : '#333',
                        marginBottom: '8px'
                      }}>
                        {Math.round(progress)}%
                      </div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        background: darkMode ? '#555' : '#e0e0e0',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        marginTop: '8px'
                      }}>
                        <div style={{
                          width: `${progress}%`,
                          height: '100%',
                          background: isCompleted 
                            ? 'linear-gradient(90deg, #10b981, #059669)' 
                            : isInProgress 
                            ? 'linear-gradient(90deg, #f59e0b, #f97316)' 
                            : 'linear-gradient(90deg, #6b7280, #9ca3af)',
                          borderRadius: '3px',
                          transition: 'width 1s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Job Notifications Panel */}
          {showJobNotifications && (
            <div style={{
              background: darkMode ? '#1a1a2e' : '#f8fafc',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '24px',
              border: darkMode ? '1px solid #2d3748' : '1px solid #e2e8f0',
              animation: 'slideDown 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Notification Background Pattern */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: 'linear-gradient(45deg, transparent 30%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)',
                animation: 'float 4s ease-in-out infinite'
              }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                <h3 style={{ 
                  margin: 0, 
                  color: darkMode ? '#f1f5f9' : '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  💼 Job & Test Opportunities
                  <span style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                  }}>
                    {jobNotifications.filter(n => n.isNew).length} NEW
                  </span>
                </h3>
                
                {/* Filter buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['All', 'Java', 'Spring Boot', 'Docker', 'Microservices', 'Kafka'].map((tech) => (
                    <button
                      key={tech}
                      onClick={() => setNotificationFilter(tech)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                        background: notificationFilter === tech 
                          ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' 
                          : darkMode ? '#334155' : '#ffffff',
                        color: notificationFilter === tech ? 'white' : darkMode ? '#cbd5e1' : '#475569',
                        border: notificationFilter === tech ? 'none' : darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                        boxShadow: notificationFilter === tech ? '0 4px 12px rgba(139, 92, 246, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        if (notificationFilter !== tech) {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (notificationFilter !== tech) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }
                      }}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
              
              {jobsLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                  <span className="text-lg text-blue-700 font-semibold">Fetching live job postings...</span>
                </div>
              ) : jobsError ? (
                <div style={{
                  textAlign: 'center', 
                  padding: '40px', 
                  color: darkMode ? '#ff8a8a' : '#ef4444',
                  background: darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 1)',
                  borderRadius: '12px',
                  border: `1px solid ${darkMode ? '#ef4444' : '#fca5a5'}`
                }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: '600' }}>⚠️ Oops! Something went wrong.</h4>
                  <p>{jobsError}</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
                    {jobNotifications
                      .filter(notification => 
                        notificationFilter === 'All' || 
                        notification.technologies.some((tech: string) => tech.toLowerCase() === notificationFilter.toLowerCase())
                      )
                      .map((notification) => (
                        <div key={notification.id} style={{
                          background: darkMode ? '#1e293b' : '#ffffff',
                          padding: '20px',
                          borderRadius: '12px',
                          border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          transform: notification.isNew ? 'scale(1.02)' : 'scale(1)',
                          boxShadow: notification.isNew ? '0 8px 25px rgba(139, 92, 246, 0.15)' : '0 4px 12px rgba(0,0,0,0.08)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = notification.isNew ? 'scale(1.02)' : 'scale(1)';
                          e.currentTarget.style.boxShadow = notification.isNew ? '0 8px 25px rgba(139, 92, 246, 0.15)' : '0 4px 12px rgba(0,0,0,0.08)';
                        }}
                      >
                        {/* New badge */}
                        {notification.isNew && (
                          <div style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            animation: 'pulse 2s infinite',
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                          }}>
                            NEW
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ 
                              margin: '0 0 8px 0', 
                              color: darkMode ? '#f1f5f9' : '#1e293b',
                              fontSize: '1.1rem',
                              fontWeight: '600'
                            }}>
                              {notification.title}
                            </h4>
                            <div style={{ 
                              fontSize: '0.9rem', 
                              color: '#8b5cf6', 
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              {notification.company}
                            </div>
                            <div style={{ 
                              fontSize: '0.8rem', 
                              color: darkMode ? '#94a3b8' : '#64748b',
                              display: 'flex',
                              gap: '12px',
                              flexWrap: 'wrap'
                            }}>
                              <span>📍 {notification.location}</span>
                              <span>💼 {notification.type}</span>
                              {notification.salary && <span>💰 {notification.salary}</span>}
                              {notification.duration && <span>⏱️ {notification.duration}</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ 
                            fontSize: '0.9rem', 
                            color: darkMode ? '#cbd5e1' : '#475569',
                            lineHeight: '1.4'
                          }}>
                            {notification.description}
                          </div>
                        </div>
                        
                        {/* Technology tags */}
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                          {notification.technologies.map((tech: string) => (
                            <span key={tech} style={{
                              padding: '4px 8px',
                              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                              color: 'white',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: '500',
                              boxShadow: '0 2px 4px rgba(6, 182, 212, 0.3)'
                            }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                        
                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => window.open(notification.applyUrl, '_blank')}
                            style={{
                              flex: 1,
                              padding: '10px 16px',
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                            }}
                          >
                            {notification.type === 'Assessment' || notification.type === 'Test' ? '🎯 Take Test' : '📝 Apply Now'}
                          </button>
                          
                          <button
                            onClick={() => {
                              setJobNotifications(prev => 
                                prev.map(n => 
                                  n.id === notification.id ? { ...n, isNew: false } : n
                                )
                              );
                            }}
                            style={{
                              padding: '10px 12px',
                              background: darkMode ? '#475569' : '#f1f5f9',
                              color: darkMode ? '#cbd5e1' : '#64748b',
                              border: darkMode ? '1px solid #64748b' : '1px solid #e2e8f0',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? '#64748b' : '#e2e8f0'}
                            onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? '#475569' : '#f1f5f9'}
                          >
                            ✓ Mark Read
                          </button>
                        </div>
                        
                        <div style={{ 
                          fontSize: '0.7rem', 
                          color: darkMode ? '#94a3b8' : '#9ca3af',
                          marginTop: '8px',
                          textAlign: 'right'
                        }}>
                          Posted: {new Date(notification.postedDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {jobNotifications.filter(notification => 
                    notificationFilter === 'All' || 
                    notification.technologies.some((tech: string) => tech.toLowerCase() === notificationFilter.toLowerCase())
                  ).length === 0 && (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '40px', 
                      color: darkMode ? '#94a3b8' : '#64748b',
                      fontSize: '1.1rem'
                    }}>
                      🎯 No opportunities found for "{notificationFilter}". Try a different filter or check back later!
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Achievement Notifications */}
          {showAchievements && (
            <div style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              padding: '16px 20px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
              zIndex: 1000,
              animation: 'slideDown 0.3s ease',
              maxWidth: '300px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '2rem' }}>🏆</div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Achievement Unlocked!</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    {achievements[achievements.length - 1]}
                  </div>
                </div>
              </div>
            </div>
          )}

            {/* Custom Message Box */}
            {message.text && (
              <div className={`p-4 mb-6 rounded-xl border-2 shadow-lg ${messageBoxClass} transition-opacity duration-500 flex items-center gap-3 opacity-100 animate-fadeInOut`}> 
                <span className={`inline-block w-3 h-3 rounded-full ${message.type === 'success' ? 'bg-green-400' : message.type === 'error' ? 'bg-red-400' : 'bg-blue-400'}`}></span>
                <p className="font-semibold text-lg">{message.text}</p>
                  </div>
                )}

                {/* Add/Edit Question Form and Create Test Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button className="button" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Close Form' : 'Add New Question'}
            </button>
            {selectedQuestions.length > 0 && view === 'questions' && (
                <button className="button" onClick={handleCreateTest}>
                    Create Test ({selectedQuestions.length} questions)
                </button>
            )}
      </div>

            {showForm && (
        <form className="question-form" onSubmit={handleSubmit}>
          <label htmlFor="question">Question:</label>
                        <input
                          id="question"
                          name="question"
              type="text"
                        value={newQuestion.question}
                        onChange={handleInputChange}
                          placeholder="Enter question"
                          required
                        />

              <label htmlFor="answer">Answer:</label>
              <input
                          id="answer"
                          name="answer"
              type="text"
                        value={newQuestion.answer}
                        onChange={handleInputChange}
                          placeholder="Enter answer"
                          required
              />

              <label htmlFor="explanation">Explanation (HTML/Markdown supported):</label>
                        <textarea
                          id="explanation"
                          name="explanation"
                        value={newQuestion.explanation}
                        onChange={handleInputChange}
                          placeholder="Enter detailed explanation"
                          required
              />
              <span className="field-note">Supports HTML and Markdown formatting</span>

              <label htmlFor="category">Category:</label>
                        <select
                          id="category"
                          name="category"
                        value={newQuestion.category}
                        onChange={handleInputChange}
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

              <div>
                <button type="button" className="button secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="button">
                  Add Question
                </button>
                      </div>
            </form>
          )}

          {/* Search and Filter Section */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                placeholder="🔍 Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '10px 14px',
                  border: darkMode ? '1px solid #555' : '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  backgroundColor: darkMode ? '#3d3d3d' : '#fff',
                  color: darkMode ? '#fff' : '#333',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#007bff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = darkMode ? '#555' : '#ddd';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }}
              />
              
              <select
                value={sortDifficulty}
                onChange={(e) => setSortDifficulty(e.target.value)}
                style={{
                  padding: '10px 12px',
                  border: darkMode ? '1px solid #555' : '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  backgroundColor: darkMode ? '#3d3d3d' : '#fff',
                  color: darkMode ? '#fff' : '#333',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  minWidth: '120px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <option value="All">🏷️ All Difficulties</option>
                <option value="Easy">🟢 Easy</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Hard">🔴 Hard</option>
              </select>
              
              <select
                value={isShuffled ? 'random' : 'number'}
                onChange={(e) => {
                  if (e.target.value === 'random') {
                    shuffleQuestions();
                  } else {
                    resetToOriginalOrder();
                  }
                }}
                style={{
                  padding: '10px 12px',
                  border: darkMode ? '1px solid #555' : '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  backgroundColor: darkMode ? '#3d3d3d' : '#fff',
                  color: darkMode ? '#fff' : '#333',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  minWidth: '140px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <option value="number">📊 By Number</option>
                <option value="difficulty">🏷️ By Difficulty</option>
                <option value="viewed">👁️ By Viewed</option>
                <option value="random">🎲 Random</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
              onClick={shuffleQuestions}
              style={{
                padding: '10px 14px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              🎲 Shuffle
                        </button>
              
                        <button
              onClick={resetToOriginalOrder}
              style={{
                padding: '10px 14px',
                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              🔄 Reset
                        </button>
              
              <button
                onClick={() => setDragMode(!dragMode)}
                style={{
                  padding: '10px 14px',
                  background: dragMode 
                    ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)' 
                    : 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {dragMode ? '✋ Exit Drag' : '🖱️ Drag Mode'}
              </button>
              
              {selectedQuestions.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  style={{
                    padding: '10px 14px',
                    background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  🗑️ Delete ({selectedQuestions.length})
                </button>
              )}
              
              <button
                onClick={handleResetToDefaults}
                style={{
                  padding: '10px 14px',
                  background: 'linear-gradient(135deg, #6c757d, #495057)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                ⚙️ Reset to Defaults
              </button>
                </div>
            </div>

          {/* Modern Filter System */}
          <div style={{
            background: darkMode ? '#2d2d2d' : '#f8f9fa',
            padding: '20px',
            borderRadius: '16px',
            marginBottom: '24px',
            border: darkMode ? '1px solid #444' : '1px solid #e9ecef',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '16px',
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                color: darkMode ? '#fff' : '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🏷️ Filter by Category:
              </span>
              <button
                onClick={() => setSortDifficulty('All')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  background: sortDifficulty === 'All' 
                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                    : darkMode ? '#3d3d3d' : '#fff',
                  color: sortDifficulty === 'All' ? 'white' : darkMode ? '#ccc' : '#666',
                  border: sortDifficulty === 'All' ? 'none' : darkMode ? '1px solid #555' : '1px solid #e0e0e0',
                  boxShadow: sortDifficulty === 'All' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
                  transform: sortDifficulty === 'All' ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (sortDifficulty !== 'All') {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sortDifficulty !== 'All') {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                🌟 All Categories
              </button>
                </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
              gap: '12px',
              maxWidth: '800px'
            }}>
              {[
                { name: 'Easy', emoji: '🟢', color: '#28a745' },
                { name: 'Medium', emoji: '🟡', color: '#ffc107' },
                { name: 'Hard', emoji: '🔴', color: '#dc3545' },
                { name: 'Tricky', emoji: '🟣', color: '#6f42c1' },
                { name: 'Java', emoji: '☕', color: '#fd7e14' },
                { name: 'Spring Boot', emoji: '🌱', color: '#20c997' },
                { name: 'Microservices', emoji: '🔗', color: '#17a2b8' },
                { name: 'Docker', emoji: '🐳', color: '#0d6efd' },
                { name: 'Redis', emoji: '🔴', color: '#e74c3c' },
                { name: 'Multitenancy', emoji: '🏢', color: '#9c27b0' }
              ].map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSortDifficulty(category.name)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    background: sortDifficulty === category.name 
                      ? `linear-gradient(135deg, ${category.color}, ${category.color}dd)` 
                      : darkMode ? '#3d3d3d' : '#fff',
                    color: sortDifficulty === category.name ? 'white' : darkMode ? '#ccc' : '#333',
                    border: sortDifficulty === category.name ? 'none' : darkMode ? '1px solid #555' : '1px solid #e0e0e0',
                    boxShadow: sortDifficulty === category.name 
                      ? `0 4px 16px ${category.color}40` 
                      : '0 2px 8px rgba(0,0,0,0.1)',
                    transform: sortDifficulty === category.name ? 'scale(1.05)' : 'scale(1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (sortDifficulty !== category.name) {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (sortDifficulty !== category.name) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }
                  }}
                >
                  {/* Shimmer effect for active state */}
                  {sortDifficulty === category.name && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: 'shimmer 2s infinite'
                    }} />
                  )}
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>{category.emoji}</span>
                    <span>{category.name}</span>
                    {sortDifficulty === category.name && (
                      <span style={{ 
                        fontSize: '0.8rem',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        marginLeft: 'auto'
                      }}>
                        ✓
                            </span>
                    )}
                  </div>
                  
                  {/* Question count badge */}
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: category.color,
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    minWidth: '20px',
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {questions.filter(q => q.category === category.name).length}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Active filter indicator */}
            {sortDifficulty !== 'All' && (
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: darkMode ? '#3d3d3d' : '#fff',
                borderRadius: '8px',
                border: darkMode ? '1px solid #555' : '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '1rem' }}>🎯</span>
                <span style={{ 
                  color: darkMode ? '#fff' : '#333',
                  fontWeight: '500'
                }}>
                  Currently showing: <strong>{sortDifficulty}</strong> questions
                </span>
                            <button
                  onClick={() => setSortDifficulty('All')}
                  style={{
                    marginLeft: 'auto',
                    padding: '4px 8px',
                    background: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ff5252'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ff6b6b'}
                >
                  Clear Filter
                            </button>
              </div>
            )}
          </div>

          {/* Daily Goal Tracker */}
          <div style={{
            background: darkMode ? '#2d2d2d' : '#f8f9fa',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '16px',
            border: darkMode ? '1px solid #444' : '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.1rem' }}>🎯</span>
              <div>
                <div style={{ fontWeight: '600', color: darkMode ? '#fff' : '#333', fontSize: '0.95rem' }}>
                  Daily Goal: {todayProgress}/{dailyGoal} questions
                </div>
                <div style={{ fontSize: '0.8rem', color: darkMode ? '#ccc' : '#666' }}>
                  {Math.max(0, dailyGoal - todayProgress)} more to reach your goal
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '100px',
                height: '6px',
                background: darkMode ? '#555' : '#e0e0e0',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(100, (todayProgress / dailyGoal) * 100)}%`,
                  height: '100%',
                  background: todayProgress >= dailyGoal ? '#28a745' : 'linear-gradient(90deg, #667eea, #764ba2)',
                  borderRadius: '3px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <span style={{ 
                fontSize: '0.85rem', 
                fontWeight: '600',
                color: todayProgress >= dailyGoal ? '#28a745' : '#667eea',
                minWidth: '35px'
              }}>
                {Math.round((todayProgress / dailyGoal) * 100)}%
              </span>
            </div>
            
                            <button
              onClick={() => setShowSpacedRepetition(!showSpacedRepetition)}
              style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              🔄 Spaced Repetition
                            </button>
            </div>

            {/* Spaced Repetition Panel */}
            {showSpacedRepetition && (
              <div style={{
                background: darkMode ? '#2d2d2d' : '#f8f9fa',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                border: darkMode ? '1px solid #444' : '1px solid #e9ecef',
                animation: 'slideDown 0.3s ease'
              }}>
                <h4 style={{ margin: '0 0 16px 0', color: darkMode ? '#fff' : '#333' }}>
                  🔄 Spaced Repetition - Reinforce Your Learning
                </h4>
                <div style={{ fontSize: '0.9rem', color: darkMode ? '#ccc' : '#666', marginBottom: '16px' }}>
                  These questions are due for review based on optimal learning intervals
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                  {getSpacedRepetitionQuestions().slice(0, 6).map((q: any) => (
                    <div key={q.id} style={{
                      background: darkMode ? '#3d3d3d' : '#fff',
                      padding: '12px',
                      borderRadius: '8px',
                      border: darkMode ? '1px solid #555' : '1px solid #e0e0e0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    onClick={() => {
                      setOpenQuestionId(q.id);
                      updateStudyStreak(q.id);
                    }}>
                      <div style={{ fontWeight: '600', color: darkMode ? '#fff' : '#333', marginBottom: '4px' }}>
                        {q.question.substring(0, 50)}...
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#4ecdc4' }}>
                        {q.category} • Due for review
                      </div>
                    </div>
                  ))}
                </div>
                
                {getSpacedRepetitionQuestions().length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: darkMode ? '#ccc' : '#666' }}>
                    🎉 Great job! No questions due for review today.
                  </div>
                )}
              </div>
            )}

            {/* Question Count Display */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              margin: '16px 0',
              padding: '16px 20px',
              backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
              borderRadius: '12px',
              border: darkMode ? '1px solid #444' : '1px solid #e9ecef',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>📊</span>
                  <span style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    color: darkMode ? '#fff' : '#495057'
                  }}>
                    Total: <span style={{ color: '#007bff' }}>{questions.length}</span>
                            </span>
                          </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>👁️</span>
                  <span style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    color: darkMode ? '#fff' : '#495057'
                  }}>
                    Viewed: <span style={{ color: '#28a745' }}>{viewedQuestions.length}</span>
                  </span>
                          </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🎯</span>
                  <span style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    color: darkMode ? '#fff' : '#495057'
                  }}>
                    Showing: <span style={{ color: '#fd7e14' }}>{startIndex + 1}-{startIndex + currentQuestions.length} of {displayQuestions.length}</span>
                  </span>
                </div>
                {totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>📄</span>
                    <span style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600',
                      color: darkMode ? '#fff' : '#495057'
                    }}>
                      Page: <span style={{ color: '#6f42c1' }}>{currentPage}</span> of <span style={{ color: '#6f42c1' }}>{totalPages}</span>
                    </span>
                            </div>
                          )}
                      </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {searchTerm && (
                  <span style={{ 
                    padding: '6px 12px', 
                    backgroundColor: darkMode ? '#3d3d3d' : '#e3f2fd', 
                    color: darkMode ? '#4ecdc4' : '#1976d2',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    border: darkMode ? '1px solid #555' : '1px solid #bbdefb'
                  }}>
                    🔍 "{searchTerm}"
                  </span>
                )}
                {sortDifficulty !== 'All' && (
                  <span style={{ 
                    padding: '6px 12px', 
                    backgroundColor: darkMode ? '#3d3d3d' : '#f3e5f5', 
                    color: darkMode ? '#d1b3ff' : '#7b1fa2',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    border: darkMode ? '1px solid #555' : '1px solid #e1bee7'
                  }}>
                    🏷️ {sortDifficulty}
                  </span>
                )}
                {isShuffled && (
                  <span style={{ 
                    padding: '6px 12px', 
                    backgroundColor: darkMode ? '#3d3d3d' : '#fff3cd', 
                    color: darkMode ? '#ffd54f' : '#856404',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    border: darkMode ? '1px solid #555' : '1px solid #ffeaa7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    🎲 Shuffled
                  </span>
                )}
                {isCustomOrder && (
                  <span style={{ 
                    padding: '6px 12px', 
                    backgroundColor: darkMode ? '#3d3d3d' : '#e3f2fd', 
                    color: darkMode ? '#4ecdc4' : '#1976d2',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    border: darkMode ? '1px solid #555' : '1px solid #bbdefb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    🖱️ Custom Order
                  </span>
                )}
                {dragMode && (
                  <span style={{ 
                    padding: '6px 12px', 
                    backgroundColor: darkMode ? '#3d3d3d' : '#fce4ec', 
                    color: darkMode ? '#ff80ab' : '#c2185b',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    border: darkMode ? '1px solid #555' : '1px solid #f8bbd9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    🖱️ Drag Mode
                  </span>
                )}
                        </div>
            </div>

            {/* Questions List */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentQuestions.map(q => q.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="questions-list">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                      <span className="text-lg text-blue-700 font-semibold">Loading questions...</span>
                    </div>
                  ) : error ? (
                    <div className="bg-red-100 border-2 border-red-400 text-red-700 p-6 rounded-xl text-center font-bold text-lg">Error: {error}</div>
                  ) : displayQuestions.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">No questions found. Try a different search or filter!</p>
                  ) : (
                    currentQuestions.map((q) => {
                      const categoryKey = typeof q.category === 'string' ? q.category.toLowerCase() : '';
                      const isOpen = openQuestionId === q.id;
                      const isViewed = viewedQuestions.includes(q.id);
                      const difficultyEmoji = DIFFICULTY_EMOJIS[q.category as keyof typeof DIFFICULTY_EMOJIS] || '❓';
                      
                      return (
                        <SortableQuestion
                          key={q.id}
                          question={q}
                          isOpen={isOpen}
                          isViewed={isViewed}
                          selectedQuestions={selectedQuestions}
                          darkMode={darkMode}
                          onToggle={() => {
                            setOpenQuestionId(isOpen ? null : q.id);
                            if (!isOpen) {
                              updateStudyStreak(q.id);
                            }
                          }}
                          onSelect={(e) => {
                            e.stopPropagation();
                            handleSelect(q.id);
                          }}
                          onDelete={(e) => {
                            e.stopPropagation();
                            handleSingleDelete(q.id);
                          }}
                          updateStudyStreak={updateStudyStreak}
                          DIFFICULTY_EMOJIS={DIFFICULTY_EMOJIS}
                          CATEGORY_COLORS={CATEGORY_COLORS}
                        />
                      );
                    })
                    )}
                  </div>
              </SortableContext>
            </DndContext>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                margin: '20px 0',
                flexWrap: 'wrap'
              }}>
                          <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  background: currentPage === 1 
                    ? (darkMode ? '#444' : '#e9ecef') 
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: currentPage === 1 
                    ? (darkMode ? '#666' : '#adb5bd') 
                    : 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: currentPage === 1 ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ← Previous
                        </button>
              
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                        <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      style={{
                        padding: '8px 12px',
                        background: currentPage === pageNum 
                          ? 'linear-gradient(135deg, #4ecdc4, #44a08d)' 
                          : (darkMode ? '#3d3d3d' : '#f8f9fa'),
                        color: currentPage === pageNum 
                          ? 'white' 
                          : (darkMode ? '#fff' : '#495057'),
                        border: currentPage === pageNum 
                          ? 'none' 
                          : (darkMode ? '1px solid #555' : '1px solid #dee2e6'),
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: currentPage === pageNum ? '600' : '500',
                        transition: 'all 0.3s ease',
                        minWidth: '36px',
                        boxShadow: currentPage === pageNum ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== pageNum) {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        if (currentPage !== pageNum) {
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {pageNum}
                        </button>
                  );
                })}
                      </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  background: currentPage === totalPages 
                    ? (darkMode ? '#444' : '#e9ecef') 
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: currentPage === totalPages 
                    ? (darkMode ? '#666' : '#adb5bd') 
                    : 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: currentPage === totalPages ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Next →
              </button>
                  </div>
                )}
          </>
        ) : (
          // Jobs View
          <div className="jobs-view">
            <div className="jobs-header">
              <h2>Job Postings</h2>
              <button className="button" onClick={() => setShowAddJobForm(true)}>
                Add New Job
              </button>
            </div>
            <JobsList jobs={jobs} darkMode={darkMode} onDeleteJob={handleDeleteJob} />
          </div>
        )}

        {/* Add Job Form Modal */}
        {showAddJobForm && (
          <AddJobForm
            onAddJob={handleAddJob}
            onClose={() => setShowAddJobForm(false)}
            darkMode={darkMode}
          />
        )}

        {/* Contact Section */}
        <footer style={{ 
          marginTop: 40, 
          padding: '32px 0 16px 0', 
          textAlign: 'center', 
          background: darkMode ? '#2d2d2d' : 'transparent', 
          color: darkMode ? '#ccc' : '#6c757d', 
          fontSize: '1rem',
          borderRadius: '16px',
          border: darkMode ? '1px solid #444' : '1px solid #e0e0e0'
        }}>
          <hr style={{ margin: '24px auto', width: '60%', border: 'none', borderTop: darkMode ? '1px solid #555' : '1px solid #e0e0e0' }} />
          
          {/* Motivational message */}
          <div style={{ 
            marginBottom: '20px',
            padding: '16px',
            background: darkMode ? '#3d3d3d' : '#f8f9fa',
            borderRadius: '12px',
            border: darkMode ? '1px solid #555' : '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
              {studyStreak > 0 ? '🔥' : '💪'} {studyStreak > 0 ? `Keep up the amazing ${studyStreak}-day streak!` : 'Ready to start your study journey?'}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              {viewedQuestions.length > 0 ? `You've already viewed ${viewedQuestions.length} questions!` : 'Click on questions to start learning!'}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.2rem' }}>🚀</span>
            <strong>Contact:</strong> For feedback or support, email
            <a href="mailto:ganesh.gawali@thinkive.com" style={{ 
              color: darkMode ? '#4ecdc4' : '#4a6bff', 
              marginLeft: 6, 
              textDecoration: 'underline',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = darkMode ? '#45b7d1' : '#667eea'}
            onMouseLeave={(e) => e.currentTarget.style.color = darkMode ? '#4ecdc4' : '#4a6bff'}>
              ganesh.gawali@thinkive.com
            </a>
            <span style={{ fontSize: '1.2rem' }}>💻</span>
          </div>
          
          {/* Fun stats */}
          <div style={{ 
            marginTop: '16px',
            fontSize: '0.8rem',
            opacity: 0.7,
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <span>☕ Java Questions: {questions.filter(q => q.category === 'Java').length}</span>
            <span>🌱 Spring Boot: {questions.filter(q => q.category === 'Spring Boot').length}</span>
            <span>🔗 Microservices: {questions.filter(q => q.category === 'Microservices').length}</span>
            <span>🐳 Docker: {questions.filter(q => q.category === 'Docker').length}</span>
          </div>
        </footer>
          </div>
        );
}

    export default App;
