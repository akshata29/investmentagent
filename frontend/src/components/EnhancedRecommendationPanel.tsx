import React, { useState, useEffect } from 'react';
import { Text, Spinner, SpinnerSize, SearchBox, Dropdown, IDropdownOption } from '@fluentui/react';
import { ModernSection, ModernTextArea } from './ModernSection';
import { ModernButton } from './ModernButton';
import { getGPTCustomPromptCompletion } from '../api/backend_api_orchestrator';
import { 
  Target24Regular, 
  Money24Regular, 
  DataTrending24Regular,
  Star24Regular,
  Star24Filled,
  Share24Regular,
  Print24Regular,
  Calendar24Regular,
  PersonFeedback24Regular,
  Filter24Regular,
  ChartMultiple24Regular,
  People24Regular,
  Shield24Regular,
  Alert24Regular
} from '@fluentui/react-icons';

interface RecommendationPanelProps {
  recommendation: string;
  isGenerating: boolean;
  onGenerateRecommendation: () => void;
  // New props for AI analysis
  conversationTranscript?: string;
  sentimentData?: any;
  keyPhrases?: string;
}

interface RecommendationInsight {
  type: 'confidence' | 'risk' | 'suitability' | 'timing' | 'compliance';
  label: string;
  value: number; // 0-100
  color: string;
  description: string;
}

