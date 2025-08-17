import React, { useState, useEffect } from 'react';

interface CommandCenterLayoutProps {
  liveGuidanceComponent: React.ReactNode;
  sentimentComponent: React.ReactNode;
  transcriptComponent: React.ReactNode;
  recommendationComponent: React.ReactNode;
  isRecording: boolean;
}

// Compact sentiment gauge component optimized for dashboard
const CompactSentimentBar: React.FC<{ sentimentData: any }> = ({ sentimentData }) => {
  const currentSentiment = sentimentData?.current?.overall?.sentiment || 'neutral';
  const score = sentimentData?.current?.overall?.confidenceScores?.[currentSentiment] || 0;

  return (
    <div className={`pill ${currentSentiment}`}>
      <div className="dot" />
      <span className="pill-label">{currentSentiment}</span>
      <span className="pill-score">{Math.round(score * 100)}%</span>
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
    <div className={`ticker${isRecording ? ' recording' : ''}`}>
      {isRecording && <span className="rec-dot" />}
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
  <div className="recommendation-preview">
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
    <div className="command-center">
      {/* Top Command Bar - Horizontal metrics strip */}
      {showMetrics && (
        <div className="command-bar">
          <div className="metrics-left">
            <div className="metrics-title">
              🎯 LIVE ANALYTICS
            </div>
            <CompactSentimentBar sentimentData={null} />
            <LiveGuidanceTicker guidance="" isRecording={isRecording} />
          </div>
          <div className="metrics-right">
            <RecommendationPreview recommendation="" isGenerating={false} />
            <button onClick={() => setShowMetrics(false)} className="button-reset" title="Hide metrics bar">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="command-grid">
        {/* Primary Content Area */}
        <div className="content-main">
          {/* Focus Tabs */}
          <div className="tabs">
            <button onClick={() => setFocusArea('transcript')} className={`tab${focusArea === 'transcript' ? ' active' : ''}`}>
              📝 TRANSCRIPT
            </button>
            <button onClick={() => setFocusArea('recommendation')} className={`tab${focusArea === 'recommendation' ? ' active' : ''}`}>
              💡 RECOMMENDATIONS
            </button>
          </div>

          {/* Focus Content */}
          <div className="focus-content">
            {focusArea === 'transcript' && transcriptComponent}
            {focusArea === 'recommendation' && recommendationComponent}
          </div>
        </div>

        {/* Right Sidebar - Contextual Information */}
        <div className="sidebar">
          {/* Sidebar Header */}
          <div className="sidebar-header">
            🤖 LIVE GUIDANCE
          </div>

          {/* Live Guidance Content */}
          <div className="sidebar-content">
            {liveGuidanceComponent}
          </div>

          {/* Sentiment Details */}
          <div className="sidebar-sentiment">
            <div className="sidebar-sentiment-title">
              📊 SENTIMENT DETAILS
            </div>
            {sentimentComponent}
          </div>
        </div>
      </div>

      {/* Collapsed Metrics Bar */}
      {!showMetrics && (
        <div className="metrics-fab" onClick={() => setShowMetrics(true)}>
          📊 Show Analytics Bar
        </div>
      )}
    </div>
  );
};
