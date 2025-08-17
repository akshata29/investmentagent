import React, { useState, useEffect } from 'react';

interface SpotlightLayoutProps {
  liveGuidanceComponent: React.ReactNode;
  sentimentComponent: React.ReactNode;
  transcriptComponent: React.ReactNode;
  recommendationComponent: React.ReactNode;
  isRecording: boolean;
}

// Smart mini-card for peripheral information
const MiniInfoCard: React.FC<{
  icon: string;
  title: string;
  content: React.ReactNode;
  accent: string;
  isActive?: boolean;
  onClick?: () => void;
}> = ({ icon, title, content, accent, isActive, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: isActive ? accent : 'var(--bg-card)',
      color: isActive ? 'white' : 'var(--text-primary)',
      border: `2px solid ${isActive ? accent : 'var(--border-primary)'}`,
      borderRadius: '8px',
      padding: '12px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      boxShadow: isActive ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: isActive ? 'scale(1.02)' : 'scale(1)',
      minHeight: '80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}
  >
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginBottom: '4px'
    }}>
      <span style={{ fontSize: '14px' }}>{icon}</span>
      <span style={{ 
        fontSize: '11px', 
        fontWeight: 600, 
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {title}
      </span>
    </div>
    <div style={{ 
      fontSize: '12px', 
      opacity: isActive ? 0.9 : 0.8,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    }}>
      {content}
    </div>
  </div>
);

// Live status indicator
const LiveStatusIndicator: React.FC<{ isRecording: boolean; transcriptCount: number }> = ({ 
  isRecording, 
  transcriptCount 
}) => (
  <div style={{
    position: 'absolute',
    top: '16px',
    right: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  background: isRecording ? 'var(--accent-red)' : 'var(--bg-secondary)',
    color: isRecording ? 'white' : 'var(--text-primary)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
    animation: isRecording ? 'pulse 1.5s infinite' : 'none',
    boxShadow: 'var(--shadow-sm)',
    zIndex: 10
  }}>
    <div style={{
      width: '6px',
      height: '6px',
      borderRadius: '50%',
  background: isRecording ? 'white' : 'var(--accent-green)',
      animation: isRecording ? 'pulse 1s infinite' : 'none'
    }} />
    {isRecording ? 'LIVE' : 'READY'}
    {transcriptCount > 0 && (
      <span style={{ 
        background: 'rgba(255,255,255,0.2)', 
        padding: '2px 6px', 
        borderRadius: '10px',
        fontSize: '10px'
      }}>
        {transcriptCount}
      </span>
    )}
  </div>
);

export const SpotlightLayout: React.FC<SpotlightLayoutProps> = ({
  liveGuidanceComponent,
  sentimentComponent,
  transcriptComponent,
  recommendationComponent,
  isRecording
}) => {
  const [spotlight, setSpotlight] = useState<'transcript' | 'recommendation'>('transcript');
  const [showPeripherals, setShowPeripherals] = useState(true);

  // Auto-switch spotlight based on activity
  useEffect(() => {
    if (isRecording) {
      setSpotlight('transcript');
    }
  }, [isRecording]);

  const spotlightContent = {
    transcript: {
      title: '📝 Real-Time Conversation',
      component: transcriptComponent,
  accent: 'var(--color-primary)'
    },
    recommendation: {
      title: '💡 Investment Recommendations',
      component: recommendationComponent,
  accent: 'var(--accent-purple)'
    }
  };

  return (
    <div style={{
      height: 'calc(100vh - 140px)',
      display: 'grid',
      gridTemplateColumns: showPeripherals ? '200px 1fr 200px' : '1fr',
      gridTemplateRows: showPeripherals ? '1fr auto' : '1fr',
      gap: '16px',
      padding: '16px',
      background: 'var(--bg-primary)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <LiveStatusIndicator isRecording={isRecording} transcriptCount={0} />

      {/* Left Peripheral - Live Guidance */}
      {showPeripherals && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '12px',
            border: '2px solid var(--border-primary)',
            overflow: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              background: 'var(--accent-green)',
              color: 'white',
              padding: '8px 12px',
              fontSize: '11px',
              fontWeight: 600,
              textAlign: 'center'
            }}>
              🤖 LIVE GUIDANCE
            </div>
            <div style={{
              flex: 1,
              padding: '8px',
              overflow: 'auto',
              fontSize: '11px'
            }}>
              {liveGuidanceComponent}
            </div>
          </div>
        </div>
      )}

      {/* Main Spotlight Area */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: `3px solid ${spotlightContent[spotlight].accent}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative'
      }}>
        {/* Spotlight Header */}
        <div style={{
          background: `linear-gradient(135deg, ${spotlightContent[spotlight].accent}, ${spotlightContent[spotlight].accent}dd)`,
          color: 'white',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: 600 
          }}>
            {spotlightContent[spotlight].title}
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setSpotlight('transcript')}
              style={{
                background: spotlight === 'transcript' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600
              }}
            >
              📝
            </button>
            <button
              onClick={() => setSpotlight('recommendation')}
              style={{
                background: spotlight === 'recommendation' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600
              }}
            >
              💡
            </button>
          </div>
        </div>

        {/* Spotlight Content */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflow: 'auto',
          background: 'var(--bg-secondary)',
          fontSize: '14px',
          lineHeight: 1.6
        }}>
          {spotlightContent[spotlight].component}
        </div>
      </div>

      {/* Right Peripheral - Sentiment */}
      {showPeripherals && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '12px',
            border: '2px solid var(--border-primary)',
            overflow: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              background: 'var(--accent-orange)',
              color: 'white',
              padding: '8px 12px',
              fontSize: '11px',
              fontWeight: 600,
              textAlign: 'center'
            }}>
              📊 SENTIMENT
            </div>
            <div style={{
              flex: 1,
              padding: '8px',
              overflow: 'auto',
              fontSize: '11px'
            }}>
              {sentimentComponent}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Quick Access (when peripherals are shown) */}
      {showPeripherals && (
        <div style={{
          gridColumn: '1 / -1',
          display: 'flex',
          gap: '12px',
          height: '120px'
        }}>
          <MiniInfoCard
            icon="📝"
            title="Transcript"
            content="Click to focus on conversation transcript"
            accent="var(--color-primary)"
            isActive={spotlight === 'transcript'}
            onClick={() => setSpotlight('transcript')}
          />
          <MiniInfoCard
            icon="💡"
            title="Recommendations"
            content="Click to focus on investment recommendations"
            accent="var(--accent-purple)"
            isActive={spotlight === 'recommendation'}
            onClick={() => setSpotlight('recommendation')}
          />
          <MiniInfoCard
            icon="🤖"
            title="Guidance"
            content="AI live guidance and task suggestions"
            accent="var(--accent-green)"
            isActive={false}
          />
          <MiniInfoCard
            icon="📊"
            title="Analytics"
            content="Sentiment analysis and conversation metrics"
            accent="var(--accent-orange)"
            isActive={false}
          />
        </div>
      )}

      {/* Toggle Peripherals */}
      <button
        onClick={() => setShowPeripherals(!showPeripherals)}
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: '8px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-sm)',
          zIndex: 10
        }}
      >
        {showPeripherals ? '🔍 Focus Mode' : '📊 Show All'}
      </button>

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
