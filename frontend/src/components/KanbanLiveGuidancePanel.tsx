import React, { useState, useEffect } from 'react';
import { Text, Icon } from '@fluentui/react';
import { ModernSection } from './ModernSection';
import { CheckmarkCircle20Regular, Clock20Regular, ArrowRight20Regular } from '@fluentui/react-icons';

interface KanbanLiveGuidancePanelProps {
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
  timestamp?: Date;
}

export const KanbanLiveGuidancePanel: React.FC<KanbanLiveGuidancePanelProps> = ({
  pendingTasks,
  completedTasks,
  isProcessing = false,
  currentViewMode = 'kanban',
  onViewModeChange
}) => {
  const [parsedTasks, setParsedTasks] = useState<TaskItem[]>([]);
  const [compactView, setCompactView] = useState(false);

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
          timestamp: new Date()
        };
      });
    };

    const pending = parseTaskText(pendingTasks, 'pending');
    const completed = parseTaskText(completedTasks, 'completed');
    setParsedTasks([...pending, ...completed]);
  }, [pendingTasks, completedTasks]);

  const pendingTasksData = parsedTasks.filter(task => task.status === 'pending');
  const completedTasksData = parsedTasks.filter(task => task.status === 'completed');

  const renderTaskCard = (task: TaskItem, index: number) => (
    <div
      key={task.id}
      className={`kanban-card ${task.status}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: `2px solid ${task.status === 'completed' ? 'var(--accent-green)' : 'var(--accent-orange)'}`,
        borderRadius: 'var(--radius-md)',
        padding: compactView ? 'var(--spacing-sm)' : 'var(--spacing-md)',
        marginBottom: 'var(--spacing-sm)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.3s ease',
        cursor: 'default',
        position: 'relative',
        animation: `cardSlideIn 0.3s ease-out ${index * 0.1}s both`
      }}
    >
      {/* Task Priority Indicator */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: task.status === 'completed' ? 'var(--accent-green)' : 'var(--accent-orange)'
        }}
      />

      {/* Task Content */}
      <div style={{ paddingRight: '16px' }}>
        <Text
          variant={compactView ? "small" : "medium"}
          style={{
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--text-primary)',
            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
            opacity: task.status === 'completed' ? 0.8 : 1,
            lineHeight: '1.4',
            display: 'block'
          }}
        >
          {task.text}
        </Text>

        {/* Answer Section */}
        {task.answer && !compactView && (
          <div
            style={{
              marginTop: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm)',
              backgroundColor: task.status === 'completed' ? 'var(--bg-success)' : 'var(--bg-warning)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: `3px solid ${task.status === 'completed' ? 'var(--accent-green)' : 'var(--accent-orange)'}`
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

        {/* Compact answer preview */}
        {task.answer && compactView && (
          <Text
            variant="tiny"
            style={{
              color: 'var(--text-secondary)',
              marginTop: '2px',
              display: 'block'
            }}
          >
            ✓ Answer provided
          </Text>
        )}
      </div>

      {/* Status Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          padding: '2px 6px',
          borderRadius: '12px',
          backgroundColor: task.status === 'completed' ? 'var(--accent-green)' : 'var(--accent-orange)',
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold'
        }}
      >
        {task.status === 'completed' ? '✓' : '⏳'}
      </div>
    </div>
  );

  const renderColumn = (title: string, tasks: TaskItem[], icon: React.ReactNode, color: string) => (
    <div className="kanban-column" style={{ flex: 1, minWidth: '250px' }}>
      {/* Column Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          padding: 'var(--spacing-md)',
          backgroundColor: color,
          color: 'white',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-md)',
          fontWeight: 'var(--font-weight-semibold)'
        }}
      >
        {icon}
        <Text variant="medium" style={{ color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
          {title}
        </Text>
        <div
          style={{
            marginLeft: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '2px 8px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          {tasks.length}
        </div>
      </div>

      {/* Column Content */}
      <div
        className="kanban-column-content"
        style={{
          minHeight: '300px',
          maxHeight: '400px',
          overflowY: 'auto',
          padding: 'var(--spacing-sm)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: `2px dashed ${color}`,
          opacity: 0.9
        }}
      >
        {tasks.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              padding: 'var(--spacing-xl)',
              fontSize: '14px'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: 'var(--spacing-sm)' }}>
              {title.includes('Pending') ? '⏰' : '🎉'}
            </div>
            No {title.toLowerCase()}
          </div>
        ) : (
          tasks.map((task, index) => renderTaskCard(task, index))
        )}
      </div>
    </div>
  );

  const totalTasks = parsedTasks.length;
  const completedCount = completedTasksData.length;
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="modern-section fade-in">
      <div className="modern-section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left side: Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <span>📋 Live Guidance Board</span>
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

          {/* Right side: Progress Overview and Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            {/* Progress Overview */}
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
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-green)'
                  }}
                />
                <Text variant="small">{completedCount}</Text>
              </div>
              <ArrowRight20Regular style={{ color: 'var(--text-secondary)', fontSize: '12px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-orange)'
                  }}
                />
                <Text variant="small">{pendingTasksData.length}</Text>
              </div>
              <Text variant="small" style={{ color: 'var(--text-secondary)' }}>
                ({Math.round(progressPercentage)}%)
              </Text>
            </div>

            {/* View Toggle */}
            <button
              onClick={() => setCompactView(!compactView)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-primary)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {compactView ? '📖 Detailed' : '📋 Compact'}
            </button>

            {/* Processing Indicator */}
            {isProcessing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div className="kanban-processing-dot"></div>
                <Text variant="small" style={{ color: 'var(--text-secondary)' }}>
                  Updating...
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="modern-section-content">
      <div className="kanban-container">
        {totalTasks === 0 ? (
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
            <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-md)' }}>📋</div>
            <Text variant="mediumPlus" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              Live Guidance Board Ready
            </Text>
            <Text variant="medium" style={{ marginTop: '4px' }}>
              Start your conversation to see tasks appear here in real-time
            </Text>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-lg)',
              alignItems: 'flex-start',
              minHeight: '400px'
            }}
          >
            {/* Pending Tasks Column */}
            {renderColumn(
              'Pending Tasks',
              pendingTasksData,
              <Clock20Regular />,
              'var(--accent-orange)'
            )}

            {/* Completed Tasks Column */}
            {renderColumn(
              'Completed Tasks',
              completedTasksData,
              <CheckmarkCircle20Regular />,
              'var(--accent-green)'
            )}
          </div>
        )}
      </div>

      <style>{`
        .kanban-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .kanban-column-content::-webkit-scrollbar {
          width: 6px;
        }

        .kanban-column-content::-webkit-scrollbar-track {
          background: var(--bg-tertiary);
          border-radius: 3px;
        }

        .kanban-column-content::-webkit-scrollbar-thumb {
          background: var(--border-primary);
          border-radius: 3px;
        }

        .kanban-processing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent-blue);
          animation: kanbanPulse 1.5s infinite;
        }

        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes kanbanPulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 768px) {
          .kanban-container > div:last-child {
            flex-direction: column;
          }
          
          .kanban-column {
            min-width: 100%;
          }
        }
      `}</style>
      </div>
    </div>
  );
};
