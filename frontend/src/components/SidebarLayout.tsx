import React, { useState } from 'react';
import { Toggle } from '@fluentui/react';
import { ModernIconButton } from './ModernButton';

interface SidebarLayoutProps {
  liveGuidanceComponent: React.ReactNode;
  sentimentComponent: React.ReactNode;
  transcriptComponent: React.ReactNode;
  recommendationComponent: React.ReactNode;
  isRecording: boolean;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  liveGuidanceComponent,
  sentimentComponent,
  transcriptComponent,
  recommendationComponent,
  isRecording
}) => {
  const [activePanel, setActivePanel] = useState<string>('transcript');
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('left');
  const [compactSidebar, setCompactSidebar] = useState(false);
  const [pinnedPanels, setPinnedPanels] = useState<string[]>(['sentiment']);

  const panels = [
    {
      key: 'transcript',
      title: 'Real-Time Transcript',
      icon: '📝',
      component: transcriptComponent,
  color: 'var(--color-primary)',
      isLive: isRecording
    },
    {
      key: 'guidance',
      title: 'Live Guidance',
      icon: '🤖',
      component: liveGuidanceComponent,
  color: 'var(--accent-green)',
      isLive: isRecording
    },
    {
      key: 'sentiment',
      title: 'Sentiment Analysis',
      icon: '📊',
      component: sentimentComponent,
  color: 'var(--accent-orange)',
      isLive: false
    },
    {
      key: 'recommendation',
      title: 'Investment Recommendations',
      icon: '💡',
      component: recommendationComponent,
  color: 'var(--accent-purple)',
      isLive: false
    }
  ];

  const activeComponent = panels.find(p => p.key === activePanel);
  const pinnedComponents = panels.filter(p => pinnedPanels.includes(p.key));
  const sidebarWidth = compactSidebar ? '80px' : '320px';

  const togglePin = (panelKey: string) => {
    setPinnedPanels(prev => 
      prev.includes(panelKey) 
        ? prev.filter(p => p !== panelKey)
        : [...prev, panelKey]
    );
  };

  const renderSidebar = () => (
    <div style={{
      width: sidebarWidth,
      background: 'var(--bg-card)',
      borderRadius: sidebarPosition === 'left' ? '0 var(--radius-lg) var(--radius-lg) 0' : 'var(--radius-lg) 0 0 var(--radius-lg)',
      border: '2px solid var(--border-primary)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Sidebar Header */}
      <div style={{
        padding: compactSidebar ? 'var(--spacing-sm)' : 'var(--spacing-md)',
        background: 'var(--bg-header)',
        color: 'var(--text-inverse)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-primary)'
      }}>
        {!compactSidebar && (
          <h4 style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
            Quick Access
          </h4>
        )}
        <ModernIconButton
          icon={compactSidebar ? '→' : '←'}
          onClick={() => setCompactSidebar(!compactSidebar)}
          title={compactSidebar ? 'Expand Sidebar' : 'Collapse Sidebar'}
          variant="secondary"
          size="small"
        />
      </div>

      {/* Navigation Buttons */}
      <div style={{
        padding: compactSidebar ? 'var(--spacing-xs)' : 'var(--spacing-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xs)',
        flex: 1
      }}>
        {panels.map((panel) => (
          <div key={panel.key} style={{ position: 'relative' }}>
            <button
              onClick={() => setActivePanel(panel.key)}
              style={{
                width: '100%',
                padding: compactSidebar ? 'var(--spacing-sm)' : 'var(--spacing-md)',
                background: activePanel === panel.key ? panel.color : 'var(--bg-secondary)',
                color: activePanel === panel.key ? 'white' : 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: compactSidebar ? '0' : 'var(--spacing-sm)',
                justifyContent: compactSidebar ? 'center' : 'flex-start',
                fontSize: compactSidebar ? 'var(--font-size-lg)' : 'var(--font-size-sm)',
                fontWeight: activePanel === panel.key ? 600 : 400
              }}
              onMouseEnter={(e) => {
                if (activePanel !== panel.key) {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activePanel !== panel.key) {
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <span style={{ fontSize: compactSidebar ? '20px' : '16px' }}>
                {panel.icon}
              </span>
              {!compactSidebar && (
                <>
                  <span style={{ flex: 1, textAlign: 'left' }}>{panel.title}</span>
                  {panel.isLive && (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'var(--accent-red)',
                      borderRadius: '50%',
                      animation: 'pulse 1.5s infinite'
                    }} />
                  )}
                </>
              )}
            </button>
            
            {/* Pin/Unpin Button */}
            {!compactSidebar && (
              <button
                onClick={() => togglePin(panel.key)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '20px',
                  height: '20px',
                  background: pinnedPanels.includes(panel.key) ? 'var(--accent-red)' : 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '10px',
                  color: pinnedPanels.includes(panel.key) ? 'white' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={pinnedPanels.includes(panel.key) ? 'Unpin from sidebar' : 'Pin to sidebar'}
              >
                📌
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pinned Panels Preview */}
      {!compactSidebar && pinnedComponents.length > 0 && (
        <div style={{
          borderTop: '1px solid var(--border-primary)',
          padding: 'var(--spacing-sm)',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          <h5 style={{ 
            margin: '0 0 var(--spacing-xs) 0',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Pinned
          </h5>
          {pinnedComponents.map((panel) => (
            <div key={`pinned-${panel.key}`} style={{
              marginBottom: 'var(--spacing-xs)',
              padding: 'var(--spacing-xs)',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-xs)',
              maxHeight: '80px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                marginBottom: '4px'
              }}>
                <span>{panel.icon}</span>
                <span style={{ fontWeight: 600 }}>{panel.title}</span>
              </div>
              <div style={{ 
                fontSize: '10px',
                color: 'var(--text-secondary)',
                lineHeight: 1.2
              }}>
                {panel.component}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMainContent = () => (
    <div style={{
      flex: 1,
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '2px solid var(--border-primary)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Main Header */}
      <div style={{
        padding: 'var(--spacing-md)',
        background: activeComponent?.color || 'var(--bg-header)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span style={{ fontSize: 'var(--font-size-lg)' }}>
            {activeComponent?.icon}
          </span>
          <h3 style={{ margin: 0 }}>{activeComponent?.title}</h3>
          {activeComponent?.isLive && (
            <span style={{
              padding: '2px 8px',
              background: 'rgba(255, 68, 68, 0.9)',
              borderRadius: '12px',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 600,
              animation: 'pulse 1.5s infinite'
            }}>
              LIVE
            </span>
          )}
        </div>
        
        <ModernIconButton
          icon={pinnedPanels.includes(activePanel) ? '📌' : '📍'}
          onClick={() => togglePin(activePanel)}
          title={pinnedPanels.includes(activePanel) ? 'Unpin' : 'Pin to sidebar'}
          variant="secondary"
          size="small"
        />
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: 'var(--spacing-lg)',
        background: 'var(--bg-secondary)'
      }}>
        {activeComponent?.component}
      </div>
    </div>
  );

  return (
    <div className="sidebar-layout">
      {/* Layout Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-md)',
        padding: 'var(--spacing-sm)',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-primary)'
      }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Sidebar:</span>
          <Toggle
            label="Right Side"
            checked={sidebarPosition === 'right'}
            onChange={(_, checked) => setSidebarPosition(checked ? 'right' : 'left')}
          />
        </div>
        
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
          📌 Pin panels for quick access • {pinnedPanels.length} pinned
        </div>
      </div>

      {/* Main Layout */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-md)',
        height: `calc(100vh - 140px)`,
        flexDirection: sidebarPosition === 'right' ? 'row-reverse' : 'row'
      }}>
        {renderSidebar()}
        {renderMainContent()}
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        @media (max-width: 1024px) {
          .sidebar-layout {
            /* Stack vertically on tablets */
          }
        }

        @media (max-width: 768px) {
          .sidebar-layout > div:last-child > div {
            flex-direction: column;
          }
          
          .sidebar-layout .sidebar {
            width: 100% !important;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
};
