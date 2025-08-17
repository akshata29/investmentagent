import React, { useState } from 'react';
import { Text, Panel, PanelType } from '@fluentui/react';
import { ModernButton, ModernIconButton } from './ModernButton';
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

  // no inline panel styles; themed via CSS classes in modern-theme.css

  const getPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return <Alert24Filled className={`priority-icon ${priority}`} />;
      case 'medium': return <Alert24Regular className={`priority-icon ${priority}`} />;
      default: return <Info24Regular className={`priority-icon ${priority}`} />;
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
        <ModernIconButton
          variant="secondary"
          onClick={() => setIsPanelOpen(true)}
          title={newRecommendationCount > 0 ? `${newRecommendationCount} new recommendations` : 'View recommendation alerts'}
          className={`notification-bell ${newRecommendationCount > 0 ? 'has-new' : 'no-new'}`}
          icon={newRecommendationCount > 0 ? (
            <Alert24Filled className="bell-icon" />
          ) : (
            <Alert24Regular className="bell-icon" />
          )}
        >
          {newRecommendationCount > 0 && (
            <span className="notification-badge">
              {newRecommendationCount > 99 ? '99+' : newRecommendationCount}
            </span>
          )}
        </ModernIconButton>
      </div>

      <Panel
        isOpen={isPanelOpen}
        onDismiss={() => setIsPanelOpen(false)}
        type={PanelType.medium}
        hasCloseButton={false}
        onRenderHeader={() => (
          <div className="notification-panel-header">
            <Text variant="large" className="notification-header-title">
              💼 Investment Recommendation Alerts
            </Text>
            <button
              onClick={() => setIsPanelOpen(false)}
              className={`notification-close-btn ${isDark ? 'dark' : 'light'}`}
              title="Close panel"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        className="modern-panel notification-panel slide-in"
      >
        <div className="notification-panel-content">
          {recommendationHistory.length === 0 ? (
            <div className="empty-notifications">
              <Money24Regular className="empty-icon" />
              <Text variant="mediumPlus" className="empty-title">
                No Recommendation Alerts Yet
              </Text>
              <Text variant="medium" className="empty-subtitle">
                Start your conversation to receive live investment recommendations and alerts will appear here.
              </Text>
            </div>
          ) : (
            <>
              <div className="notification-header-actions">
                <div className="notification-summary">
                  <Text variant="medium" className="notification-summary-count">
                    {recommendationHistory.length} Total Recommendations
                  </Text>
                  {newRecommendationCount > 0 && (
                    <Text variant="small" className="notification-new">
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
                            <Clock24Regular className="icon-sm" />
                            <span>{formatTimestamp(alert.timestamp)}</span>
                          </div>
                          {!alert.isRead && (
                            <div className={`unread-indicator ${alert.priority}`} />
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
                            <ChevronRight24Regular className="icon-sm" />
                          </button>
                          {!alert.isRead && (
                            <button
                              className="mark-read-btn"
                              onClick={() => onMarkAsRead(alert.id)}
                            >
                              <Checkmark24Regular className="icon-sm" />
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
    </>
  );
};
