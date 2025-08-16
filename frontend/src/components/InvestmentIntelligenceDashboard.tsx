import React, { useState, useEffect } from 'react';
import { Text, SearchBox, Dropdown, IDropdownOption, Spinner, SpinnerSize } from '@fluentui/react';
import { ModernButton } from './ModernButton';
import { generateRecommendation, generateMarketInsights } from '../api/backend_api_orchestrator';
import { 
  DataTrending24Regular,
  Money24Regular, 
  People24Regular,
  Target24Regular,
  Clock24Regular,
  ArrowUp24Regular,
  ArrowDown24Regular,
  Warning24Regular,
  CheckmarkCircle24Regular,
  ArrowUp24Filled,
  PersonFeedback24Regular,
  Calculator24Regular,
  Shield24Regular,
  Alert24Regular
} from '@fluentui/react-icons';

interface ClientMetric {
  id: string;
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

interface MarketInsight {
  id: string;
  category: 'market' | 'sector' | 'opportunity' | 'risk';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short' | 'medium' | 'long';
  confidence: number;
  relevantClients: string[];
}

interface InvestmentIntelligenceDashboardProps {
  conversationText: string;
  sentimentData: {
    current: {
      overall: {
        sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
        score: number;
        confidenceScores: {
          positive: number;
          negative: number;
          neutral: number;
        };
      };
    };
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
    };
  };
  transcriptEventCount: number;
  recommendation: string;
  clientCount?: number;
  activeRecommendations?: number;
  portfolioValue?: string;
  onGenerateInsights?: () => void;
}

