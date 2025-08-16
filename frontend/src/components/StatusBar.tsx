import React from 'react';

interface StatusBarProps {
  isRecording: boolean;
  isProcessing: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  transcriptCount: number;
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  isRecording,
  isProcessing,
  connectionStatus,
  transcriptCount,
  className = ''
}) => {
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <circle cx="6" cy="6" r="6" fill="#10b981"/>
          </svg>
        );
      case 'connecting':
        return (
          <div className="loading-dot" style={{ width: '12px', height: '12px', background: '#f59e0b' }} />
        );
      default:
        return (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <circle cx="6" cy="6" r="6" fill="#ef4444"/>
          </svg>
        );
    }
  };

  const getRecordingIcon = () => {
    if (isRecording) {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="8" r="4" fill="#ef4444"/>
          <circle cx="8" cy="8" r="4" fill="#ef4444" opacity="0.3">
            <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.3;0;0.3" dur="1s" repeatCount="indefinite"/>
          </circle>
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="8" r="4" fill="#64748b"/>
      </svg>
    );
  };

  return (
    <div 
      className={`status-bar ${className}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderBottom: 'none',
        padding: 'var(--spacing-sm) var(--spacing-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
        zIndex: 100,
        backdropFilter: 'blur(8px)',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
          {getConnectionIcon()}
          <span style={{ textTransform: 'capitalize' }}>{connectionStatus}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
          {getRecordingIcon()}
          <span>{isRecording ? 'Recording' : 'Standby'}</span>
        </div>
        
        {isProcessing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
            <span>Processing...</span>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
        <span>Transcript Events: {transcriptCount}</span>
        <span>AI Conversation Copilot v2.0</span>
      </div>
    </div>
  );
};