export const EnhancedRecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendation,
  isGenerating,
  onGenerateRecommendation,
  conversationTranscript = '',
  sentimentData,
  keyPhrases = ''
}) => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [clientRating, setClientRating] = useState<number>(0);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [insights, setInsights] = useState<RecommendationInsight[]>([]);
  const [isAnalyzingInsights, setIsAnalyzingInsights] = useState(false);

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
        return 'AI analyzing conversation and generating personalized recommendations...';
      case 'waiting':
        return 'Waiting for sufficient client information (auto-generated during conversation)';
      case 'error':
        return 'Error occurred during recommendation generation';
      case 'complete':
        return 'Investment recommendations generated and ready for client presentation';
    }
  };

  // AI-powered insights generation using LLM analysis
  const generateInsightsWithAI = async () => {
    if (!conversationTranscript || !recommendation || hasError || isWaitingForInfo) {
      setInsights([]);
      return;
    }

    setIsAnalyzingInsights(true);
    
    try {
      const analysisPrompt = `
Analyze this investment conversation and recommendation to provide specific, accurate insights. Return ONLY a JSON object with this exact structure:

{
  "confidence": {
    "value": <number 0-100>,
    "description": "<specific reason based on conversation>"
  },
  "suitability": {
    "value": <number 0-100>, 
    "description": "<specific client fit assessment>"
  },
  "risk": {
    "value": <number 0-100>,
    "description": "<specific risk level assessment>"
  },
  "timing": {
    "value": <number 0-100>,
    "description": "<specific market timing assessment>"
  },
  "compliance": {
    "value": <number 0-100>,
    "description": "<specific compliance assessment>"
  }
}

Base your analysis on:

CONVERSATION TRANSCRIPT:
${conversationTranscript}

GENERATED RECOMMENDATION:
${recommendation}

SENTIMENT DATA:
${sentimentData ? JSON.stringify(sentimentData) : 'Not available'}

KEY PHRASES:
${keyPhrases}

Provide realistic scores based on the actual conversation content. Consider:
- Confidence: How well does the conversation support the recommendation?
- Suitability: How well does the recommendation match expressed client needs?
- Risk: What risk level is appropriate based on client statements?
- Timing: Based on conversation, is this good timing for recommendations?
- Compliance: Does the recommendation follow proper advisory practices?

Return only the JSON object, no other text.`;

      const result = await getGPTCustomPromptCompletion(conversationTranscript, analysisPrompt);
      
      if (result && result.data) {
        const content = result.data.message?.content || result.data.content || result.data;
        
        try {
          // Parse the AI response
          const analysisData = JSON.parse(content);
          
          // Convert to our insights format
          const aiInsights: RecommendationInsight[] = [
            {
              type: 'confidence',
              label: 'AI Confidence',
              value: analysisData.confidence?.value || 50,
              color: analysisData.confidence?.value > 80 ? 'var(--accent-green)' : 
                     analysisData.confidence?.value > 60 ? 'var(--accent-orange)' : 'var(--accent-red)',
              description: analysisData.confidence?.description || 'Analysis in progress'
            },
            {
              type: 'suitability',
              label: 'Client Fit',
              value: analysisData.suitability?.value || 50,
              color: analysisData.suitability?.value > 80 ? 'var(--accent-green)' : 
                     analysisData.suitability?.value > 60 ? 'var(--accent-blue)' : 'var(--accent-orange)',
              description: analysisData.suitability?.description || 'Analyzing client alignment'
            },
            {
              type: 'risk',
              label: 'Risk Assessment',
              value: analysisData.risk?.value || 50,
              color: analysisData.risk?.value > 80 ? 'var(--accent-red)' : 
                     analysisData.risk?.value > 40 ? 'var(--accent-orange)' : 'var(--accent-green)',
              description: analysisData.risk?.description || 'Evaluating risk profile'
            },
            {
              type: 'timing',
              label: 'Market Timing',
              value: analysisData.timing?.value || 50,
              color: analysisData.timing?.value > 70 ? 'var(--accent-green)' : 
                     analysisData.timing?.value > 40 ? 'var(--accent-purple)' : 'var(--accent-orange)',
              description: analysisData.timing?.description || 'Assessing market conditions'
            },
            {
              type: 'compliance',
              label: 'Compliance',
              value: analysisData.compliance?.value || 95,
              color: analysisData.compliance?.value > 90 ? 'var(--accent-green)' : 
                     analysisData.compliance?.value > 75 ? 'var(--accent-orange)' : 'var(--accent-red)',
              description: analysisData.compliance?.description || 'Reviewing regulatory compliance'
            }
          ];
          
          setInsights(aiInsights);
        } catch (parseError) {
          console.error('Error parsing AI insights:', parseError);
          // Fallback to basic analysis
          setInsights([
            {
              type: 'confidence',
              label: 'AI Confidence',
              value: 75,
              color: 'var(--accent-orange)',
              description: 'Basic analysis - AI response parsing failed'
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
      setInsights([
        {
          type: 'confidence',
          label: 'Analysis Status',
          value: 0,
          color: 'var(--accent-red)',
          description: 'Unable to generate insights - API error'
        }
      ]);
    } finally {
      setIsAnalyzingInsights(false);
    }
  };

  // Generate insights when recommendation changes
  useEffect(() => {
    if (showAnalytics && recommendation && !isGenerating) {
      generateInsightsWithAI();
    }
  }, [recommendation, showAnalytics, conversationTranscript]);

  // Mock analytics data - in real implementation, this would come from AI analysis
  const getRecommendationInsights = (): RecommendationInsight[] => {
    if (hasError || isWaitingForInfo) return [];
    
    return [
      {
        type: 'confidence',
        label: 'AI Confidence',
        value: 87,
        color: 'var(--accent-green)',
        description: 'High confidence based on clear client goals and risk profile'
      },
      {
        type: 'suitability',
        label: 'Client Fit',
        value: 92,
        color: 'var(--accent-blue)',
        description: 'Excellent alignment with stated investment objectives'
      },
      {
        type: 'risk',
        label: 'Risk Assessment',
        value: 74,
        color: 'var(--accent-orange)',
        description: 'Moderate risk level appropriate for client profile'
      },
      {
        type: 'timing',
        label: 'Market Timing',
        value: 81,
        color: 'var(--accent-purple)',
        description: 'Favorable market conditions for recommended strategies'
      },
      {
        type: 'compliance',
        label: 'Compliance',
        value: 98,
        color: 'var(--accent-green)',
        description: 'Full compliance with regulatory requirements'
      }
    ];
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

  const handleExportRecommendation = () => {
    const blob = new Blob([recommendation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investment-recommendations-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintRecommendation = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Investment Recommendations</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { color: #0078d4; border-bottom: 2px solid #0078d4; padding-bottom: 10px; }
              .header { margin-bottom: 30px; }
              .content { white-space: pre-wrap; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Investment Recommendations</h1>
              <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Advisor:</strong> AI Investment Copilot</p>
            </div>
            <div class="content">${recommendation}</div>
            <div class="footer">
              <p>This recommendation was generated using AI analysis of client conversation data. Please review all recommendations with appropriate due diligence before client presentation.</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const renderStarRating = () => {
    return (
      <div className="star-rating">
        <Text variant="small" style={{ marginRight: '8px' }}>Rate this recommendation:</Text>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setClientRating(star)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {star <= clientRating ? 
              <Star24Filled style={{ color: 'var(--accent-orange)' }} /> : 
              <Star24Regular style={{ color: 'var(--text-secondary)' }} />
            }
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="enhanced-recommendation-panel">
      <style>{`
        .enhanced-recommendation-panel {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          border: 1px solid var(--border-color);
          margin-bottom: var(--spacing-lg);
          position: relative;
        }

        .recommendation-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .header-actions {
          display: flex;
          gap: var(--spacing-xs);
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

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
          margin: var(--spacing-md) 0;
          padding: var(--spacing-md);
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-primary);
        }

        .insights-loading {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
          text-align: center;
        }

        .insights-placeholder {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
          text-align: center;
        }

        .insight-card {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          padding: var(--spacing-sm);
          border-radius: var(--radius-sm);
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          transition: transform 0.2s ease;
        }

        .insight-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .insight-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .insight-label {
          font-weight: 600;
          font-size: var(--font-size-sm);
          color: var(--text-primary);
        }

        .insight-value {
          font-weight: 700;
          font-size: var(--font-size-md);
        }

        .insight-bar {
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: 3px;
          overflow: hidden;
        }

        .insight-fill {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 3px;
        }

        .insight-description {
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
          line-height: 1.3;
        }

        .recommendation-content {
          width: 100%;
          min-height: 300px;
          font-family: 'Segoe UI', system-ui, sans-serif;
          font-size: var(--font-size-sm);
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

        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--spacing-md);
          padding: var(--spacing-sm);
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-primary);
        }

        .star-rating {
          display: flex;
          align-items: center;
        }

        .action-buttons {
          display: flex;
          gap: var(--spacing-xs);
        }

        .toggle-analytics {
          margin-bottom: var(--spacing-md);
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

          .insights-grid {
            grid-template-columns: 1fr;
          }

          .action-bar {
            flex-direction: column;
            gap: var(--spacing-sm);
          }
        }
      `}</style>

      <div className="recommendation-header">
        <div className="header-left">
          <Money24Regular style={{ color: 'var(--accent-blue)' }} />
          <div>
            <h3 className="recommendation-title">Investment Recommendations</h3>
            <p className="recommendation-subtitle">AI-powered analysis with banker insights</p>
          </div>
        </div>
        
        <div className="header-actions">
          <ModernButton
            variant="secondary"
            size="small"
            onClick={() => setShowAnalytics(!showAnalytics)}
            icon={<ChartMultiple24Regular />}
            loading={isAnalyzingInsights}
          >
            {showAnalytics ? 'Hide' : 'Show'} Analytics {isAnalyzingInsights ? '(Analyzing...)' : ''}
          </ModernButton>
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

      {/* Analytics Insights */}
      {showAnalytics && (
        <div className="insights-grid">
          {isAnalyzingInsights ? (
            <div className="insights-loading">
              <Spinner size={SpinnerSize.medium} />
              <Text variant="medium" style={{ marginTop: 'var(--spacing-sm)', color: 'var(--text-secondary)' }}>
                AI analyzing conversation and recommendation to generate insights...
              </Text>
            </div>
          ) : insights.length > 0 ? (
            insights.map((insight) => (
              <div key={insight.type} className="insight-card">
                <div className="insight-header">
                  <span className="insight-label">{insight.label}</span>
                  <span className="insight-value" style={{ color: insight.color }}>
                    {insight.value}%
                  </span>
                </div>
                <div className="insight-bar">
                  <div 
                    className="insight-fill" 
                    style={{ 
                      width: `${insight.value}%`,
                      backgroundColor: insight.color 
                    }} 
                  />
                </div>
                <div className="insight-description">{insight.description}</div>
              </div>
            ))
          ) : (
            <div className="insights-placeholder">
              <DataTrending24Regular style={{ fontSize: '48px', color: 'var(--text-secondary)', marginBottom: '16px' }} />
              <Text variant="medium" style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                Generate a recommendation first to see AI-powered insights about confidence, risk assessment, and client suitability.
              </Text>
            </div>
          )}
        </div>
      )}

      <textarea
        value={formatRecommendation(recommendation)}
        readOnly
        rows={12}
        placeholder="AI-powered investment recommendations will auto-generate as you speak and will appear here. Click 'Refresh Recommendations' to manually update."
        className={`recommendation-content ${getRecommendationStatus()}`}
      />

      {/* Action Bar for Professional Features */}
      {!hasError && !isWaitingForInfo && (
        <div className="action-bar">
          {renderStarRating()}
          
          <div className="action-buttons">
            <ModernButton
              variant="secondary"
              size="small"
              onClick={handlePrintRecommendation}
              icon={<Print24Regular />}
            >
              Print
            </ModernButton>
            
            <ModernButton
              variant="secondary"
              size="small"
              onClick={handleExportRecommendation}
              icon={<Share24Regular />}
            >
              Export
            </ModernButton>
            
            <ModernButton
              variant="secondary"
              size="small"
              icon={<Calendar24Regular />}
            >
              Schedule Follow-up
            </ModernButton>
            
            <ModernButton
              variant="primary"
              size="small"
              icon={<PersonFeedback24Regular />}
            >
              Prepare Client Pitch
            </ModernButton>
          </div>
        </div>
      )}
    </div>
  );
};
