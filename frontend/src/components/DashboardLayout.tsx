import React, { useState } from 'react';
import { Toggle, IconButton } from '@fluentui/react';
import { FullScreenMaximize24Regular, FullScreenMinimize24Regular } from '@fluentui/react-icons';

interface DashboardLayoutProps {
  liveGuidanceComponent: React.ReactNode;
  sentimentComponent: React.ReactNode;
  transcriptComponent: React.ReactNode;
  recommendationComponent: React.ReactNode;
  isRecording: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  liveGuidanceComponent,
  sentimentComponent,
  transcriptComponent,
  recommendationComponent,
  isRecording
}) => {
  const [layout, setLayout] = useState<'grid' | 'split' | 'focus'>('grid');
  const [focusedPanel, setFocusedPanel] = useState<string | null>(null);
  const [compactMode, setCompactMode] = useState(false);

  const renderGridLayout = () => (
    <div className={`dashboard-grid ${compactMode ? 'compact' : ''}`}>
      {/* Top Left - Live Guidance */}
      <div className={`panel-container live-guidance ${isRecording ? 'recording' : ''}`}>
        <div className="panel-header">
          <h4 className="panel-title">
            🤖 Live Guidance {isRecording && <span className="live-indicator">●</span>}
          </h4>
          <IconButton
            iconProps={{ iconName: 'FullScreen' }}
            onClick={() => setFocusedPanel(focusedPanel === 'guidance' ? null : 'guidance')}
            styles={{ root: { color: 'var(--text-inverse)' } }}
          />
        </div>
        <div className="panel-body">
          {liveGuidanceComponent}
        </div>
      </div>

      {/* Top Right - Sentiment */}
      <div className="panel-container sentiment">
        <div className="panel-header">
          <h4 className="panel-title">📊 Sentiment Analysis</h4>
          <IconButton
            iconProps={{ iconName: 'FullScreen' }}
            onClick={() => setFocusedPanel(focusedPanel === 'sentiment' ? null : 'sentiment')}
            styles={{ root: { color: 'var(--text-inverse)' } }}
          />
        </div>
        <div className="panel-body">
          {sentimentComponent}
        </div>
      </div>

      {/* Bottom Left - Transcript */}
      <div className="panel-container transcript">
        <div className="panel-header">
          <h4 className="panel-title">📝 Real-Time Transcript</h4>
          <IconButton
            iconProps={{ iconName: 'FullScreen' }}
            onClick={() => setFocusedPanel(focusedPanel === 'transcript' ? null : 'transcript')}
            styles={{ root: { color: 'var(--text-inverse)' } }}
          />
        </div>
        <div className="panel-body">
          {transcriptComponent}
        </div>
      </div>

      {/* Bottom Right - Recommendations */}
      <div className="panel-container recommendation">
        <div className="panel-header">
          <h4 className="panel-title">💡 Investment Recommendations</h4>
          <IconButton
            iconProps={{ iconName: 'FullScreen' }}
            onClick={() => setFocusedPanel(focusedPanel === 'recommendation' ? null : 'recommendation')}
            styles={{ root: { color: 'var(--text-inverse)' } }}
          />
        </div>
        <div className="panel-body">
          {recommendationComponent}
        </div>
      </div>
    </div>
  );

  const renderSplitLayout = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-md)', height: `calc(100vh - ${compactMode ? '120px' : '180px'})` }}>
      <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 'var(--spacing-md)' }}>
        <div className="panel-container">
          <div className="panel-header">
            <h4 className="panel-title">📝 Real-Time Transcript</h4>
          </div>
          <div className="panel-body">{transcriptComponent}</div>
        </div>
        <div className="panel-container">
          <div className="panel-header">
            <h4 className="panel-title">💡 Investment Recommendations</h4>
          </div>
          <div className="panel-body">{recommendationComponent}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 'var(--spacing-md)' }}>
        <div className="panel-container">
          <div className="panel-header">
            <h4 className="panel-title">🤖 Live Guidance</h4>
          </div>
          <div className="panel-body">{liveGuidanceComponent}</div>
        </div>
        <div className="panel-container">
          <div className="panel-header">
            <h4 className="panel-title">📊 Sentiment</h4>
          </div>
          <div className="panel-body">{sentimentComponent}</div>
        </div>
      </div>
    </div>
  );

  const renderFocusedPanel = () => {
    if (!focusedPanel) return null;
    
    const components = {
      guidance: liveGuidanceComponent,
      sentiment: sentimentComponent,
      transcript: transcriptComponent,
      recommendation: recommendationComponent
    };

    return (
      <div className="overlay" onClick={() => setFocusedPanel(null)}>
        <div className="overlay-card" onClick={(e) => e.stopPropagation()}>
          <div className="overlay-header">
            <h3 className="overlay-title">
              {focusedPanel === 'guidance' && '🤖 Live Guidance - Full View'}
              {focusedPanel === 'sentiment' && '📊 Sentiment Analysis - Full View'}
              {focusedPanel === 'transcript' && '📝 Real-Time Transcript - Full View'}
              {focusedPanel === 'recommendation' && '💡 Investment Recommendations - Full View'}
            </h3>
            <IconButton
              iconProps={{ iconName: 'ChromeClose' }}
              onClick={() => setFocusedPanel(null)}
              styles={{ root: { color: 'var(--text-inverse)' } }}
            />
          </div>
          <div className="overlay-body">
            {components[focusedPanel as keyof typeof components]}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      {/* Layout Controls */}
      <div className="layout-controls">
        <div className="left-group">
          <span className="text-sm fw-600">Layout:</span>
          <select 
            value={layout} 
            onChange={(e) => setLayout(e.target.value as any)}
            className="select"
          >
            <option value="grid">📐 Grid (2x2)</option>
            <option value="split">📊 Split (Main + Side)</option>
          </select>
        </div>
        
        <Toggle
          label="Compact Mode"
          checked={compactMode}
          onChange={(_, checked) => setCompactMode(!!checked)}
        />
      </div>

      {/* Main Layout */}
      {layout === 'grid' && renderGridLayout()}
      {layout === 'split' && renderSplitLayout()}
      
      {/* Focused Panel Overlay */}
      {renderFocusedPanel()}

    {/* Live Recording Indicator */}
  {isRecording && (<div className="live-badge">● LIVE RECORDING</div>)}

      <style>{`
        .live-indicator {
          color: var(--accent-red);
          animation: pulse 1.5s infinite;
          margin-left: 8px;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .panel-container {
          transition: all 0.3s ease;
        }

        .panel-container:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg) !important;
        }

        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            height: auto;
          }
          
          .panel-container {
            min-height: 200px;
          }
        }
      `}</style>
    </div>
  );
};
