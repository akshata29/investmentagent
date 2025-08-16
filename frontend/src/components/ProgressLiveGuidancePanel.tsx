import React, { useState, useEffect } from 'react';
import { Text, ProgressIndicator, Icon } from '@fluentui/react';
import { ModernSection } from './ModernSection';
import { CheckmarkCircle20Filled, Circle20Regular, Clock20Regular } from '@fluentui/react-icons';

interface ProgressLiveGuidancePanelProps {
  pendingTasks: string;
  completedTasks: string;
  isProcessing?: boolean;
  currentViewMode?: 'unified' | 'progress' | 'kanban' | 'chat';
  onViewModeChange?: (mode: 'unified' | 'progress' | 'kanban' | 'chat') => void;
}

interface TaskItem {
  id: string;
  text: string;
  status: 'pending' | 'completed';
  answer?: string;
  order: number;
}

export const ProgressLiveGuidancePanel: React.FC<ProgressLiveGuidancePanelProps> = ({
  pendingTasks,
  completedTasks,
  isProcessing = false,
  currentViewMode = 'progress',
  onViewModeChange
}) => {
  const [parsedTasks, setParsedTasks] = useState<TaskItem[]>([]);
  const [showAnswers, setShowAnswers] = useState(true);

  // Parse the text responses into structured task items
  useEffect(() => {
    const parseTaskText = (text: string, status: 'pending' | 'completed'): TaskItem[] => {
      if (!text || text.trim() === '') return [];
      
      const lines = text.split('\n').filter(line => line.trim() !== '');
      return lines.map((line, index) => {
        const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
        const answerMatch = line.match(/(.*?)\s*-\s*(.*)/);
        
        return {
          id: `${status}-${index}`,
          text: answerMatch ? answerMatch[1].trim() : cleanLine,
          status,
          answer: answerMatch ? answerMatch[2].trim() : undefined,
          order: index
        };
      });
    };

    const pending = parseTaskText(pendingTasks, 'pending');
    const completed = parseTaskText(completedTasks, 'completed');
    
    // Combine and sort by original order
    const allTasks = [...pending, ...completed].sort((a, b) => a.order - b.order);
    setParsedTasks(allTasks);
  }, [pendingTasks, completedTasks]);

  const completedCount = parsedTasks.filter(task => task.status === 'completed').length;
  const totalCount = parsedTasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getStatusColor = (status: 'pending' | 'completed') => {
    return status === 'completed' ? 'var(--accent-green)' : 'var(--accent-orange)';
  };

  const renderTaskItem = (task: TaskItem, index: number) => (
    <div
      key={task.id}
      className="progress-task-item"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-sm)',
        marginBottom: 'var(--spacing-xs)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: task.status === 'completed' ? 'var(--bg-success)' : 'var(--bg-warning)',
        border: `1px solid ${getStatusColor(task.status)}`,
        transition: 'all 0.3s ease',
        opacity: task.status === 'completed' ? 0.85 : 1,
        transform: task.status === 'completed' ? 'scale(0.98)' : 'scale(1)',
        animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
      }}
    >
      {/* Step Number */}
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(task.status),
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          flexShrink: 0
        }}
      >
        {task.status === 'completed' ? '✓' : index + 1}
      </div>

      {/* Task Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text
          variant="medium"
          style={{
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--text-primary)',
            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
            display: 'block'
          }}
        >
          {task.text}
        </Text>
        
        {task.answer && showAnswers && (
          <div
            style={{
              marginTop: '4px',
              padding: 'var(--spacing-xs)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: `3px solid ${getStatusColor(task.status)}`
            }}
          >
            <Text
              variant="small"
              style={{
                color: 'var(--text-secondary)',
                fontStyle: 'italic'
              }}
            >
              💡 {task.answer}
            </Text>
          </div>
        )}
      </div>

      {/* Status Icon */}
      <div style={{ flexShrink: 0 }}>
        {task.status === 'completed' ? (
          <CheckmarkCircle20Filled style={{ color: 'var(--accent-green)' }} />
        ) : (
          <Clock20Regular style={{ color: 'var(--accent-orange)' }} />
        )}
      </div>
    </div>
  );

  return (
    <div className="modern-section fade-in">
      <div className="modern-section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left side: Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <span>🎯 Live Guidance Progress</span>
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

          {/* Right side: Progress Stats, Toggle, and Processing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            {/* Progress Stats */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-sm)',
              padding: '4px 8px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-primary)'
            }}>
              <Text variant="small" style={{ color: 'var(--text-secondary)' }}>
                Progress:
              </Text>
              <Text variant="medium" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                {completedCount}/{totalCount}
              </Text>
              <Text variant="small" style={{ color: 'var(--accent-green)' }}>
                ({Math.round(progressPercentage)}%)
              </Text>
            </div>

            {/* Toggle Answers */}
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-primary)',
                backgroundColor: showAnswers ? 'var(--color-primary)' : 'var(--bg-secondary)',
                color: showAnswers ? 'var(--text-on-primary)' : 'var(--text-primary)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {showAnswers ? '🙈 Hide' : '👁️ Show'} Answers
            </button>

            {/* Processing indicator */}
            {isProcessing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div className="processing-pulse"></div>
                <Text variant="small" style={{ color: 'var(--text-secondary)' }}>
                  Analyzing...
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="modern-section-content">
      <div className="progress-guidance-content">
        {/* Overall Progress Bar */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <ProgressIndicator
            percentComplete={progressPercentage / 100}
            styles={{
              root: { marginBottom: 'var(--spacing-xs)' },
              progressBar: {
                backgroundColor: 'var(--accent-green)',
              },
              progressTrack: {
                backgroundColor: 'var(--bg-tertiary)',
              }
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="small" style={{ color: 'var(--text-secondary)' }}>
              Conversation Coverage
            </Text>
            <Text variant="small" style={{ color: 'var(--accent-green)', fontWeight: 'var(--font-weight-semibold)' }}>
              {Math.round(progressPercentage)}% Complete
            </Text>
          </div>
        </div>

        {/* Task List */}
        {parsedTasks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-xl)',
            color: 'var(--text-secondary)'
          }}>
            <Circle20Regular style={{ fontSize: '48px', marginBottom: 'var(--spacing-md)' }} />
            <Text variant="medium">
              No guidance tasks available yet.
            </Text>
            <Text variant="small" style={{ marginTop: '4px' }}>
              Start your conversation to see live guidance appear here.
            </Text>
          </div>
        ) : (
          <div className="task-progress-list">
            {parsedTasks.map((task, index) => renderTaskItem(task, index))}
          </div>
        )}

        {/* Summary Footer */}
        {parsedTasks.length > 0 && (
          <div
            style={{
              marginTop: 'var(--spacing-lg)',
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              textAlign: 'center'
            }}
          >
            <Text variant="medium" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              🎉 {completedCount === totalCount ? 'All tasks completed!' : 
                   completedCount > 0 ? `Great progress! ${totalCount - completedCount} tasks remaining.` :
                   'Ready to start guidance tasks.'}
            </Text>
          </div>
        )}
      </div>

      <style>{`
        .progress-task-item:hover {
          transform: scale(1.02) !important;
          box-shadow: var(--shadow-md);
        }

        .processing-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent-blue);
          animation: processingPulse 1.5s infinite;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes processingPulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
          100% { opacity: 1; transform: scale(1); }
        }

        .task-progress-list {
          max-height: 400px;
          overflow-y: auto;
          padding-right: var(--spacing-xs);
        }

        .task-progress-list::-webkit-scrollbar {
          width: 6px;
        }

        .task-progress-list::-webkit-scrollbar-track {
          background: var(--bg-tertiary);
          border-radius: 3px;
        }

        .task-progress-list::-webkit-scrollbar-thumb {
          background: var(--border-primary);
          border-radius: 3px;
        }

        .task-progress-list::-webkit-scrollbar-thumb:hover {
          background: var(--text-secondary);
        }
      `}</style>
      </div>
    </div>
  );
};
