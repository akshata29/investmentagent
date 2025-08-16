import React from 'react';

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
  }>;
}

interface SentimentGaugeProps {
  sentimentData: SentimentData;
  className?: string;
}

export const SentimentGauge: React.FC<SentimentGaugeProps> = ({ 
  sentimentData, 
  className = '' 
}) => {
  // Handle case where sentiment data is not available or incomplete
  if (!sentimentData || !sentimentData.overall) {
    return (
      <div className={`sentiment-analysis-container ${className}`} style={{ 
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        textAlign: 'center'
      }}>
        <h4 style={{ 
          color: 'var(--text-primary)', 
          marginBottom: 'var(--spacing-lg)',
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-semibold)'
        }}>
          Sentiment Analysis
        </h4>
        <div style={{ color: 'var(--text-secondary)' }}>
          No sentiment data available yet. Start a conversation to see analysis.
        </div>
      </div>
    );
  }

  const { overall } = sentimentData;
  
  // Calculate sentiment score on a scale of -1 to 1
  const sentimentScore = overall.confidenceScores.positive - overall.confidenceScores.negative;
  
  // Convert to percentage for gauge (0-100%)
  const gaugePercentage = ((sentimentScore + 1) / 2) * 100;
  
  // Get color based on sentiment
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '#28a745';
      case 'negative':
        return '#dc3545';
      case 'mixed':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const sentimentColor = getSentimentColor(overall.sentiment);

  // SVG Gauge Component
  const GaugeChart = () => {
    const size = 160; // Reduced size
    const strokeWidth = 16; // Reduced stroke width
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (gaugePercentage / 100) * circumference;

    return (
      <div className="sentiment-gauge" style={{ 
        position: 'relative', 
        display: 'inline-block',
        width: size,
        height: size / 2 + 30
      }}>
        <svg width={size} height={size / 2 + 20} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2},${size / 2} A ${radius},${radius} 0 0,1 ${size - strokeWidth / 2},${size / 2}`}
            fill="none"
            stroke="var(--border-secondary)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d={`M ${strokeWidth / 2},${size / 2} A ${radius},${radius} 0 0,1 ${size - strokeWidth / 2},${size / 2}`}
            fill="none"
            stroke={sentimentColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.8s ease-in-out',
            }}
          />
        </svg>
        
        {/* Center content */}
        <div
          style={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'var(--text-primary)'
          }}
        >
          <div style={{ 
            fontSize: 'var(--font-size-xl)', // Reduced font size
            fontWeight: 'var(--font-weight-bold)',
            color: sentimentColor 
          }}>
            {(sentimentScore * 100).toFixed(0)}
          </div>
          <div style={{ 
            fontSize: 'var(--font-size-xs)', // Reduced font size
            textTransform: 'capitalize',
            marginTop: '2px'
          }}>
            {overall.sentiment}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`sentiment-analysis-container ${className}`} style={{ 
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-primary)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-lg)',
      textAlign: 'center'
    }}>
      <h4 style={{ 
        color: 'var(--text-primary)', 
        marginBottom: 'var(--spacing-lg)',
        fontSize: 'var(--font-size-lg)',
        fontWeight: 'var(--font-weight-semibold)'
      }}>
        Sentiment Analysis
      </h4>
      
      <GaugeChart />
      
      {/* Confidence Scores */}
      <div style={{ 
        marginTop: 'var(--spacing-lg)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--spacing-sm)',
        fontSize: 'var(--font-size-sm)'
      }}>
        <div style={{ 
          padding: 'var(--spacing-sm)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: `2px solid #28a745`
        }}>
          <div style={{ color: '#28a745', fontWeight: 'var(--font-weight-semibold)' }}>
            Positive
          </div>
          <div style={{ color: 'var(--text-primary)' }}>
            {(overall.confidenceScores.positive * 100).toFixed(1)}%
          </div>
        </div>
        
        <div style={{ 
          padding: 'var(--spacing-sm)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: `2px solid #6c757d`
        }}>
          <div style={{ color: '#6c757d', fontWeight: 'var(--font-weight-semibold)' }}>
            Neutral
          </div>
          <div style={{ color: 'var(--text-primary)' }}>
            {(overall.confidenceScores.neutral * 100).toFixed(1)}%
          </div>
        </div>
        
        <div style={{ 
          padding: 'var(--spacing-sm)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: `2px solid #dc3545`
        }}>
          <div style={{ color: '#dc3545', fontWeight: 'var(--font-weight-semibold)' }}>
            Negative
          </div>
          <div style={{ color: 'var(--text-primary)' }}>
            {(overall.confidenceScores.negative * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Sentence-level sentiment (if available) */}
      {sentimentData.sentences && sentimentData.sentences.length > 0 && (
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          <h5 style={{ 
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-md)'
          }}>
            Sentence-level Analysis
          </h5>
          <div style={{ 
            maxHeight: '200px',
            overflowY: 'auto',
            textAlign: 'left'
          }}>
            {sentimentData.sentences.slice(0, 5).map((sentence, index) => (
              <div
                key={index}
                style={{
                  padding: 'var(--spacing-sm)',
                  margin: 'var(--spacing-xs) 0',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: `4px solid ${getSentimentColor(sentence.sentiment)}`,
                  fontSize: 'var(--font-size-xs)'
                }}
              >
                <div style={{ 
                  color: getSentimentColor(sentence.sentiment),
                  fontWeight: 'var(--font-weight-medium)',
                  textTransform: 'capitalize'
                }}>
                  {sentence.sentiment} ({(Math.max(sentence.confidenceScores.positive, sentence.confidenceScores.negative, sentence.confidenceScores.neutral) * 100).toFixed(0)}%)
                </div>
                <div style={{ 
                  color: 'var(--text-secondary)',
                  marginTop: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {sentence.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
