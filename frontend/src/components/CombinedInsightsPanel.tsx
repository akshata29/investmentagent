import React from 'react';
import { Text } from '@fluentui/react';
import { 
  BrainCircuit24Regular, 
  ChartMultiple24Regular, 
  DataTrending24Regular,
  Person24Regular
} from '@fluentui/react-icons';

interface SentimentData {
  overall: {
    sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
    score: number;
    confidenceScores: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
  sentences: Array<{
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
    confidenceScores: {
      positive: number;
      negative: number;
      neutral: number;
    };
    opinions?: any[];
    timestamp?: number;
  }>;
}

interface DualSentimentData {
  current: SentimentData;
  rolling: {
    overall: {
      sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
      score: number;
      confidenceScores: {
        positive: number;
        negative: number;
        neutral: number;
      };
    };
    allSentences: Array<{
      text: string;
      sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
      confidenceScores: {
        positive: number;
        negative: number;
        neutral: number;
      };
      opinions?: any[];
      timestamp: number;
    }>;
  };
}

interface CombinedInsightsPanelProps {
  entitiesExtracted: string;
  sentimentData: DualSentimentData;
  className?: string;
}

export const CombinedInsightsPanel: React.FC<CombinedInsightsPanelProps> = ({
  entitiesExtracted,
  sentimentData,
  className = ''
}) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'var(--accent-green)';
      case 'negative': return 'var(--accent-red)';
      case 'mixed': return 'var(--accent-orange)';
      default: return 'var(--text-secondary)';
    }
  };

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  const CompactSentimentGauge = ({ data, title, icon }: { 
    data: SentimentData['overall'], 
    title: string,
    icon: React.ReactNode 
  }) => {
    const sentimentColor = getSentimentColor(data.sentiment);
    const sentimentScore = data.confidenceScores.positive - data.confidenceScores.negative;
    const normalizedScore = ((sentimentScore + 1) / 2) * 100; // Convert -1,1 to 0,100

    return (
      <div className="compact-sentiment-gauge">
        <div className="gauge-header">
          {icon}
          <div className="header-content">
            <Text variant="smallPlus" style={{ fontWeight: 600 }}>{title}</Text>
            <Text variant="small" style={{ color: sentimentColor, fontWeight: 500 }}>
              {data.sentiment} ({(sentimentScore * 100).toFixed(0)})
            </Text>
          </div>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${normalizedScore}%`,
                backgroundColor: sentimentColor,
                transition: 'width 0.8s ease-in-out'
              }}
            />
          </div>
          <div className="progress-labels">
            <span>Negative</span>
            <span>Neutral</span>
            <span>Positive</span>
          </div>
        </div>

        <div className="confidence-mini">
          <div className="confidence-item positive">
            <span>{formatPercentage(data.confidenceScores.positive)}</span>
          </div>
          <div className="confidence-item neutral">
            <span>{formatPercentage(data.confidenceScores.neutral)}</span>
          </div>
          <div className="confidence-item negative">
            <span>{formatPercentage(data.confidenceScores.negative)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`combined-insights-panel ${className}`}>
      <style>{`
        .combined-insights-panel {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          border: 1px solid var(--border-color);
          margin-bottom: var(--spacing-lg);
        }

        .insights-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-md);
        }

        .insights-title {
          color: var(--text-primary);
          font-weight: 600;
          font-size: var(--font-size-md);
        }

        .insights-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-md);
          align-items: start;
        }

        .entities-section {
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          border: 1px solid var(--border-color);
          min-height: 100px;
        }

        .entities-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-xs);
          color: var(--text-primary);
        }

        .entities-content {
          color: var(--text-secondary);
          font-style: italic;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sentiment-dual {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-sm);
        }

        .compact-sentiment-gauge {
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          border: 1px solid var(--border-color);
        }

        .gauge-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-sm);
          color: var(--text-primary);
        }

        .header-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
          flex: 1;
        }

        .progress-container {
          margin-bottom: var(--spacing-sm);
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: var(--border-secondary);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: var(--spacing-xs);
          position: relative;
        }

        .progress-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 0.8s ease-in-out;
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.1);
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
          font-weight: 500;
        }

        .confidence-mini {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: var(--spacing-xs);
          text-align: center;
          margin-top: var(--spacing-xs);
        }

        .confidence-item {
          padding: 4px var(--spacing-xs);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: 500;
        }

        .confidence-item.positive {
          background: var(--bg-success);
          color: var(--accent-green);
          border: 1px solid var(--accent-green);
        }

        .confidence-item.neutral {
          background: var(--bg-secondary);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        .confidence-item.negative {
          background: var(--bg-error);
          color: var(--accent-red);
          border: 1px solid var(--accent-red);
        }

        .conversation-stats {
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          border: 1px solid var(--border-color);
          margin-top: var(--spacing-sm);
        }

        .stats-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-xs);
          color: var(--text-primary);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-md);
          text-align: center;
        }

        .stat-item {
          padding: var(--spacing-sm);
          background: var(--bg-secondary);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        .stat-value {
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--accent-blue);
          display: block;
          margin-bottom: var(--spacing-xs);
        }

        .stat-label {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .insights-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }

          .sentiment-dual {
            grid-template-columns: 1fr;
            gap: var(--spacing-sm);
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-sm);
          }

          .compact-sentiment-gauge {
            padding: var(--spacing-xs);
          }

          .gauge-header {
            margin-bottom: var(--spacing-xs);
          }

          .confidence-mini {
            gap: 4px;
          }

          .confidence-item {
            padding: 2px 4px;
            font-size: 10px;
          }
        }
      `}</style>

      <div className="insights-header">
        <BrainCircuit24Regular />
        <Text variant="mediumPlus" className="insights-title">
          Language AI Insights & Sentiment Analysis
        </Text>
      </div>

      <div className="insights-content">
        <div className="entities-section">
          <div className="entities-header">
            <Person24Regular />
            <Text variant="medium" style={{ fontWeight: 600 }}>
              Entities Extracted
            </Text>
          </div>
          <div className="entities-content">
            <Text variant="medium">
              {entitiesExtracted || 'No entities extracted yet...'}
            </Text>
          </div>
        </div>

        <div className="sentiment-dual">
          <CompactSentimentGauge 
            data={sentimentData.current.overall} 
            title="Current" 
            icon={<DataTrending24Regular />} 
          />
          <CompactSentimentGauge 
            data={sentimentData.rolling.overall} 
            title="Rolling" 
            icon={<ChartMultiple24Regular />} 
          />
        </div>
      </div>

      <div className="conversation-stats">
        <div className="stats-header">
          <ChartMultiple24Regular />
          <Text variant="medium" style={{ fontWeight: 600 }}>
            Conversation Stats
          </Text>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{sentimentData.current.sentences.length}</span>
            <div className="stat-label">Recent</div>
          </div>
          <div className="stat-item">
            <span className="stat-value">{sentimentData.rolling.allSentences.length}</span>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {sentimentData.rolling.allSentences.length > 0 
                ? Math.round((Date.now() - sentimentData.rolling.allSentences[0].timestamp) / 60000)
                : 0
              }
            </span>
            <div className="stat-label">Est. Min</div>
          </div>
        </div>
      </div>
    </div>
  );
};
