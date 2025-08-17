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
      className={`kanban-card ${task.status} ${compactView ? 'compact' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Task Priority Indicator */}
      <div className="kanban-priority-dot" />

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
          <div className="kanban-answer">
            <Text
              variant="small"
              className="kanban-answer-text"
            >
              💡 {task.answer}
            </Text>
          </div>
        )}

        {/* Compact answer preview */}
        {task.answer && compactView && (
          <Text
            variant="tiny"
            className="kanban-answer-preview"
          >
            ✓ Answer provided
          </Text>
        )}
      </div>

      {/* Status Badge */}
      <div className="kanban-status-badge">
        {task.status === 'completed' ? '✓' : '⏳'}
      </div>
    </div>
  );

  const renderColumn = (title: string, tasks: TaskItem[], icon: React.ReactNode, kind: 'pending' | 'completed') => (
    <div className={`kanban-column ${kind}`}>
      {/* Column Header */}
      <div className="kanban-column-header">
        {icon}
        <Text variant="medium" className="kanban-column-title">
          {title}
        </Text>
        <div className="kanban-column-count">
          {tasks.length}
        </div>
      </div>

      {/* Column Content */}
      <div className="kanban-column-content">
        {tasks.length === 0 ? (
          <div className="kanban-empty">
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
            <div className="segmented-control">
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
                  className={`segmented-btn ${currentViewMode === mode.key ? 'active' : ''}`}
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
            <div className="kanban-progress">
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div className="kanban-dot green" />
                <Text variant="small">{completedCount}</Text>
              </div>
              <span className="kanban-progress-sep"><ArrowRight20Regular /></span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div className="kanban-dot orange" />
                <Text variant="small">{pendingTasksData.length}</Text>
              </div>
              <Text variant="small" style={{ color: 'var(--text-secondary)' }}>
                ({Math.round(progressPercentage)}%)
              </Text>
            </div>

            {/* View Toggle */}
            <button onClick={() => setCompactView(!compactView)} className="btn btn-secondary">
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
          <div className="kanban-empty">
            <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-md)' }}>📋</div>
            <Text variant="mediumPlus" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              Live Guidance Board Ready
            </Text>
            <Text variant="medium" style={{ marginTop: '4px' }}>
              Start your conversation to see tasks appear here in real-time
            </Text>
          </div>
        ) : (
          <div className="kanban-grid">
            {/* Pending Tasks Column */}
            {renderColumn(
              'Pending Tasks',
              pendingTasksData,
              <Clock20Regular />,
              'pending'
            )}

            {/* Completed Tasks Column */}
            {renderColumn(
              'Completed Tasks',
              completedTasksData,
              <CheckmarkCircle20Regular />,
              'completed'
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
