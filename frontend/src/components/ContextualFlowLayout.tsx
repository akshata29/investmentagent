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
  const getPriorityStyles = () => {
    switch (priority) {
      case 'high':
        return {
          border: '2px solid #ef4444',
          background: isActive ? '#fef2f2' : 'var(--bg-card)',
          headerBg: '#ef4444'
        };
      case 'medium':
        return {
          border: '2px solid #f59e0b',
          background: isActive ? '#fffbeb' : 'var(--bg-card)',
          headerBg: '#f59e0b'
        };
      case 'low':
        return {
          border: '1px solid var(--border-primary)',
          background: isActive ? 'var(--bg-secondary)' : 'var(--bg-card)',
          headerBg: 'var(--bg-header)'
        };
    }
  };

  const styles = getPriorityStyles();

  return (
    <div
      onClick={onActivate}
      style={{
        border: styles.border,
        background: styles.background,
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: onActivate ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        boxShadow: isActive ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transform: isActive ? 'scale(1.02)' : 'scale(1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Card Header */}
      <div style={{
        background: styles.headerBg,
        color: 'white',
        padding: '8px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '36px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>{icon}</span>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {title}
          </span>
        </div>
        
        {metrics && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {metrics.map((metric, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '2px 6px',
                borderRadius: '8px',
                fontSize: '10px',
                fontWeight: 600
              }}>
                {metric.value}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{
        flex: 1,
        padding: isActive ? '16px' : '12px',
        overflow: 'auto',
        fontSize: isActive ? '14px' : '12px',
        lineHeight: 1.5
      }}>
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
  <div style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--border-primary)',
    borderRadius: '12px',
    padding: '8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: 'var(--shadow-sm)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        fontWeight: 600,
        color: 'var(--text-primary)'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: isRecording ? '#10b981' : '#64748b',
          animation: isRecording ? 'pulse 1.5s infinite' : 'none'
        }} />
        {isRecording ? 'ACTIVE SESSION' : 'READY'}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
        Context: {currentContext}
      </div>
    </div>

    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={() => onAction('generate')}
        style={{
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '6px 12px',
          fontSize: '11px',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        Generate Recommendations
      </button>
      <button
        onClick={() => onAction('export')}
        style={{
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '6px',
          padding: '6px 12px',
          fontSize: '11px',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
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
    <div style={{
      height: 'calc(100vh - 140px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '16px',
      background: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>
      {/* Contextual Action Bar */}
      <ContextualActionBar
        isRecording={isRecording}
        currentContext={context}
        onAction={handleAction}
      />

      {/* Main Flow Area */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: isRecording ? '1fr 1fr' : '2fr 1fr 1fr',
        gridTemplateRows: isRecording ? '1fr 1fr' : '2fr 1fr',
        gap: '12px',
        overflow: 'hidden'
      }}>
        {/* Transcript - Highest priority when recording */}
        <div style={{
          gridColumn: isRecording ? '1 / 2' : '1 / 2',
          gridRow: isRecording ? '1 / 3' : '1 / 2'
        }}>
          <AdaptiveCard
            title="Real-Time Transcript"
            icon="📝"
            priority={getTranscriptPriority()}
            isActive={activeCard === 'transcript'}
            onActivate={() => setActiveCard(activeCard === 'transcript' ? null : 'transcript')}
            metrics={[
              { label: 'Words', value: '1,247', color: '#0066cc' },
              { label: 'Time', value: '12:34', color: '#10b981' }
            ]}
          >
            {transcriptComponent}
          </AdaptiveCard>
        </div>

        {/* Live Guidance - High priority when recording */}
        <div style={{
          gridColumn: isRecording ? '2 / 3' : '2 / 3',
          gridRow: isRecording ? '1 / 2' : '1 / 2'
        }}>
          <AdaptiveCard
            title="Live Guidance"
            icon="🤖"
            priority={getGuidancePriority()}
            isActive={activeCard === 'guidance'}
            onActivate={() => setActiveCard(activeCard === 'guidance' ? null : 'guidance')}
            metrics={isRecording ? [
              { label: 'Active', value: '3', color: '#10b981' }
            ] : undefined}
          >
            {liveGuidanceComponent}
          </AdaptiveCard>
        </div>

        {/* Recommendations - Contextual priority */}
        <div style={{
          gridColumn: isRecording ? '2 / 3' : '3 / 4',
          gridRow: isRecording ? '2 / 3' : '1 / 2'
        }}>
          <AdaptiveCard
            title="Investment Recommendations"
            icon="💡"
            priority={getRecommendationPriority()}
            isActive={activeCard === 'recommendation'}
            onActivate={() => setActiveCard(activeCard === 'recommendation' ? null : 'recommendation')}
            metrics={[
              { label: 'Ready', value: '✓', color: '#8b5cf6' }
            ]}
          >
            {recommendationComponent}
          </AdaptiveCard>
        </div>

        {/* Sentiment - Lower priority, contextual display */}
        {!isRecording && (
          <div style={{
            gridColumn: '1 / 4',
            gridRow: '2 / 3'
          }}>
            <AdaptiveCard
              title="Sentiment & Analytics"
              icon="📊"
              priority={getSentimentPriority()}
              isActive={activeCard === 'sentiment'}
              onActivate={() => setActiveCard(activeCard === 'sentiment' ? null : 'sentiment')}
              metrics={[
                { label: 'Positive', value: '67%', color: '#10b981' },
                { label: 'Confidence', value: '89%', color: '#f59e0b' }
              ]}
            >
              {sentimentComponent}
            </AdaptiveCard>
          </div>
        )}
      </div>

      {/* Context-sensitive bottom bar */}
      {isRecording && (
        <div style={{
          background: 'linear-gradient(90deg, #10b981, #0066cc)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 600,
          textAlign: 'center',
          animation: 'pulse 2s infinite'
        }}>
          🎤 Recording in progress - AI analysis and guidance are being generated in real-time
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.8; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
