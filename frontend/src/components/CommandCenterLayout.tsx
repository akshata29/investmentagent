import React, { useState, useEffect } from 'react';
import { Toggle } from '@fluentui/react';

interface CommandCenterLayoutProps {
  liveGuidanceComponent: React.ReactNode;
  sentimentComponent: React.ReactNode;
  transcriptComponent: React.ReactNode;
  recommendationComponent: React.ReactNode;
  isRecording: boolean;
}

// Compact sentiment gauge component optimized for dashboard
const CompactSentimentBar: React.FC<{ sentimentData: any }> = ({ sentimentData }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      case 'neutral': return '#64748b';
      case 'mixed': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const currentSentiment = sentimentData?.current?.overall?.sentiment || 'neutral';
  const score = sentimentData?.current?.overall?.confidenceScores?.[currentSentiment] || 0;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      background: 'var(--bg-secondary)',
      borderRadius: '20px',
      border: `2px solid ${getSentimentColor(currentSentiment)}`,
      minWidth: '120px'
    }}>
      <div style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: getSentimentColor(currentSentiment)
      }} />
      <span style={{ 
        fontSize: '11px', 
        fontWeight: 600,
        textTransform: 'capitalize',
        color: 'var(--text-primary)'
      }}>
        {currentSentiment}
      </span>
      <span style={{ 
        fontSize: '10px', 
        color: 'var(--text-secondary)' 
      }}>
        {Math.round(score * 100)}%
      </span>
    </div>
  );
};

// Compact live guidance ticker
const LiveGuidanceTicker: React.FC<{ guidance: string; isRecording: boolean }> = ({ guidance, isRecording }) => {
  const [currentTask, setCurrentTask] = useState('');

  useEffect(() => {
    if (guidance) {
      const tasks = guidance.split('\n').filter(t => t.trim());
      if (tasks.length > 0) {
        setCurrentTask(tasks[tasks.length - 1]); // Get latest task
      }
    }
  }, [guidance]);

  return (
    <div style={{
      background: isRecording ? 'linear-gradient(90deg, #10b981, #0066cc)' : 'var(--bg-secondary)',
      color: isRecording ? 'white' : 'var(--text-primary)',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 500,
      maxWidth: '300px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      animation: isRecording ? 'pulse 2s infinite' : 'none'
    }}>
      {isRecording && (
        <span style={{ 
          display: 'inline-block', 
          width: '6px', 
          height: '6px', 
          background: '#ff4444', 
          borderRadius: '50%', 
          marginRight: '8px',
          animation: 'pulse 1s infinite'
        }} />
      )}
      {currentTask || 'Ready for guidance...'}
    </div>
  );
};

// Compact recommendation preview
const RecommendationPreview: React.FC<{ recommendation: string; isGenerating: boolean }> = ({ recommendation, isGenerating }) => {
  const getPreview = () => {
    if (isGenerating) return '🔄 Generating recommendations...';
    if (recommendation.includes('***Waiting')) return '⏳ Waiting for client information...';
    if (recommendation.includes('Error')) return '⚠️ Error generating recommendations';
    
    // Extract first meaningful sentence
    const sentences = recommendation.split('.').filter(s => s.trim().length > 20);
    return sentences[0]?.trim() + (sentences.length > 1 ? '...' : '') || 'No recommendations yet';
  };

  return (
    <div style={{
      background: 'var(--bg-info)',
      border: '1px solid var(--border-primary)',
      borderRadius: '6px',
      padding: '8px 12px',
      fontSize: '12px',
      maxWidth: '250px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }}>
      {getPreview()}
    </div>
  );
};

export const CommandCenterLayout: React.FC<CommandCenterLayoutProps> = ({
  liveGuidanceComponent,
  sentimentComponent,
  transcriptComponent,
  recommendationComponent,
  isRecording
}) => {
  const [focusArea, setFocusArea] = useState<'transcript' | 'recommendation'>('transcript');
  const [showMetrics, setShowMetrics] = useState(true);

  return (
    <div style={{ 
      height: 'calc(100vh - 140px)', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>
      {/* Top Command Bar - Horizontal metrics strip */}
      {showMetrics && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          background: 'var(--bg-card)',
          borderBottom: '2px solid var(--border-primary)',
          minHeight: '50px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
              🎯 LIVE ANALYTICS
            </div>
            <CompactSentimentBar sentimentData={null} />
            <LiveGuidanceTicker guidance="" isRecording={isRecording} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <RecommendationPreview recommendation="" isGenerating={false} />
            <button
              onClick={() => setShowMetrics(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              title="Hide metrics bar"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'grid', 
        gridTemplateColumns: '1fr 320px',
        gap: '1px',
        background: 'var(--border-primary)',
        overflow: 'hidden'
      }}>
        {/* Primary Content Area */}
        <div style={{
          background: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Focus Tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-primary)'
          }}>
            <button
              onClick={() => setFocusArea('transcript')}
              style={{
                padding: '12px 24px',
                background: focusArea === 'transcript' ? 'var(--color-primary)' : 'transparent',
                color: focusArea === 'transcript' ? 'white' : 'var(--text-primary)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '0'
              }}
            >
              📝 TRANSCRIPT
            </button>
            <button
              onClick={() => setFocusArea('recommendation')}
              style={{
                padding: '12px 24px',
                background: focusArea === 'recommendation' ? 'var(--color-primary)' : 'transparent',
                color: focusArea === 'recommendation' ? 'white' : 'var(--text-primary)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '0'
              }}
            >
              💡 RECOMMENDATIONS
            </button>
          </div>

          {/* Focus Content */}
          <div style={{ 
            flex: 1, 
            padding: '16px', 
            overflow: 'auto',
            background: 'var(--bg-secondary)'
          }}>
            {focusArea === 'transcript' && transcriptComponent}
            {focusArea === 'recommendation' && recommendationComponent}
          </div>
        </div>

        {/* Right Sidebar - Contextual Information */}
        <div style={{
          background: 'var(--bg-card)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Sidebar Header */}
          <div style={{
            padding: '12px 16px',
            background: 'var(--bg-header)',
            color: 'white',
            fontSize: '12px',
            fontWeight: 600,
            borderBottom: '1px solid var(--border-primary)'
          }}>
            🤖 LIVE GUIDANCE
          </div>

          {/* Live Guidance Content */}
          <div style={{
            flex: 1,
            padding: '12px',
            overflow: 'auto',
            fontSize: '13px'
          }}>
            {liveGuidanceComponent}
          </div>

          {/* Sentiment Details */}
          <div style={{
            borderTop: '1px solid var(--border-primary)',
            padding: '12px',
            background: 'var(--bg-secondary)',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📊 SENTIMENT DETAILS
            </div>
            {sentimentComponent}
          </div>
        </div>
      </div>

      {/* Collapsed Metrics Bar */}
      {!showMetrics && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg-card)',
          padding: '8px 16px',
          borderRadius: '20px',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-lg)',
          cursor: 'pointer',
          fontSize: '12px'
        }} onClick={() => setShowMetrics(true)}>
          📊 Show Analytics Bar
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
