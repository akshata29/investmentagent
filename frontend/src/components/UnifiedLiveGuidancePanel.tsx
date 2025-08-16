import React, { useState, useEffect } from 'react';
import { Text, Toggle, Icon } from '@fluentui/react';
import { ModernSection } from './ModernSection';
import { ModernButton } from './ModernButton';
import { CheckmarkCircle20Regular, Clock20Regular, Info20Regular } from '@fluentui/react-icons';

interface UnifiedLiveGuidancePanelProps {
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
}

export const UnifiedLiveGuidancePanel: React.FC<UnifiedLiveGuidancePanelProps> = ({
  pendingTasks,
  completedTasks,
  isProcessing = false,
  currentViewMode = 'unified',
  onViewModeChange
}) => {
  const [viewMode, setViewMode] = useState<'unified' | 'grouped' | 'timeline'>('unified');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [parsedTasks, setParsedTasks] = useState<TaskItem[]>([]);

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
          answer: answerMatch ? answerMatch[2].trim() : undefined
        };
      });
    };

    const pending = parseTaskText(pendingTasks, 'pending');
    const completed = parseTaskText(completedTasks, 'completed');
    setParsedTasks([...pending, ...completed]);
  }, [pendingTasks, completedTasks]);

  const getTaskIcon = (status: 'pending' | 'completed') => {
    return status === 'completed' 
      ? <CheckmarkCircle20Regular style={{ color: 'var(--accent-green)' }} />
      : <Clock20Regular style={{ color: 'var(--accent-orange)' }} />;
  };

  const getTaskCount = (status: 'pending' | 'completed') => {
    return parsedTasks.filter(task => task.status === status).length;
  };

  const filteredTasks = showOnlyActive 
    ? parsedTasks.filter(task => task.status === 'pending')
    : parsedTasks;

  // Unified View - Mixed list with color coding
  const renderUnifiedView = () => (
    <div className="unified-tasks-container">
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <Info20Regular style={{ color: 'var(--text-secondary)', marginBottom: '8px' }} />
          <Text variant="medium" style={{ color: 'var(--text-secondary)' }}>
            No tasks available. Start the conversation to see live guidance.
          </Text>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className={`task-item ${task.status}`}
              style={{
                padding: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-xs)',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${task.status === 'completed' ? 'var(--accent-green)' : 'var(--accent-orange)'}`,
                backgroundColor: task.status === 'completed' ? 'var(--bg-success)' : 'var(--bg-warning)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--spacing-sm)',
                transition: 'all 0.3s ease'
              }}
            >
              {getTaskIcon(task.status)}
              <div style={{ flex: 1 }}>
                <Text 
                  variant="medium" 
                  style={{ 
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--text-primary)',
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    opacity: task.status === 'completed' ? 0.8 : 1
                  }}
                >
                  {task.text}
                </Text>
                {task.answer && (
                  <Text 
                    variant="small" 
                    style={{ 
                      color: 'var(--text-secondary)',
                      marginTop: '4px',
                      fontStyle: 'italic'
                    }}
                  >
                    ✓ {task.answer}
                  </Text>
                )}
              </div>
              <div className="task-badge">
                <Text 
                  variant="tiny" 
                  style={{ 
                    backgroundColor: task.status === 'completed' ? 'var(--accent-green)' : 'var(--accent-orange)',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}
                >
                  {task.status.toUpperCase()}
                </Text>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Grouped View - Side by side columns
  const renderGroupedView = () => (
    <div className="grouped-tasks-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
      <div className="pending-column">
        <div className="column-header">
          <Clock20Regular style={{ color: 'var(--accent-orange)' }} />
          <Text variant="mediumPlus" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
            Pending ({getTaskCount('pending')})
          </Text>
        </div>
        <div className="column-content">
          {parsedTasks.filter(task => task.status === 'pending').map((task) => (
            <div key={task.id} className="grouped-task-item pending">
              <Text variant="medium">{task.text}</Text>
            </div>
          ))}
        </div>
      </div>
      
      <div className="completed-column">
        <div className="column-header">
          <CheckmarkCircle20Regular style={{ color: 'var(--accent-green)' }} />
          <Text variant="mediumPlus" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
            Completed ({getTaskCount('completed')})
          </Text>
        </div>
        <div className="column-content">
          {parsedTasks.filter(task => task.status === 'completed').map((task) => (
            <div key={task.id} className="grouped-task-item completed">
              <Text variant="medium" style={{ textDecoration: 'line-through', opacity: 0.8 }}>
                {task.text}
              </Text>
              {task.answer && (
                <Text variant="small" style={{ color: 'var(--accent-green)', marginTop: '4px' }}>
                  ✓ {task.answer}
                </Text>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Timeline View - Chronological flow
  const renderTimelineView = () => (
    <div className="timeline-container">
      <div className="timeline-line"></div>
      {filteredTasks.map((task, index) => (
        <div key={task.id} className={`timeline-item ${task.status}`}>
          <div className="timeline-marker">
            {getTaskIcon(task.status)}
          </div>
          <div className="timeline-content">
            <Text variant="medium" style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {task.text}
            </Text>
            {task.answer && (
              <Text variant="small" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                {task.answer}
              </Text>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const getCurrentView = () => {
    switch (viewMode) {
      case 'grouped': return renderGroupedView();
      case 'timeline': return renderTimelineView();
      default: return renderUnifiedView();
    }
  };

  return (
    <div className="modern-section fade-in">
      <div className="modern-section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left side: Title and dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <span>🤖 Live Guidance</span>
            <select 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value as any)}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-primary)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                minWidth: '100px',
                cursor: 'pointer'
              }}
            >
              <option value="unified">🎯 Unified</option>
              <option value="grouped">📋 Grouped</option>
              <option value="timeline">⏰ Timeline</option>
            </select>
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

          {/* Right side: Processing, Status and Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            {/* Processing indicator */}
            {isProcessing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div className="processing-dot"></div>
                <Text variant="small" style={{ color: 'var(--text-secondary)' }}>Processing...</Text>
              </div>
            )}
            
            {/* Status Summary */}
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-sm)', 
              alignItems: 'center',
              padding: '4px 8px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock20Regular style={{ color: 'var(--accent-orange)', fontSize: '14px' }} />
                <Text variant="small" style={{ fontWeight: '600' }}>{getTaskCount('pending')}</Text>
              </div>
              <div style={{ 
                width: '1px', 
                height: '16px', 
                backgroundColor: 'var(--border-primary)' 
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckmarkCircle20Regular style={{ color: 'var(--accent-green)', fontSize: '14px' }} />
                <Text variant="small" style={{ fontWeight: '600' }}>{getTaskCount('completed')}</Text>
              </div>
            </div>
            
            {/* Filter Toggle */}
            <Toggle
              label="Active Only"
              checked={showOnlyActive}
              onChange={(_, checked) => setShowOnlyActive(!!checked)}
              inlineLabel
              styles={{
                root: { 
                  marginBottom: 0,
                  padding: '4px 8px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-primary)'
                },
                label: { 
                  fontSize: '12px', 
                  color: 'var(--text-secondary)',
                  fontWeight: '500'
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="live-guidance-content" style={{ minHeight: '300px' }}>
        {getCurrentView()}
      </div>

      <style>{`
        .unified-tasks-container {
          max-height: 400px;
          overflow-y: auto;
          padding: var(--spacing-sm);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
          text-align: center;
        }

        /* Fix dropdown z-index issues */
        select {
          position: relative !important;
          z-index: 1001 !important;
        }

        select option {
          background-color: var(--bg-secondary) !important;
          color: var(--text-primary) !important;
          padding: 4px 8px !important;
        }

        /* Ensure header has proper z-index */
        .live-guidance-content {
          position: relative;
          z-index: 1;
        }

        .task-item {
          animation: slideInFromLeft 0.3s ease-out;
        }

        .task-item.completed {
          transform: scale(0.98);
        }

        .task-item:hover {
          transform: translateX(4px);
          box-shadow: var(--shadow-md);
        }

        .grouped-tasks-container .column-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding-bottom: var(--spacing-sm);
          border-bottom: 2px solid var(--border-primary);
          margin-bottom: var(--spacing-sm);
        }

        .grouped-task-item {
          padding: var(--spacing-sm);
          margin-bottom: var(--spacing-xs);
          border-radius: var(--radius-md);
          border-left: 4px solid transparent;
        }

        .grouped-task-item.pending {
          border-left-color: var(--accent-orange);
          background-color: var(--bg-warning);
        }

        .grouped-task-item.completed {
          border-left-color: var(--accent-green);
          background-color: var(--bg-success);
        }

        .timeline-container {
          position: relative;
          padding-left: 30px;
        }

        .timeline-line {
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--accent-orange), var(--accent-green));
        }

        .timeline-item {
          position: relative;
          margin-bottom: var(--spacing-md);
          padding-left: var(--spacing-md);
        }

        .timeline-marker {
          position: absolute;
          left: -23px;
          top: 4px;
          background: var(--bg-card);
          border-radius: 50%;
          padding: 4px;
          border: 2px solid var(--border-primary);
        }

        .timeline-content {
          background: var(--bg-secondary);
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-primary);
        }

        .processing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent-blue);
          animation: pulse 1.5s infinite;
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 768px) {
          .grouped-tasks-container {
            grid-template-columns: 1fr;
          }
          
          .timeline-container {
            padding-left: 20px;
          }
          
          .timeline-marker {
            left: -18px;
          }
        }
      `}</style>
    </div>
  );
};
