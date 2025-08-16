import React, { useState, useEffect } from 'react';
import { Text, Icon } from '@fluentui/react';
import { ModernSection } from './ModernSection';
import { CheckmarkCircle20Regular, Clock20Regular, ChatBubblesQuestion20Regular, PersonFeedback20Regular } from '@fluentui/react-icons';

interface ChatLiveGuidancePanelProps {
  pendingTasks: string;
  completedTasks: string;
  isProcessing?: boolean;
  currentViewMode?: 'unified' | 'progress' | 'kanban' | 'chat';
  onViewModeChange?: (mode: 'unified' | 'progress' | 'kanban' | 'chat') => void;
}

interface TaskMessage {
  id: string;
  text: string;
  status: 'pending' | 'completed';
  answer?: string;
  timestamp: Date;
  type: 'question' | 'answer';
}

export const ChatLiveGuidancePanel: React.FC<ChatLiveGuidancePanelProps> = ({
  pendingTasks,
  completedTasks,
  isProcessing = false,
  currentViewMode = 'chat',
  onViewModeChange
}) => {
  const [chatMessages, setChatMessages] = useState<TaskMessage[]>([]);
  const [showTimestamps, setShowTimestamps] = useState(false);

  useEffect(() => {
    const parseTaskText = (text: string, status: 'pending' | 'completed'): TaskMessage[] => {
      if (!text || text.trim() === '') return [];
      
      const lines = text.split('\n').filter(line => line.trim() !== '');
      const messages: TaskMessage[] = [];
      
      lines.forEach((line, index) => {
        const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
        const answerMatch = line.match(/(.*?)\s*-\s*(.*)/);
        
        // Add the question
        messages.push({
          id: `${status}-question-${index}`,
          text: answerMatch ? answerMatch[1].trim() : cleanLine,
          status,
          timestamp: new Date(Date.now() + index * 1000),
          type: 'question'
        });

        // Add the answer if it exists
        if (answerMatch && status === 'completed') {
          messages.push({
            id: `${status}-answer-${index}`,
            text: answerMatch[2].trim(),
            status,
            timestamp: new Date(Date.now() + index * 1000 + 500),
            type: 'answer',
            answer: answerMatch[2].trim()
          });
        }
      });
      
      return messages;
    };

    const pending = parseTaskText(pendingTasks, 'pending');
    const completed = parseTaskText(completedTasks, 'completed');
    
    // Combine and sort by timestamp
    const allMessages = [...pending, ...completed].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    setChatMessages(allMessages);
  }, [pendingTasks, completedTasks]);

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: TaskMessage, index: number) => {
    const isQuestion = message.type === 'question';
    const isCompleted = message.status === 'completed';
    
    return (
      <div
        key={message.id}
        className={`chat-message ${isQuestion ? 'question' : 'answer'} ${message.status}`}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-md)',
          animation: `chatSlideIn 0.3s ease-out ${index * 0.1}s both`
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: isQuestion ? 'var(--color-primary)' : (isCompleted ? 'var(--accent-green)' : 'var(--accent-orange)'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {isQuestion ? (
            <ChatBubblesQuestion20Regular style={{ color: 'white', fontSize: '16px' }} />
          ) : (
            <PersonFeedback20Regular style={{ color: 'white', fontSize: '16px' }} />
          )}
        </div>

        {/* Message Bubble */}
        <div
          style={{
            maxWidth: '70%',
            backgroundColor: isQuestion ? 'var(--color-primary)' : 'var(--bg-secondary)',
            color: isQuestion ? 'var(--text-on-primary)' : 'var(--text-primary)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: isQuestion ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
            border: isQuestion ? 'none' : `1px solid ${isCompleted ? 'var(--accent-green)' : 'var(--accent-orange)'}`,
            position: 'relative',
            boxShadow: 'var(--shadow-sm)',
            textDecoration: isCompleted && isQuestion ? 'line-through' : 'none',
            opacity: isCompleted && isQuestion ? 0.7 : 1
          }}
        >
          <Text
            variant="medium"
            style={{
              color: 'inherit',
              lineHeight: '1.4'
            }}
          >
            {message.text}
          </Text>

          {/* Timestamp */}
          {showTimestamps && (
            <Text
              variant="tiny"
              style={{
                color: isQuestion ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)',
                fontSize: '10px',
                marginTop: '4px',
                display: 'block'
              }}
            >
              {formatTime(message.timestamp)}
            </Text>
          )}

          {/* Status indicator for questions */}
          {isQuestion && (
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                right: '12px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: isCompleted ? 'var(--accent-green)' : 'var(--accent-orange)',
                border: '2px solid var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isCompleted ? (
                <CheckmarkCircle20Regular style={{ color: 'white', fontSize: '10px' }} />
              ) : (
                <Clock20Regular style={{ color: 'white', fontSize: '10px' }} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const pendingCount = chatMessages.filter(msg => msg.status === 'pending' && msg.type === 'question').length;
  const completedCount = chatMessages.filter(msg => msg.status === 'completed' && msg.type === 'question').length;
  const totalQuestions = pendingCount + completedCount;

  return (
    <div className="modern-section fade-in">
      <div className="modern-section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left side: Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <span>💬 Live Guidance Chat</span>
          </div>

          {/* Middle: View Mode Buttons */}
          {onViewModeChange && (
            <div style={{ 
              display: 'flex',
              gap: 'var(--spacing-xs)',
              backgroundColor: 'var(--bg-secondary)',
              padding: 'var(--spacing-xs)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {[
                { key: 'unified', label: '🎯', title: 'Unified View' },
                { key: 'progress', label: '📊', title: 'Progress View' },
                { key: 'kanban', label: '📋', title: 'Kanban Board' },
                { key: 'chat', label: '💬', title: 'Chat Style' }
              ].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => onViewModeChange(mode.key as any)}
                  title={mode.title}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: currentViewMode === mode.key ? 'var(--color-primary)' : 'transparent',
                    color: currentViewMode === mode.key ? 'var(--text-on-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{mode.label}</span>
                  <span style={{ fontSize: '11px' }}>{mode.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Right side: Stats, Toggle, and Processing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            {/* Conversation Stats */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckmarkCircle20Regular style={{ color: 'var(--accent-green)', fontSize: '14px' }} />
                <Text variant="small">{completedCount}</Text>
              </div>
              <Text variant="small" style={{ color: 'var(--text-secondary)' }}>of</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ChatBubblesQuestion20Regular style={{ color: 'var(--color-primary)', fontSize: '14px' }} />
                <Text variant="small">{totalQuestions}</Text>
              </div>
              <Text variant="small" style={{ color: 'var(--text-secondary)' }}>
                ({totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0}%)
              </Text>
            </div>

            <button
              onClick={() => setShowTimestamps(!showTimestamps)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-primary)',
                backgroundColor: showTimestamps ? 'var(--color-primary)' : 'var(--bg-secondary)',
                color: showTimestamps ? 'var(--text-on-primary)' : 'var(--text-primary)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🕒 Time
            </button>

            {/* Processing Indicator */}
            {isProcessing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div className="chat-typing-dots">
                  <div className="chat-dot"></div>
                  <div className="chat-dot"></div>
                  <div className="chat-dot"></div>
                </div>
                <Text variant="small" style={{ color: 'var(--text-secondary)' }}>
                  AI is thinking...
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="modern-section-content">
        <div className="chat-container">
        {chatMessages.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--spacing-xl)',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '2px dashed var(--border-primary)'
            }}
          >
            <ChatBubblesQuestion20Regular style={{ fontSize: '48px', marginBottom: 'var(--spacing-md)' }} />
            <Text variant="mediumPlus" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              Live Guidance Chat Ready
            </Text>
            <Text variant="medium" style={{ marginTop: '4px' }}>
              Your conversation will appear here as an interactive guidance chat
            </Text>
          </div>
        ) : (
          <div
            className="chat-messages"
            style={{
              maxHeight: '500px',
              overflowY: 'auto',
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-primary)'
            }}
          >
            {chatMessages.map((message, index) => renderMessage(message, index))}
            
            {/* Scroll to bottom indicator */}
            <div style={{ height: '1px' }} />
          </div>
        )}

        {/* Chat Footer */}
        {chatMessages.length > 0 && (
          <div
            style={{
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              textAlign: 'center'
            }}
          >
            <Text variant="small" style={{ color: 'var(--text-secondary)' }}>
              💡 Live guidance updates automatically as your conversation progresses
            </Text>
          </div>
        )}
      </div>

      <style>{`
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: var(--bg-tertiary);
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: var(--border-primary);
          border-radius: 3px;
        }

        .chat-typing-dots {
          display: flex;
          gap: 3px;
          align-items: center;
        }

        .chat-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: var(--accent-blue);
          animation: chatTyping 1.4s infinite ease-in-out;
        }

        .chat-dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .chat-dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes chatSlideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes chatTyping {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .chat-message:hover .chat-message-bubble {
          transform: scale(1.02);
        }

        @media (max-width: 768px) {
          .chat-message {
            flex-direction: column;
            align-items: stretch;
          }

          .chat-message .chat-message-bubble {
            max-width: 100%;
          }
        }
      `}</style>
      </div>
    </div>
  );
};
