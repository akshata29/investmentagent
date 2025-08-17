import React, { useState, useEffect } from 'react';

interface ContextualFlowLayoutProps {
  liveGuidanceComponent: React.ReactNode;
  sentimentComponent: React.ReactNode;
  transcriptComponent: React.ReactNode;
  recommendationComponent: React.ReactNode;
  isRecording: boolean;
}

// Smart card that adapts its content based on context
const AdaptiveCard: React.FC<{
  title: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  children: React.ReactNode;
  isActive?: boolean;
  onActivate?: () => void;
  metrics?: { label: string; value: string; color: string }[];
}> = ({ title, icon, priority, children, isActive, onActivate, metrics }) => {
  return (
    <div onClick={onActivate} className={`adaptive-card ${priority}${isActive ? ' active' : ''}${onActivate ? ' clickable' : ''}`}>
      {/* Card Header */}
      <div className="card-header">
        <div className="card-header-left">
          <span className="card-icon">{icon}</span>
          <span className="card-title">
            {title}
          </span>
        </div>
        
        {metrics && (
          <div className="card-metrics">
            {metrics.map((metric, index) => (
              <div key={index} className="metric-chip">
                {metric.value}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

// Contextual action bar
const ContextualActionBar: React.FC<{
  isRecording: boolean;
  currentContext: string;
  onAction: (action: string) => void;
}> = ({ isRecording, currentContext, onAction }) => (
  <div className="contextual-bar">
    <div className="bar-left">
      <div className="status">
        <div className={`status-dot ${isRecording ? 'on' : 'off'}`} />
        {isRecording ? 'ACTIVE SESSION' : 'READY'}
      </div>
      <div className="context-text">Context: {currentContext}</div>
    </div>

    <div className="bar-actions">
      <button onClick={() => onAction('generate')} className="btn btn-primary">
        Generate Recommendations
      </button>
      <button onClick={() => onAction('export')} className="btn btn-secondary">
        Export Session
      </button>
    </div>
  </div>
);

export const ContextualFlowLayout: React.FC<ContextualFlowLayoutProps> = ({
  liveGuidanceComponent,
  sentimentComponent,
  transcriptComponent,
  recommendationComponent,
  isRecording
}) => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [context, setContext] = useState('conversation-analysis');

  // Smart priority calculation based on recording state and content
  const getTranscriptPriority = (): 'high' | 'medium' | 'low' => isRecording ? 'high' : 'medium';
  const getGuidancePriority = (): 'high' | 'medium' | 'low' => isRecording ? 'high' : 'low';
  const getRecommendationPriority = (): 'high' | 'medium' | 'low' => activeCard === 'recommendation' ? 'high' : 'medium';
  const getSentimentPriority = (): 'high' | 'medium' | 'low' => 'low';

  const handleAction = (action: string) => {
    console.log('Action:', action);
    if (action === 'generate') {
      setActiveCard('recommendation');
      setContext('recommendation-generation');
    }
  };

  return (
    <div className="contextual-flow">
      {/* Contextual Action Bar */}
      <ContextualActionBar
        isRecording={isRecording}
        currentContext={context}
        onAction={handleAction}
      />

      {/* Main Flow Area */}
      <div className={`flow-grid ${isRecording ? 'recording' : 'idle'}`}>
        {/* Transcript - Highest priority when recording */}
        <div className="grid-transcript">
          <AdaptiveCard
            title="Real-Time Transcript"
            icon="📝"
            priority={getTranscriptPriority()}
            isActive={activeCard === 'transcript'}
            onActivate={() => setActiveCard(activeCard === 'transcript' ? null : 'transcript')}
            metrics={[
              { label: 'Words', value: '1,247', color: 'var(--color-primary)' },
              { label: 'Time', value: '12:34', color: 'var(--accent-green)' }
            ]}
          >
            {transcriptComponent}
          </AdaptiveCard>
        </div>

        {/* Live Guidance - High priority when recording */}
        <div className="grid-guidance">
          <AdaptiveCard
            title="Live Guidance"
            icon="🤖"
            priority={getGuidancePriority()}
            isActive={activeCard === 'guidance'}
            onActivate={() => setActiveCard(activeCard === 'guidance' ? null : 'guidance')}
            metrics={isRecording ? [
              { label: 'Active', value: '3', color: 'var(--accent-green)' }
            ] : undefined}
          >
            {liveGuidanceComponent}
          </AdaptiveCard>
        </div>

        {/* Recommendations - Contextual priority */}
        <div className="grid-recommendation">
          <AdaptiveCard
            title="Investment Recommendations"
            icon="💡"
            priority={getRecommendationPriority()}
            isActive={activeCard === 'recommendation'}
            onActivate={() => setActiveCard(activeCard === 'recommendation' ? null : 'recommendation')}
            metrics={[
              { label: 'Ready', value: '✓', color: 'var(--accent-purple)' }
            ]}
          >
            {recommendationComponent}
          </AdaptiveCard>
        </div>

        {/* Sentiment - Lower priority, contextual display */}
        {!isRecording && (
          <div className="grid-sentiment">
            <AdaptiveCard
              title="Sentiment & Analytics"
              icon="📊"
              priority={getSentimentPriority()}
              isActive={activeCard === 'sentiment'}
              onActivate={() => setActiveCard(activeCard === 'sentiment' ? null : 'sentiment')}
              metrics={[
                { label: 'Positive', value: '67%', color: 'var(--accent-green)' },
                { label: 'Confidence', value: '89%', color: 'var(--accent-orange)' }
              ]}
            >
              {sentimentComponent}
            </AdaptiveCard>
          </div>
        )}
      </div>

      {/* Context-sensitive bottom bar */}
      {isRecording && (
        <div className="recording-bar">
          🎤 Recording in progress - AI analysis and guidance are being generated in real-time
        </div>
      )}
    </div>
  );
};
