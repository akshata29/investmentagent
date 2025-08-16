import React from 'react';
import { Text, Spinner, SpinnerSize } from '@fluentui/react';
import { ModernSection, ModernTextArea } from './ModernSection';
import { ModernButton } from './ModernButton';
import { Target24Regular, Money24Regular, DataTrending24Regular } from '@fluentui/react-icons';

interface RecommendationPanelProps {
  recommendation: string;
  isGenerating: boolean;
  onGenerateRecommendation: () => void;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendation,
  isGenerating,
  onGenerateRecommendation
}) => {
  const isWaitingForInfo = recommendation.includes('***Waiting for More Client Information***');
  const hasError = recommendation.includes('Error generating recommendation');
  
  const getRecommendationStatus = () => {
    if (isGenerating) return 'generating';
    if (isWaitingForInfo) return 'waiting';
    if (hasError) return 'error';
    return 'complete';
  };

  const getStatusIcon = () => {
    const status = getRecommendationStatus();
    switch (status) {
      case 'generating':
        return <Spinner size={SpinnerSize.small} />;
      case 'waiting':
        return <Target24Regular style={{ color: 'var(--accent-orange)' }} />;
      case 'error':
        return <span style={{ color: 'var(--accent-red)', fontSize: '18px' }}>⚠</span>;
      case 'complete':
        return <DataTrending24Regular style={{ color: 'var(--accent-green)' }} />;
    }
  };

  const getStatusText = () => {
    const status = getRecommendationStatus();
    switch (status) {
      case 'generating':
        return 'Auto-generating personalized recommendations from conversation...';
      case 'waiting':
        return 'Waiting for sufficient client information (auto-generated during conversation)';
      case 'error':
        return 'Error occurred during recommendation generation';
      case 'complete':
        return 'Investments recommendations generated (auto-updated during conversation)';
    }
  };

  const formatRecommendation = (text: string) => {
    if (isWaitingForInfo || hasError) {
      return text;
    }
    
    // Format bullet points and structure for better readability
    return text
      .replace(/\n\n/g, '\n')
      .replace(/^\s*[\u2022\u25cf\u25a0]\s*/gm, '• ')
      .replace(/^\s*\d+\.\s*/gm, (match, offset, string) => {
        const lineStart = string.lastIndexOf('\n', offset) + 1;
        return lineStart === offset ? match : '\n' + match;
      });
  };

  return (
    <div className="recommendation-panel">
      <style>{`
        .recommendation-panel {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          border: 1px solid var(--border-color);
          margin-bottom: var(--spacing-lg);
        }

        .recommendation-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }

        .recommendation-title {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .recommendation-subtitle {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin: 0;
          margin-top: 2px;
        }

        .recommendation-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--accent-blue);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .status-text {
          font-weight: 500;
          color: var(--text-secondary);
        }

        .recommendation-content {
          width: 100%;
          min-height: 300px;
          font-family: 'Segoe UI', system-ui, sans-serif;
          line-height: 1.6;
          background: var(--bg-primary);
          border: 2px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          color: var(--text-primary);
          resize: vertical;
          transition: all 0.3s ease;
        }

        .recommendation-content:read-only {
          cursor: default;
        }

        .recommendation-content.generating {
          border-color: var(--accent-blue);
          background: linear-gradient(45deg, var(--bg-primary) 25%, transparent 25%), 
                      linear-gradient(-45deg, var(--bg-primary) 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, var(--bg-primary) 75%), 
                      linear-gradient(-45deg, transparent 75%, var(--bg-primary) 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          animation: slide 2s linear infinite;
        }

        .recommendation-content.waiting {
          border-color: var(--accent-orange);
          background: var(--bg-warning);
        }

        .recommendation-content.error {
          border-color: var(--accent-red);
          background: var(--bg-error);
        }

        .recommendation-content.complete {
          border-color: var(--accent-green);
          background: var(--bg-success);
        }

        @keyframes slide {
          0% { background-position: 0 0, 0 10px, 10px -10px, -10px 0px; }
          100% { background-position: 20px 20px, 20px 30px, 30px 10px, 10px 20px; }
        }

        @media (max-width: 768px) {
          .recommendation-status-bar {
            flex-direction: column;
            gap: var(--spacing-sm);
            align-items: stretch;
          }

          .status-indicator {
            justify-content: center;
          }
        }
      `}</style>

      <div className="recommendation-header">
        <Money24Regular style={{ color: 'var(--accent-blue)' }} />
        <div>
          <h3 className="recommendation-title">Investment Recommendations</h3>
          <p className="recommendation-subtitle">Auto-generated during conversation</p>
        </div>
      </div>

      <div className="recommendation-status-bar">
        <div className="status-indicator">
          {getStatusIcon()}
          <Text variant="small" className="status-text">
            {getStatusText()}
          </Text>
        </div>
        <ModernButton
          onClick={onGenerateRecommendation}
          disabled={isGenerating}
          variant="primary"
          loading={isGenerating}
        >
          {isGenerating ? "Generating..." : "Refresh Recommendations"}
        </ModernButton>
      </div>

      <textarea
        value={formatRecommendation(recommendation)}
        readOnly
        rows={12}
        placeholder="Investment recommendations will auto-generate as you speak and will appear here. Click 'Refresh Recommendations' to manually update."
        className={`recommendation-content ${getRecommendationStatus()}`}
      />
    </div>
  );
};
