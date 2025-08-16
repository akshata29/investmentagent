import React, { useState } from 'react';
import { Text, Panel, PanelType } from '@fluentui/react';
import { ModernButton } from './ModernButton';
import { useTheme } from '../contexts/ThemeContext';
import {
  Alert24Regular,
  Alert24Filled,
  Money24Regular,
  Clock24Regular,
  Checkmark24Regular,
  Info24Regular,
  ChevronRight24Regular
} from '@fluentui/react-icons';

interface RecommendationAlert {
  id: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface SmartNotificationHeaderProps {
  newRecommendationCount: number;
  recommendationHistory: RecommendationAlert[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onViewRecommendation: (id: string) => void;
}

export const SmartNotificationHeader: React.FC<SmartNotificationHeaderProps> = ({
  newRecommendationCount,
  recommendationHistory,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewRecommendation
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { isDark, theme } = useTheme();

  // Modern panel styles that match the settings panel
  const panelStyles = {
    main: {
      backgroundColor: 'var(--bg-panel)',
      color: 'var(--text-primary)',
    },
    content: {
      padding: 0, // We'll handle padding ourselves
      backgroundColor: 'var(--bg-panel)',
    },
    header: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--text-on-primary)',
      borderBottom: `2px solid var(--border-primary)`,
    },
    scrollableContent: {
      backgroundColor: 'var(--bg-panel)',
    },
    closeButton: {
      color: 'var(--text-on-primary)',
      backgroundColor: 'transparent',
      border: 'none',
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Alert24Filled style={{ color: 'var(--accent-red)' }} />;
      case 'medium': return <Alert24Regular style={{ color: 'var(--accent-orange)' }} />;
      default: return <Info24Regular style={{ color: 'var(--accent-blue)' }} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--accent-red)';
      case 'medium': return 'var(--accent-orange)';
      default: return 'var(--accent-blue)';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return timestamp.toLocaleDateString();
  };

  const getPreviewText = (content: string) => {
    const cleanContent = content.replace(/[#*•\-]/g, '').trim();
    return cleanContent.length > 80 ? cleanContent.substring(0, 80) + '...' : cleanContent;
  };

  return (
    <>
      <div className="smart-notification-header">
        <button
          className="notification-bell"
          onClick={() => setIsPanelOpen(true)}
          title={newRecommendationCount > 0 ? `${newRecommendationCount} new recommendations` : 'View recommendation alerts'}
        >
          {newRecommendationCount > 0 ? (
            <Alert24Filled style={{ color: 'var(--accent-orange)' }} />
          ) : (
            <Alert24Regular style={{ color: 'var(--text-secondary)' }} />
          )}
          
          {newRecommendationCount > 0 && (
            <span className="notification-badge">
              {newRecommendationCount > 99 ? '99+' : newRecommendationCount}
            </span>
          )}
        </button>
      </div>

      <Panel
        isOpen={isPanelOpen}
        onDismiss={() => setIsPanelOpen(false)}
        type={PanelType.medium}
        hasCloseButton={false}
        onRenderHeader={() => (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--text-on-primary)',
            borderBottom: '2px solid var(--border-primary)',
            minHeight: '60px'
          }}>
            <Text variant="large" style={{ 
              color: 'var(--text-on-primary)', 
              fontWeight: '600',
              fontSize: 'var(--font-size-lg)'
            }}>
              💼 Investment Recommendation Alerts
            </Text>
            <button
              onClick={() => setIsPanelOpen(false)}
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.9)',
                border: isDark ? '2px solid #ffffff' : '2px solid #333333',
                borderRadius: '8px',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                color: isDark ? '#ffffff' : '#000000',
                boxShadow: isDark ? '0 2px 8px rgba(255,255,255,0.2)' : '0 2px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (isDark) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.borderColor = '#ffffff';
                } else {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#333333';
                }
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                if (isDark) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = '#ffffff';
                } else {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.borderColor = '#333333';
                }
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Close panel"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        styles={{
          main: {
            backgroundColor: 'var(--bg-panel)',
            color: 'var(--text-primary)',
          },
          content: {
            padding: 0,
            backgroundColor: 'var(--bg-panel)',
          },
          scrollableContent: {
            backgroundColor: 'var(--bg-panel)',
          }
        }}
        className="modern-panel slide-in"
      >
        <div className="notification-panel-content">
          {recommendationHistory.length === 0 ? (
            <div className="empty-notifications">
              <Money24Regular style={{ fontSize: '48px', color: 'var(--text-secondary)', marginBottom: '16px' }} />
              <Text variant="mediumPlus" style={{ fontWeight: '600', marginBottom: '8px' }}>
                No Recommendation Alerts Yet
              </Text>
              <Text variant="medium" style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                Start your conversation to receive live investment recommendations and alerts will appear here.
              </Text>
            </div>
          ) : (
            <>
              <div className="notification-header-actions">
                <div className="notification-summary">
                  <Text variant="medium" style={{ fontWeight: '600' }}>
                    {recommendationHistory.length} Total Recommendations
                  </Text>
                  {newRecommendationCount > 0 && (
                    <Text variant="small" style={{ color: 'var(--accent-orange)' }}>
                      {newRecommendationCount} new
                    </Text>
                  )}
                </div>
                {newRecommendationCount > 0 && (
                  <ModernButton
                    variant="secondary"
                    size="small"
                    onClick={onMarkAllAsRead}
                  >
                    Mark All Read
                  </ModernButton>
                )}
              </div>

              <div className="notification-list">
                {recommendationHistory
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`notification-item ${alert.isRead ? 'read' : 'unread'}`}
                    >
                      <div className="notification-icon">
                        {getPriorityIcon(alert.priority)}
                      </div>
                      
                      <div className="notification-content">
                        <div className="notification-meta">
                          <div className="notification-time">
                            <Clock24Regular style={{ fontSize: '12px' }} />
                            <span>{formatTimestamp(alert.timestamp)}</span>
                          </div>
                          {!alert.isRead && (
                            <div 
                              className="unread-indicator"
                              style={{ backgroundColor: getPriorityColor(alert.priority) }}
                            />
                          )}
                        </div>
                        
                        <Text variant="medium" className="notification-preview">
                          {getPreviewText(alert.content)}
                        </Text>
                        
                        <div className="notification-actions">
                          <button
                            className="view-recommendation-btn"
                            onClick={() => {
                              onViewRecommendation(alert.id);
                              if (!alert.isRead) onMarkAsRead(alert.id);
                              setIsPanelOpen(false);
                            }}
                          >
                            <span>View Full Recommendation</span>
                            <ChevronRight24Regular style={{ fontSize: '14px' }} />
                          </button>
                          
                          {!alert.isRead && (
                            <button
                              className="mark-read-btn"
                              onClick={() => onMarkAsRead(alert.id)}
                            >
                              <Checkmark24Regular style={{ fontSize: '14px' }} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </Panel>

      <style>{`
        .smart-notification-header {
          position: relative;
          display: flex;
          align-items: center;
        }

        .notification-bell {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-bell:hover {
          background: var(--bg-secondary);
          transform: scale(1.05);
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: var(--accent-red);
          color: white;
          border-radius: 50%;
          min-width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          animation: pulse 1.5s infinite;
          border: 2px solid var(--bg-primary);
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .slide-in {
          animation: slideIn 0.3s ease-out;
        }

        .notification-panel-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--bg-panel);
          color: var(--text-primary);
          padding: var(--spacing-md);
        }

        /* Theme override for better visibility */
        .notification-theme-override .ms-Panel-main {
          background-color: var(--bg-panel) !important;
          border: 1px solid var(--border-primary);
          box-shadow: var(--shadow-lg);
        }

        .notification-theme-override .ms-Panel-header {
          background-color: var(--color-primary) !important;
          color: var(--text-on-primary) !important;
          border-bottom: 2px solid var(--border-primary) !important;
        }

        .notification-theme-override .ms-Panel-headerText {
          color: var(--text-on-primary) !important;
          font-weight: 600 !important;
          font-size: var(--font-size-lg) !important;
        }

        /* Enhanced theme override for maximum visibility */
        .notification-theme-override .ms-Panel-closeButton {
          color: var(--text-on-primary) !important;
          background-color: rgba(255, 255, 255, 0.2) !important;
          border: 3px solid var(--text-on-primary) !important;
          border-radius: var(--radius-md) !important;
          width: 40px !important;
          height: 40px !important;
          opacity: 1 !important;
          font-weight: 900 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
          position: relative !important;
          z-index: 1000 !important;
        }

        .notification-theme-override .ms-Panel-closeButton:hover {
          background-color: rgba(255, 255, 255, 0.4) !important;
          border-color: var(--text-on-primary) !important;
          color: var(--text-on-primary) !important;
          transform: scale(1.1) !important;
          opacity: 1 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
        }

        .notification-theme-override .ms-Panel-closeButton:focus {
          background-color: rgba(255, 255, 255, 0.3) !important;
          border-color: var(--text-on-primary) !important;
          color: var(--text-on-primary) !important;
          opacity: 1 !important;
          outline: 3px solid var(--accent-blue) !important;
          outline-offset: 3px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
        }

        /* Ensure the close button icon is visible with all possible selectors */
        .notification-theme-override .ms-Panel-closeButton i,
        .notification-theme-override .ms-Panel-closeButton .ms-Icon,
        .notification-theme-override .ms-Panel-closeButton [data-icon-name],
        .notification-theme-override .ms-Panel-closeButton span {
          color: var(--text-on-primary) !important;
          font-size: 20px !important;
          font-weight: 900 !important;
          opacity: 1 !important;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        /* Force visibility in both themes */
        .notification-theme-override[data-theme="dark"] .ms-Panel-closeButton,
        .notification-theme-override.ms-Panel[data-theme="dark"] .ms-Panel-closeButton {
          background-color: rgba(255, 255, 255, 0.25) !important;
          border-color: #ffffff !important;
          color: #ffffff !important;
        }

        .notification-theme-override[data-theme="light"] .ms-Panel-closeButton,
        .notification-theme-override.ms-Panel[data-theme="light"] .ms-Panel-closeButton {
          background-color: rgba(0, 0, 0, 0.15) !important;
          border-color: #000000 !important;
          color: #000000 !important;
        }

        .notification-theme-override .ms-Panel-content {
          background-color: var(--bg-panel) !important;
          color: var(--text-primary) !important;
          padding: 0 !important;
        }

        .notification-theme-override .ms-Panel-scrollableContent {
          background-color: var(--bg-panel) !important;
        }

        .empty-notifications {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
          text-align: center;
          height: 300px;
        }

        .notification-header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--border-primary);
          margin-bottom: var(--spacing-md);
        }

        .notification-summary {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .notification-list {
          flex: 1;
          overflow-y: auto;
          padding: 0 var(--spacing-md);
        }

        .notification-item {
          display: flex;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-sm);
          border: 1px solid var(--border-primary);
          transition: all 0.2s ease;
          background: var(--bg-primary);
        }

        .notification-item.unread {
          background: var(--bg-secondary);
          border-left: 4px solid var(--accent-orange);
          box-shadow: var(--shadow-sm);
        }

        .notification-item:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .notification-icon {
          display: flex;
          align-items: flex-start;
          padding-top: 4px;
        }

        .notification-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .notification-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notification-time {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-secondary);
          font-size: 12px;
        }

        .unread-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        .notification-preview {
          color: var(--text-primary);
          line-height: 1.4;
        }

        .notification-actions {
          display: flex;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-xs);
        }

        .view-recommendation-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--color-primary);
          color: var(--text-on-primary);
          border: none;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
        }

        .view-recommendation-btn:hover {
          background: var(--color-primary-dark);
          transform: translateX(2px);
        }

        .mark-read-btn {
          background: var(--bg-secondary);
          color: var(--text-secondary);
          border: 1px solid var(--border-primary);
          padding: 6px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }

        .mark-read-btn:hover {
          background: var(--accent-green);
          color: white;
          border-color: var(--accent-green);
        }
      `}</style>
    </>
  );
};
