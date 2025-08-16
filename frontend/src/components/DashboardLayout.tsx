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
    <div className="dashboard-grid" style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: 'var(--spacing-md)',
      height: `calc(100vh - ${compactMode ? '120px' : '180px'})`,
      overflow: 'hidden'
    }}>
      {/* Top Left - Live Guidance */}
      <div className="panel-container live-guidance" style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--border-primary)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: isRecording ? '0 0 20px rgba(0, 102, 204, 0.3)' : 'var(--shadow-md)'
      }}>
        <div className="panel-header" style={{
          padding: 'var(--spacing-sm)',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-header)',
          color: 'var(--text-inverse)'
        }}>
          <h4 style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
            🤖 Live Guidance {isRecording && <span className="live-indicator">●</span>}
          </h4>
          <IconButton
            iconProps={{ iconName: 'FullScreen' }}
            onClick={() => setFocusedPanel(focusedPanel === 'guidance' ? null : 'guidance')}
            styles={{ root: { color: 'var(--text-inverse)' } }}
          />
        </div>
        <div style={{ height: 'calc(100% - 48px)', overflow: 'auto', padding: 'var(--spacing-sm)' }}>
          {liveGuidanceComponent}
        </div>
      </div>

      {/* Top Right - Sentiment */}
      <div className="panel-container sentiment" style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--border-primary)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div className="panel-header" style={{
          padding: 'var(--spacing-sm)',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-header)',
          color: 'var(--text-inverse)'
        }}>
          <h4 style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>📊 Sentiment Analysis</h4>
          <IconButton
            iconProps={{ iconName: 'FullScreen' }}
            onClick={() => setFocusedPanel(focusedPanel === 'sentiment' ? null : 'sentiment')}
            styles={{ root: { color: 'var(--text-inverse)' } }}
          />
        </div>
        <div style={{ height: 'calc(100% - 48px)', overflow: 'auto', padding: 'var(--spacing-sm)' }}>
          {sentimentComponent}
        </div>
      </div>

      {/* Bottom Left - Transcript */}
      <div className="panel-container transcript" style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--border-primary)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div className="panel-header" style={{
          padding: 'var(--spacing-sm)',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-header)',
          color: 'var(--text-inverse)'
        }}>
          <h4 style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>📝 Real-Time Transcript</h4>
          <IconButton
            iconProps={{ iconName: 'FullScreen' }}
            onClick={() => setFocusedPanel(focusedPanel === 'transcript' ? null : 'transcript')}
            styles={{ root: { color: 'var(--text-inverse)' } }}
          />
        </div>
        <div style={{ height: 'calc(100% - 48px)', overflow: 'auto', padding: 'var(--spacing-sm)' }}>
          {transcriptComponent}
        </div>
      </div>

      {/* Bottom Right - Recommendations */}
      <div className="panel-container recommendation" style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--border-primary)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div className="panel-header" style={{
          padding: 'var(--spacing-sm)',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-header)',
          color: 'var(--text-inverse)'
        }}>
          <h4 style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>💡 Investment Recommendations</h4>
          <IconButton
            iconProps={{ iconName: 'FullScreen' }}
            onClick={() => setFocusedPanel(focusedPanel === 'recommendation' ? null : 'recommendation')}
            styles={{ root: { color: 'var(--text-inverse)' } }}
          />
        </div>
        <div style={{ height: 'calc(100% - 48px)', overflow: 'auto', padding: 'var(--spacing-sm)' }}>
          {recommendationComponent}
        </div>
      </div>
    </div>
  );

  const renderSplitLayout = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 'var(--spacing-md)',
      height: `calc(100vh - ${compactMode ? '120px' : '180px'})`
    }}>
      <div style={{
        display: 'grid',
        gridTemplateRows: '1fr 1fr',
        gap: 'var(--spacing-md)'
      }}>
        <div className="panel-container" style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--border-primary)',
          overflow: 'hidden'
        }}>
          <div className="panel-header" style={{
            padding: 'var(--spacing-sm)',
            background: 'var(--bg-header)',
            color: 'var(--text-inverse)'
          }}>
            <h4 style={{ margin: 0 }}>📝 Real-Time Transcript</h4>
          </div>
          <div style={{ height: 'calc(100% - 48px)', overflow: 'auto', padding: 'var(--spacing-sm)' }}>
            {transcriptComponent}
          </div>
        </div>
        <div className="panel-container" style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--border-primary)',
          overflow: 'hidden'
        }}>
          <div className="panel-header" style={{
            padding: 'var(--spacing-sm)',
            background: 'var(--bg-header)',
            color: 'var(--text-inverse)'
          }}>
            <h4 style={{ margin: 0 }}>💡 Investment Recommendations</h4>
          </div>
          <div style={{ height: 'calc(100% - 48px)', overflow: 'auto', padding: 'var(--spacing-sm)' }}>
            {recommendationComponent}
          </div>
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateRows: '1fr 1fr',
        gap: 'var(--spacing-md)'
      }}>
        <div className="panel-container" style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--border-primary)',
          overflow: 'hidden'
        }}>
          <div className="panel-header" style={{
            padding: 'var(--spacing-sm)',
            background: 'var(--bg-header)',
            color: 'var(--text-inverse)'
          }}>
            <h4 style={{ margin: 0 }}>🤖 Live Guidance</h4>
          </div>
          <div style={{ height: 'calc(100% - 48px)', overflow: 'auto', padding: 'var(--spacing-sm)' }}>
            {liveGuidanceComponent}
          </div>
        </div>
        <div className="panel-container" style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--border-primary)',
          overflow: 'hidden'
        }}>
          <div className="panel-header" style={{
            padding: 'var(--spacing-sm)',
            background: 'var(--bg-header)',
            color: 'var(--text-inverse)'
          }}>
            <h4 style={{ margin: 0 }}>📊 Sentiment</h4>
          </div>
          <div style={{ height: 'calc(100% - 48px)', overflow: 'auto', padding: 'var(--spacing-sm)' }}>
            {sentimentComponent}
          </div>
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
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--spacing-lg)'
      }} onClick={() => setFocusedPanel(null)}>
        <div style={{
          width: '90%',
          height: '90%',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--border-primary)',
          overflow: 'hidden'
        }} onClick={(e) => e.stopPropagation()}>
          <div className="panel-header" style={{
            padding: 'var(--spacing-md)',
            background: 'var(--bg-header)',
            color: 'var(--text-inverse)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0 }}>
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
          <div style={{ height: 'calc(100% - 60px)', overflow: 'auto', padding: 'var(--spacing-lg)' }}>
            {components[focusedPanel as keyof typeof components]}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
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
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Layout:</span>
          <select 
            value={layout} 
            onChange={(e) => setLayout(e.target.value as any)}
            style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-secondary)'
            }}
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
      {isRecording && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#ff4444',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 600,
          zIndex: 999,
          animation: 'pulse 1.5s infinite'
        }}>
          ● LIVE RECORDING
        </div>
      )}

      <style>{`
        .live-indicator {
          color: #ff4444;
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
