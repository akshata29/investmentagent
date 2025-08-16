import React, { useState, useEffect } from 'react';
import { Pivot, PivotItem, Toggle } from '@fluentui/react';
import { ModernIconButton } from './ModernButton';

interface TabletLayoutProps {
  liveGuidanceComponent: React.ReactNode;
  sentimentComponent: React.ReactNode;
  transcriptComponent: React.ReactNode;
  recommendationComponent: React.ReactNode;
  isRecording: boolean;
}

export const TabletLayout: React.FC<TabletLayoutProps> = ({
  liveGuidanceComponent,
  sentimentComponent,
  transcriptComponent,
  recommendationComponent,
  isRecording
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('transcript');
  const [dualPaneMode, setDualPaneMode] = useState(false);
  const [secondaryKey, setSecondaryKey] = useState<string>('recommendation');
  const [autoRotate, setAutoRotate] = useState(false);

  // Auto-rotation for demo/presentation mode
  useEffect(() => {
    if (!autoRotate) return;
    
    const tabs = ['transcript', 'guidance', 'sentiment', 'recommendation'];
    let currentIndex = tabs.indexOf(selectedKey);
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % tabs.length;
      setSelectedKey(tabs[currentIndex]);
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(interval);
  }, [autoRotate, selectedKey]);

  const tabItems = [
    {
      key: 'transcript',
      headerText: '📝 Transcript',
      content: transcriptComponent,
      badge: isRecording ? '●' : null,
      color: '#0066cc'
    },
    {
      key: 'guidance',
      headerText: '🤖 Live Guidance',
      content: liveGuidanceComponent,
      badge: isRecording ? '●' : null,
      color: '#10b981'
    },
    {
      key: 'sentiment',
      headerText: '📊 Sentiment',
      content: sentimentComponent,
      badge: null,
      color: '#f59e0b'
    },
    {
      key: 'recommendation',
      headerText: '💡 Recommendations',
      content: recommendationComponent,
      badge: null,
      color: '#8b5cf6'
    }
  ];

  const renderSinglePane = () => (
    <div className="tablet-layout-single" style={{
      height: `calc(100vh - 140px)`,
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '2px solid var(--border-primary)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <Pivot
        selectedKey={selectedKey}
        onLinkClick={(item) => setSelectedKey(item?.props.itemKey || 'transcript')}
        styles={{
          root: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          },
          link: {
            padding: '12px 20px',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          },
          linkIsSelected: {
            backgroundColor: 'var(--color-primary)',
            color: 'var(--text-inverse)',
            borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0'
          },
          linkContent: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }
        }}
      >
        {tabItems.map((item) => (
          <PivotItem
            key={item.key}
            itemKey={item.key}
            headerText={item.headerText}
            style={{ height: 'calc(100% - 44px)' }}
          >
            <div style={{
              height: '100%',
              overflow: 'auto',
              padding: 'var(--spacing-lg)',
              background: 'var(--bg-secondary)',
              position: 'relative'
            }}>
              {item.badge && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ff4444',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 600
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s infinite'
                  }} />
                  LIVE
                </div>
              )}
              {item.content}
            </div>
          </PivotItem>
        ))}
      </Pivot>
    </div>
  );

  const renderDualPane = () => {
    const primaryItem = tabItems.find(item => item.key === selectedKey);
    const secondaryItem = tabItems.find(item => item.key === secondaryKey);
    
    return (
      <div className="tablet-layout-dual" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--spacing-md)',
        height: `calc(100vh - 140px)`
      }}>
        {/* Primary Pane */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--border-primary)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{
            padding: 'var(--spacing-md)',
            background: primaryItem?.color || 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h4 style={{ margin: 0 }}>{primaryItem?.headerText}</h4>
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white'
              }}
            >
              {tabItems.map(item => (
                <option key={item.key} value={item.key} style={{ color: 'black' }}>
                  {item.headerText}
                </option>
              ))}
            </select>
          </div>
          <div style={{
            height: 'calc(100% - 60px)',
            overflow: 'auto',
            padding: 'var(--spacing-lg)'
          }}>
            {primaryItem?.content}
          </div>
        </div>

        {/* Secondary Pane */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--border-primary)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{
            padding: 'var(--spacing-md)',
            background: secondaryItem?.color || 'var(--color-secondary)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h4 style={{ margin: 0 }}>{secondaryItem?.headerText}</h4>
            <select
              value={secondaryKey}
              onChange={(e) => setSecondaryKey(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white'
              }}
            >
              {tabItems.filter(item => item.key !== selectedKey).map(item => (
                <option key={item.key} value={item.key} style={{ color: 'black' }}>
                  {item.headerText}
                </option>
              ))}
            </select>
          </div>
          <div style={{
            height: 'calc(100% - 60px)',
            overflow: 'auto',
            padding: 'var(--spacing-lg)'
          }}>
            {secondaryItem?.content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tablet-layout">
      {/* Controls */}
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
          <Toggle
            label="Dual Pane Mode"
            checked={dualPaneMode}
            onChange={(_, checked) => setDualPaneMode(!!checked)}
          />
          
          <Toggle
            label="Auto Rotate (Demo)"
            checked={autoRotate}
            onChange={(_, checked) => setAutoRotate(!!checked)}
            disabled={dualPaneMode}
          />
        </div>

        {/* Quick Navigation */}
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
          {tabItems.map((item) => (
            <ModernIconButton
              key={item.key}
              icon={item.headerText.split(' ')[0]} // Emoji as icon
              title={item.headerText}
              variant={selectedKey === item.key ? 'primary' : 'secondary'}
              onClick={() => setSelectedKey(item.key)}
              size="small"
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      {dualPaneMode ? renderDualPane() : renderSinglePane()}

      {/* Progress Indicator for Auto-Rotate */}
      {autoRotate && !dualPaneMode && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg-card)',
          padding: '8px 16px',
          borderRadius: '20px',
          border: '1px solid var(--border-primary)',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            animation: 'pulse 1s infinite'
          }} />
          Auto-rotating tabs every 8s
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 1024px) {
          .tablet-layout-dual {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .tablet-layout-dual {
            grid-template-rows: 1fr;
            height: calc(50vh - 70px);
          }
          
          .tablet-layout-dual > div:last-child {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