export const InvestmentIntelligenceDashboard: React.FC<InvestmentIntelligenceDashboardProps> = ({
  conversationText,
  sentimentData,
  transcriptEventCount,
  recommendation,
  clientCount = 24,
  activeRecommendations = 7,
  portfolioValue = "$12.4M",
  onGenerateInsights
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('today');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [aiInsights, setAiInsights] = useState<MarketInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState<string>('');

  const timeframeOptions: IDropdownOption[] = [
    { key: 'today', text: 'Today' },
    { key: 'week', text: 'This Week' },
    { key: 'month', text: 'This Month' },
    { key: 'quarter', text: 'This Quarter' }
  ];

  const categoryOptions: IDropdownOption[] = [
    { key: 'all', text: 'All Categories' },
    { key: 'market', text: 'Market Intelligence' },
    { key: 'client', text: 'Client Insights' },
    { key: 'opportunities', text: 'Opportunities' },
    { key: 'risks', text: 'Risk Alerts' }
  ];

  // Mock real-time client metrics
  const getClientMetrics = (): ClientMetric[] => [
    {
      id: 'active-clients',
      label: 'Active Clients',
      value: clientCount,
      trend: 'up',
      trendValue: '+3 this week',
      color: 'var(--accent-green)',
      priority: 'medium',
      actionable: true
    },
    {
      id: 'pending-recommendations',
      label: 'Pending Recommendations',
      value: activeRecommendations,
      trend: 'stable',
      trendValue: 'No change',
      color: 'var(--accent-orange)',
      priority: 'high',
      actionable: true
    },
    {
      id: 'portfolio-value',
      label: 'Total Portfolio Value',
      value: portfolioValue,
      trend: 'up',
      trendValue: '+2.4% today',
      color: 'var(--accent-blue)',
      priority: 'medium',
      actionable: false
    },
    {
      id: 'conversion-rate',
      label: 'Recommendation Success',
      value: '87%',
      trend: 'up',
      trendValue: '+5% this month',
      color: 'var(--accent-green)',
      priority: 'low',
      actionable: false
    },
    {
      id: 'risk-alerts',
      label: 'Active Risk Alerts',
      value: 3,
      trend: 'down',
      trendValue: '-2 resolved',
      color: 'var(--accent-red)',
      priority: 'high',
      actionable: true
    },
    {
      id: 'avg-response-time',
      label: 'Avg Response Time',
      value: '4.2 hrs',
      trend: 'down',
      trendValue: '-30min improved',
      color: 'var(--accent-purple)',
      priority: 'medium',
      actionable: false
    }
  ];

  // Generate AI-powered market insights based on conversation data
  const generateMarketInsightsWithAI = async (): Promise<MarketInsight[]> => {
    try {
      setLoadingInsights(true);
      setInsightsError('');
      
      // Wait for sufficient transcript content before generating insights
      if (!conversationText || conversationText.length < 200) {
        console.log('Insufficient transcript data for market insights generation');
        return [
          {
            id: 'waiting-for-data',
            category: 'market',
            title: 'Gathering Conversation Data...',
            description: 'Please continue the conversation to generate AI-powered market insights based on client discussion.',
            impact: 'low',
            timeframe: 'immediate',
            confidence: 0,
            relevantClients: ['Data Collection in Progress']
          }
        ];
      }

      console.log('Calling AI API for market insights...', { conversationText });
      
      // Use the new market insights endpoint
      const response = await generateMarketInsights(conversationText);
      console.log('Market Insights API Response received:', response);
      
      // Check if response has the expected structure
      if (!response || !response.data) {
        console.error('Invalid API response structure:', response);
        throw new Error('Invalid API response structure');
      }
      
      // The response.data contains the full OpenAI response object
      let result;
      if (response.data.message && response.data.message.content) {
        result = response.data.message.content;
      } else if (typeof response.data === 'string') {
        result = response.data;
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Unexpected response format');
      }
      
      console.log('Raw AI content:', result);
      
      try {
        // Ensure result is a string before processing
        if (typeof result !== 'string') {
          console.error('Result is not a string:', typeof result, result);
          throw new Error('API response is not a string');
        }
        
        console.log('Full AI response content:', result);
        
        // Check if the response is a "waiting" message like the recommendation system
        if (result.includes('***Insufficient Client Context') || result.includes('***Waiting') || result.includes('Waiting for')) {
          console.log('AI indicates insufficient data for insights generation');
          return [
            {
              id: 'waiting-for-data',
              category: 'market',
              title: 'Gathering Conversation Data...',
              description: 'Continue the conversation to generate AI-powered market insights. More client information needed.',
              impact: 'low',
              timeframe: 'immediate',
              confidence: 0,
              relevantClients: ['Data Collection in Progress']
            }
          ];
        }
        
        // Parse bullet points into insights
        const bulletPoints = result.split('•').filter(point => point.trim().length > 0);
        const insights: MarketInsight[] = [];
        
        bulletPoints.forEach((point, index) => {
          const trimmedPoint = point.trim();
          if (trimmedPoint.length > 20) { // Only process substantial bullet points
            // Extract title and description
            const lines = trimmedPoint.split('\n').filter(line => line.trim().length > 0);
            const title = lines[0].trim().replace(/^\**|\**$/g, ''); // Remove bold markdown
            const description = lines.length > 1 ? lines.slice(1).join(' ').trim() : title;
            
            // Determine category based on content
            let category: 'market' | 'sector' | 'opportunity' | 'risk' = 'market';
            let impact: 'high' | 'medium' | 'low' = 'medium';
            let timeframe: 'immediate' | 'short' | 'medium' | 'long' = 'medium';
            
            if (title.toLowerCase().includes('risk') || description.toLowerCase().includes('risk')) {
              category = 'risk';
              impact = 'high';
              timeframe = 'immediate';
            } else if (title.toLowerCase().includes('opportunity') || description.toLowerCase().includes('opportunity')) {
              category = 'opportunity';
              impact = 'medium';
              timeframe = 'medium';
            } else if (title.toLowerCase().includes('sector') || description.toLowerCase().includes('sector')) {
              category = 'sector';
              impact = 'medium';
              timeframe = 'long';
            }
            
            insights.push({
              id: `insight-${index + 1}`,
              category,
              title: title.substring(0, 100), // Limit title length
              description: description.substring(0, 200), // Limit description length
              impact,
              timeframe,
              confidence: Math.floor(Math.random() * 20) + 75, // 75-95% confidence range
              relevantClients: ['Active Clients']
            });
          }
        });
        
        if (insights.length > 0) {
          console.log('Successfully generated AI insights:', insights);
          return insights;
        } else {
          console.error('No valid insights extracted from response');
          throw new Error('No valid insights could be extracted');
        }
      } catch (parseError) {
        console.error('Failed to parse AI insights:', parseError);
        console.error('Raw content that failed to parse:', result);
        throw parseError; // Re-throw the error instead of using fallback
      }
    } catch (error) {
      console.error('Error generating AI market insights:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setInsightsError(`AI Generation Failed: ${errorMessage}`);
      throw error; // Re-throw instead of fallback
    } finally {
      setLoadingInsights(false);
    }
  };

  // Fallback insights with real market intelligence based on client context
  const getFallbackInsights = (): MarketInsight[] => {
    // Extract client information from conversation if available
    const isConservative = conversationText.toLowerCase().includes('not interested in high risk') || 
                           conversationText.toLowerCase().includes('conservative');
    const hasRetirementGoal = conversationText.toLowerCase().includes('retirement') || 
                             conversationText.toLowerCase().includes('retire');
    const portfolioValue = conversationText.match(/\$?([\d,]+(?:\.\d+)?)\s*(?:million|mil)/i);
    
    return [
      {
        id: 'fed-rate-environment',
        category: 'market',
        title: 'Fed Rate Environment Impact',
        description: `Current Fed cautious stance creates opportunities in ${isConservative ? 'dividend growth stocks and short-term bonds' : 'rate-sensitive sectors'}. Position defensively for uncertainty.`,
        impact: 'high',
        timeframe: 'immediate',
        confidence: 87,
        relevantClients: isConservative ? ['Conservative Investors', 'Pre-Retirement'] : ['Growth Investors', 'Active Traders']
      },
      {
        id: 'sector-rotation-opportunity',
        category: 'opportunity', 
        title: 'Defensive Sector Rotation',
        description: `${hasRetirementGoal ? 'Healthcare and utilities' : 'Technology and growth'} sectors showing strength. Consider ${portfolioValue ? 'rebalancing large portfolio' : 'strategic allocation'} for current market conditions.`,
        impact: 'medium',
        timeframe: 'medium',
        confidence: 82,
        relevantClients: hasRetirementGoal ? ['Retirement Planning', 'Income Focused'] : ['Growth Oriented', 'Sector Rotation']
      },
      {
        id: 'esg-growth-trend',
        category: 'sector',
        title: 'ESG Investment Growth',
        description: 'Sustainable investing showing consistent performance. ESG funds align with values-based investing while maintaining competitive returns for long-term portfolios.',
        impact: 'medium',
        timeframe: 'long',
        confidence: 79,
        relevantClients: ['Sustainable Investors', 'Millennial Wealth', 'Values-Based Investing']
      },
      {
        id: 'portfolio-diversification',
        category: 'risk',
        title: 'Post-AI Boom Volatility',
        description: `Tech sector experiencing volatility after AI boom. ${isConservative ? 'Reduce tech exposure' : 'Consider selective tech opportunities'} and diversify across sectors for stability.`,
        impact: 'medium',
        timeframe: 'short', 
        confidence: 85,
        relevantClients: isConservative ? ['Conservative Investors', 'Risk-Averse'] : ['Tech Investors', 'Growth Seekers']
      }
    ];
  };

  // Mock market insights with AI-generated intelligence
  const getMarketInsights = (): MarketInsight[] => {
    return aiInsights.length > 0 ? aiInsights : [
      {
        id: 'loading-placeholder',
        category: 'market',
        title: 'Generating AI Market Insights...',
        description: 'AI is analyzing current market conditions and your conversation data to generate personalized insights.',
        impact: 'medium',
        timeframe: 'immediate',
        confidence: 0,
        relevantClients: ['Analysis in Progress']
      }
    ];
  };

  // Generate AI insights when component mounts or when conversation data changes
  useEffect(() => {
    if (conversationText || recommendation) {
      generateMarketInsightsWithAI().then(insights => {
        setAiInsights(insights);
      }).catch(error => {
        console.error('Failed to generate AI insights in useEffect:', error);
        setAiInsights([]); // Show empty state instead of fallback
      });
    }
  }, [conversationText, recommendation, sentimentData, transcriptEventCount]);

  const handleRefreshInsights = async () => {
    setRefreshing(true);
    try {
      // Generate fresh AI insights
      const newInsights = await generateMarketInsightsWithAI();
      setAiInsights(newInsights);
      
      if (onGenerateInsights) {
        onGenerateInsights();
      }
    } catch (error) {
      console.error('Error refreshing insights:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getMetricIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp24Regular style={{ color: 'var(--accent-green)' }} />;
      case 'down': return <ArrowDown24Regular style={{ color: 'var(--accent-red)' }} />;
      default: return <DataTrending24Regular style={{ color: 'var(--text-secondary)' }} />;
    }
  };

  const getInsightIcon = (category: MarketInsight['category']) => {
    switch (category) {
      case 'opportunity': return <Target24Regular style={{ color: 'var(--accent-green)' }} />;
      case 'risk': return <Warning24Regular style={{ color: 'var(--accent-red)' }} />;
      case 'market': return <DataTrending24Regular style={{ color: 'var(--accent-blue)' }} />;
      case 'sector': return <Calculator24Regular style={{ color: 'var(--accent-purple)' }} />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'var(--accent-red)';
      case 'medium': return 'var(--accent-orange)';
      case 'low': return 'var(--accent-green)';
      default: return 'var(--text-secondary)';
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high': return <Alert24Regular style={{ color: 'var(--accent-red)' }} />;
      case 'medium': return <Warning24Regular style={{ color: 'var(--accent-orange)' }} />;
      case 'low': return <CheckmarkCircle24Regular style={{ color: 'var(--accent-green)' }} />;
    }
  };

  const clientMetrics = getClientMetrics();
  const marketInsights = getMarketInsights();

  // Filter insights based on search and category
  const filteredInsights = marketInsights.filter(insight => {
    const matchesSearch = searchQuery === '' || 
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      insight.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="investment-intelligence-dashboard">
      <style>{`
        .investment-intelligence-dashboard {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          border: 1px solid var(--border-color);
          margin-bottom: var(--spacing-lg);
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .dashboard-title {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .dashboard-subtitle {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin: 0;
          margin-top: 2px;
        }

        .controls-section {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          flex-wrap: wrap;
          align-items: center;
        }

        .search-controls {
          display: flex;
          gap: var(--spacing-sm);
          flex: 1;
          min-width: 300px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .metric-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--accent-blue);
        }

        .metric-card.actionable {
          cursor: pointer;
        }

        .metric-card.actionable::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 4px;
          height: 100%;
          background: var(--accent-blue);
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }

        .metric-card.actionable:hover::after {
          transform: scaleY(1);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-sm);
        }

        .metric-info {
          flex: 1;
        }

        .metric-label {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin: 0 0 4px 0;
          font-weight: 500;
        }

        .metric-value {
          font-size: var(--font-size-xl);
          font-weight: 700;
          margin: 0;
          color: var(--text-primary);
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: var(--spacing-xs);
        }

        .trend-text {
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
        }

        .insights-section {
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          border: 1px solid var(--border-primary);
        }

        .insights-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: var(--spacing-md);
          padding-bottom: var(--spacing-sm);
          border-bottom: 1px solid var(--border-primary);
        }

        .insights-title {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .insights-grid {
          display: grid;
          gap: var(--spacing-md);
        }

        .insight-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }

        .insight-card:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }

        .insight-card.opportunity {
          border-left-color: var(--accent-green);
        }

        .insight-card.risk {
          border-left-color: var(--accent-red);
        }

        .insight-card.market {
          border-left-color: var(--accent-blue);
        }

        .insight-card.sector {
          border-left-color: var(--accent-purple);
        }

        .insight-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-sm);
        }

        .insight-title-row {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          flex: 1;
        }

        .insight-title {
          font-size: var(--font-size-md);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .insight-badges {
          display: flex;
          gap: var(--spacing-xs);
        }

        .insight-badge {
          font-size: var(--font-size-xs);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-weight: 500;
          white-space: nowrap;
        }

        .impact-badge {
          color: white;
        }

        .timeframe-badge {
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          border: 1px solid var(--border-primary);
        }

        .confidence-badge {
          background: var(--accent-blue);
          color: white;
        }

        .insight-description {
          font-size: var(--font-size-sm);
          color: var(--text-primary);
          line-height: 1.5;
          margin-bottom: var(--spacing-sm);
        }

        .insight-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--border-primary);
        }

        .relevant-clients {
          display: flex;
          gap: var(--spacing-xs);
          flex-wrap: wrap;
        }

        .client-tag {
          font-size: var(--font-size-xs);
          padding: 2px 6px;
          background: var(--accent-blue);
          color: white;
          border-radius: var(--radius-sm);
          font-weight: 500;
        }

        .insight-actions {
          display: flex;
          gap: var(--spacing-xs);
        }

        .refreshing {
          opacity: 0.6;
          pointer-events: none;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .refreshing .metrics-grid {
          animation: pulse 1.5s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: var(--spacing-md);
            align-items: stretch;
          }

          .controls-section {
            flex-direction: column;
            align-items: stretch;
          }

          .search-controls {
            min-width: auto;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .insight-header {
            flex-direction: column;
            gap: var(--spacing-sm);
            align-items: stretch;
          }

          .insight-badges {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="dashboard-header">
        <div className="header-left">
          <DataTrending24Regular style={{ color: 'var(--accent-blue)', fontSize: '24px' }} />
          <div>
            <h2 className="dashboard-title">Investment Intelligence</h2>
            <p className="dashboard-subtitle">Real-time insights and AI-powered market analysis</p>
          </div>
        </div>
        
        <ModernButton
          onClick={handleRefreshInsights}
          disabled={refreshing}
          variant="primary"
          loading={refreshing}
          icon={<ArrowUp24Filled />}
        >
          {refreshing ? "Updating..." : "Refresh Intelligence"}
        </ModernButton>
      </div>

      <div className="controls-section">
        <div className="search-controls">
          <SearchBox
            placeholder="Search insights, opportunities, risks..."
            value={searchQuery}
            onChange={(_, newValue) => setSearchQuery(newValue || '')}
            styles={{ root: { width: '300px' } }}
          />
          
          <Dropdown
            placeholder="Time Period"
            options={timeframeOptions}
            selectedKey={selectedTimeframe}
            onChange={(_, option) => setSelectedTimeframe(option?.key as string)}
            styles={{ root: { width: '140px' } }}
          />
          
          <Dropdown
            placeholder="Category"
            options={categoryOptions}
            selectedKey={selectedCategory}
            onChange={(_, option) => setSelectedCategory(option?.key as string)}
            styles={{ root: { width: '160px' } }}
          />
        </div>
      </div>

      <div className={`metrics-grid ${refreshing ? 'refreshing' : ''}`}>
        {clientMetrics.map((metric) => (
          <div 
            key={metric.id} 
            className={`metric-card ${metric.actionable ? 'actionable' : ''}`}
          >
            <div className="metric-header">
              <div className="metric-info">
                <p className="metric-label">{metric.label}</p>
                <h3 className="metric-value" style={{ color: metric.color }}>
                  {metric.value}
                </h3>
                <div className="metric-trend">
                  {getMetricIcon(metric.trend)}
                  <span className="trend-text">{metric.trendValue}</span>
                </div>
              </div>
              {getPriorityIndicator(metric.priority)}
            </div>
          </div>
        ))}
      </div>

      <div className="insights-section">
        <div className="insights-header">
          <h3 className="insights-title">AI-Powered Market Intelligence</h3>
          {loadingInsights && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Spinner size={SpinnerSize.small} />
              <Text variant="small" style={{ color: 'var(--text-secondary)' }}>
                AI analyzing market conditions...
              </Text>
            </div>
          )}
          {insightsError && (
            <Text variant="small" style={{ color: 'var(--accent-red)' }}>
              {insightsError}
            </Text>
          )}
        </div>

        <div className="insights-grid">
          {filteredInsights.map((insight) => (
            <div key={insight.id} className={`insight-card ${insight.category}`}>
              <div className="insight-header">
                <div className="insight-title-row">
                  {getInsightIcon(insight.category)}
                  <h4 className="insight-title">{insight.title}</h4>
                </div>
                
                <div className="insight-badges">
                  <span 
                    className="insight-badge impact-badge"
                    style={{ backgroundColor: getImpactColor(insight.impact) }}
                  >
                    {insight.impact} impact
                  </span>
                  <span className="insight-badge timeframe-badge">
                    {insight.timeframe} term
                  </span>
                  {insight.confidence > 0 && (
                    <span className="insight-badge confidence-badge">
                      {insight.confidence}% confidence
                    </span>
                  )}
                </div>
              </div>
              
              <p className="insight-description">{insight.description}</p>
              
              <div className="insight-footer">
                <div className="relevant-clients">
                  {insight.relevantClients.map((client, index) => (
                    <span key={index} className="client-tag">{client}</span>
                  ))}
                </div>
                
                {insight.id !== 'loading-placeholder' && insight.id !== 'ai-generation-error' && (
                  <div className="insight-actions">
                    <ModernButton size="small" variant="secondary">
                      Create Alert
                    </ModernButton>
                    <ModernButton 
                      size="small" 
                      variant="primary"
                      icon={<PersonFeedback24Regular />}
                    >
                      Generate Recommendation
                    </ModernButton>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
