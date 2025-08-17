import React, { useState, useEffect } from 'react';
import { Text, SearchBox, Dropdown, IDropdownOption, Spinner, SpinnerSize, Toggle } from '@fluentui/react';
import { ModernButton, ModernIconButton } from './ModernButton';
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
  Alert24Regular,
  // Button icons
  AlertOn24Regular,
  Lightbulb24Regular,
  // Client category icons
  Building24Regular,
  Home24Regular,
  Star24Regular,
  Diamond24Regular,
  Briefcase24Regular,
  Heart24Regular,
  TreeEvergreenRegular,
  HatGraduation24Regular,
  // Impact and timeframe icons
  Important24Filled,
  Important24Regular,
  Circle24Regular,
  Flash24Regular,
  Timer324Regular,
  Calendar24Regular,
  CalendarLtr24Regular,
  // Category enhancement icons
  ChartMultiple24Regular,
  DataPie24Regular,
  ArrowTrendingLines24Regular,
  Info24Regular
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
  const [ultraCompact, setUltraCompact] = useState<boolean>(false);

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
        
        // Parse bullet points into insights - handle both • and - formats
        let bulletPoints: string[];
        
        console.log('Parsing AI response for bullet points. Content length:', result.length);
        
        // First try to split by bullet points with asterisks (- **)
        if (result.includes('- **')) {
          console.log('Found markdown bullet points (- **)');
          bulletPoints = result.split(/- \*\*/).filter(point => point.trim().length > 0);
          // Remove the introductory text before the first bullet point
          if (bulletPoints.length > 0 && !bulletPoints[0].includes(':')) {
            console.log('Removing introductory text');
            bulletPoints = bulletPoints.slice(1);
          }
        } else if (result.includes('•')) {
          console.log('Found bullet character (•)');
          // Fallback to bullet character
          bulletPoints = result.split('•').filter(point => point.trim().length > 0);
        } else {
          console.log('Using dash splitting as fallback');
          // Try splitting by dash at start of line
          bulletPoints = result.split(/\n-\s+/).filter(point => point.trim().length > 0);
          if (bulletPoints.length <= 1) {
            // Try simple dash splitting
            bulletPoints = result.split('-').filter(point => point.trim().length > 20);
          }
        }
        
        console.log('Found bullet points:', bulletPoints.length);
        
        const insights: MarketInsight[] = [];
        
        bulletPoints.forEach((point, index) => {
          const trimmedPoint = point.trim();
          console.log(`Processing bullet point ${index + 1}:`, trimmedPoint.substring(0, 100) + '...');
          
          if (trimmedPoint.length > 20) { // Only process substantial bullet points
            // Extract title and description
            let title = '';
            let description = '';
            
            // Handle markdown bold titles (**: text**)
            const boldMatch = trimmedPoint.match(/^([^*]+)\*\*:\s*(.*)/s);
            if (boldMatch) {
              title = boldMatch[1].trim();
              description = boldMatch[2].trim();
              console.log('Extracted via bold match:', { title, description: description.substring(0, 50) + '...' });
            } else {
              // Fallback: split by first colon or period
              const colonMatch = trimmedPoint.match(/^([^.:]+)[.:](.*)$/s);
              if (colonMatch) {
                title = colonMatch[1].trim();
                description = colonMatch[2].trim();
                console.log('Extracted via colon match:', { title, description: description.substring(0, 50) + '...' });
              } else {
                // Use first line as title, rest as description
                const lines = trimmedPoint.split('\n').filter(line => line.trim().length > 0);
                title = lines[0].trim().replace(/^\**|\**$/g, ''); // Remove bold markdown
                description = lines.length > 1 ? lines.slice(1).join(' ').trim() : title;
                console.log('Extracted via line split:', { title, description: description.substring(0, 50) + '...' });
              }
            }
            
            // Clean up the title and description
            title = title.replace(/^\**|\**$/g, '').trim();
            description = description.replace(/^\**|\**$/g, '').trim();
            
            // Determine category based on content
            let category: 'market' | 'sector' | 'opportunity' | 'risk' = 'market';
            let impact: 'high' | 'medium' | 'low' = 'medium';
            let timeframe: 'immediate' | 'short' | 'medium' | 'long' = 'medium';
            let relevantClients: string[] = ['Active Clients'];
            
            const titleLower = title.toLowerCase();
            const descLower = description.toLowerCase();
            
            // More sophisticated categorization
            if (titleLower.includes('risk') || descLower.includes('risk') || descLower.includes('volatility')) {
              category = 'risk';
              impact = 'high';
              timeframe = 'immediate';
              relevantClients = ['Risk-Conscious', 'Conservative Investors'];
            } else if (titleLower.includes('opportunity') || titleLower.includes('growth') || descLower.includes('opportunity')) {
              category = 'opportunity';
              impact = 'medium';
              timeframe = 'medium';
              relevantClients = ['Growth Investors', 'Active Traders'];
            } else if (titleLower.includes('sector') || titleLower.includes('dividend') || titleLower.includes('esg') || 
                      titleLower.includes('fixed') || descLower.includes('sector')) {
              category = 'sector';
              impact = 'medium';
              timeframe = 'long';
              relevantClients = ['Sector Focused', 'Income Investors'];
            } else if (titleLower.includes('tax') || titleLower.includes('estate') || titleLower.includes('planning')) {
              category = 'opportunity';
              impact = 'high';
              timeframe = 'long';
              relevantClients = ['High Net Worth', 'Estate Planning'];
            }
            
            // Determine impact based on keywords
            if (descLower.includes('critical') || descLower.includes('important') || descLower.includes('significant')) {
              impact = 'high';
            } else if (descLower.includes('moderate') || descLower.includes('steady')) {
              impact = 'medium';
            }
            
            // Determine timeframe based on keywords
            if (descLower.includes('immediate') || descLower.includes('now') || descLower.includes('current')) {
              timeframe = 'immediate';
            } else if (descLower.includes('short') || descLower.includes('near term')) {
              timeframe = 'short';
            } else if (descLower.includes('long') || descLower.includes('retirement') || descLower.includes('estate')) {
              timeframe = 'long';
            }
            
            const finalInsight = {
              id: `ai-insight-${index + 1}`,
              category,
              title: title.length > 60 ? title.substring(0, 60) + '...' : title,
              description: description.length > 200 ? description.substring(0, 200) + '...' : description,
              impact,
              timeframe,
              confidence: Math.floor(Math.random() * 15) + 80, // 80-95% confidence range
              relevantClients
            };
            
            console.log(`Created insight ${index + 1}:`, {
              title: finalInsight.title,
              category: finalInsight.category,
              impact: finalInsight.impact,
              timeframe: finalInsight.timeframe,
              confidence: finalInsight.confidence
            });
            
            insights.push(finalInsight);
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

  // New icon helper functions for enhanced visual appeal
  const getClientCategoryIcon = (clientType: string) => {
    const type = clientType.toLowerCase();
    if (type.includes('conservative') || type.includes('risk-conscious')) {
      return <Shield24Regular style={{ color: 'var(--accent-blue)', fontSize: '14px' }} />;
    } else if (type.includes('growth') || type.includes('active')) {
      return <ArrowTrendingLines24Regular style={{ color: 'var(--accent-green)', fontSize: '14px' }} />;
    } else if (type.includes('income') || type.includes('dividend')) {
      return <Money24Regular style={{ color: 'var(--accent-purple)', fontSize: '14px' }} />;
    } else if (type.includes('high net worth') || type.includes('estate')) {
      return <Diamond24Regular style={{ color: 'var(--accent-orange)', fontSize: '14px' }} />;
    } else if (type.includes('retirement') || type.includes('pre-retirement')) {
      return <HatGraduation24Regular style={{ color: 'var(--accent-red)', fontSize: '14px' }} />;
    } else if (type.includes('sector') || type.includes('focused')) {
      return <ChartMultiple24Regular style={{ color: 'var(--accent-blue)', fontSize: '14px' }} />;
    } else if (type.includes('sustainable') || type.includes('esg')) {
      return <TreeEvergreenRegular style={{ color: 'var(--accent-green)', fontSize: '14px' }} />;
    } else if (type.includes('tech') || type.includes('innovation')) {
      return <Lightbulb24Regular style={{ color: 'var(--accent-purple)', fontSize: '14px' }} />;
    } else if (type.includes('planning')) {
      return <Calendar24Regular style={{ color: 'var(--accent-orange)', fontSize: '14px' }} />;
    } else {
      return <People24Regular style={{ color: 'var(--text-secondary)', fontSize: '14px' }} />;
    }
  };

  // Normalize client labels to a canonical key for icon grouping (dedup)
  const getClientIconKey = (clientType: string): string => {
    const t = (clientType || '').toLowerCase();
    if (t.includes('conservative') || t.includes('risk-conscious') || t.includes('risk averse')) return 'conservative';
    if (t.includes('growth') || t.includes('active') || t.includes('growth oriented')) return 'growth';
    if (t.includes('income') || t.includes('dividend')) return 'income';
    if (t.includes('high net worth') || t.includes('hnw') || t.includes('estate')) return 'hni';
    if (t.includes('retirement') || t.includes('pre-retirement')) return 'retirement';
    if (t.includes('sector') || t.includes('focused')) return 'sector';
    if (t.includes('sustainable') || t.includes('esg') || t.includes('values')) return 'sustainable';
    if (t.includes('tech') || t.includes('innovation')) return 'tech';
    if (t.includes('planning') || t.includes('tax')) return 'planning';
    return 'general';
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <Important24Filled style={{ color: 'white', fontSize: '12px' }} />;
      case 'medium': return <Important24Regular style={{ color: 'white', fontSize: '12px' }} />;
      case 'low': return <Circle24Regular style={{ color: 'white', fontSize: '12px' }} />;
      default: return <Circle24Regular style={{ color: 'white', fontSize: '12px' }} />;
    }
  };

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate': return <Flash24Regular style={{ color: 'var(--text-secondary)', fontSize: '12px' }} />;
      case 'short': return <Timer324Regular style={{ color: 'var(--text-secondary)', fontSize: '12px' }} />;
      case 'medium': return <Calendar24Regular style={{ color: 'var(--text-secondary)', fontSize: '12px' }} />;
      case 'long': return <CalendarLtr24Regular style={{ color: 'var(--text-secondary)', fontSize: '12px' }} />;
      default: return <Clock24Regular style={{ color: 'var(--text-secondary)', fontSize: '12px' }} />;
    }
  };

  // Enhanced client category styling based on type
  const getClientCategoryStyle = (clientType: string) => {
    const type = clientType.toLowerCase();
    if (type.includes('conservative') || type.includes('risk-conscious')) {
      return { backgroundColor: 'var(--accent-blue)', color: 'white' };
    } else if (type.includes('growth') || type.includes('active')) {
      return { backgroundColor: 'var(--accent-green)', color: 'white' };
    } else if (type.includes('income') || type.includes('dividend')) {
      return { backgroundColor: 'var(--accent-purple)', color: 'white' };
    } else if (type.includes('high net worth') || type.includes('estate')) {
      return { backgroundColor: 'var(--accent-orange)', color: 'white' };
    } else if (type.includes('retirement') || type.includes('pre-retirement')) {
      return { backgroundColor: 'var(--accent-red)', color: 'white' };
    } else if (type.includes('sustainable') || type.includes('esg')) {
      return { backgroundColor: 'var(--accent-green)', color: 'white' };
    } else {
      return { backgroundColor: 'var(--accent-blue)', color: 'white' };
    }
  };

  // Tooltip rationale for why a client segment is relevant to an insight
  const getClientRationale = (clientType: string): string => {
    const t = clientType.toLowerCase();
    if (t.includes('risk') || t.includes('conservative')) {
      return 'Lower volatility positioning, capital preservation, and downside protection align with this theme.';
    }
    if (t.includes('income') || t.includes('dividend')) {
      return 'Consistent cash flows and dividend stability benefit from the described market setup.';
    }
    if (t.includes('growth') || t.includes('active')) {
      return 'Alpha opportunities via sector rotation and momentum in the highlighted areas.';
    }
    if (t.includes('high net worth')) {
      return 'Tax optimization, estate planning, and bespoke allocation strategies are especially impactful.';
    }
    if (t.includes('estate')) {
      return 'Coordination with trust/estate strategies can enhance after-tax outcomes.';
    }
    if (t.includes('retirement') || t.includes('pre-retirement')) {
      return 'Sequence-of-returns risk and horizon-aware allocation suggest more resilient mixes.';
    }
    if (t.includes('esg') || t.includes('sustainable')) {
      return 'Values alignment with resilient ESG factors and long-term structural trends.';
    }
    if (t.includes('sector')) {
      return 'Targeted sector exposure can capture the opportunity while controlling risk.';
    }
    return 'Relevant audience for this theme based on preferences and constraints.';
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
  <div className={`investment-intelligence-dashboard ${ultraCompact ? 'ultra-compact' : ''}`}>
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

  .view-controls { display: flex; align-items: center; gap: var(--spacing-sm); margin-left: auto; }

  .legend-info { color: var(--text-secondary); display: inline-flex; align-items: center; margin-left: 8px; }
  .legend-info .tooltip-bubble { left: auto; right: 0; max-width: 460px; }

        .search-controls {
          display: flex;
          gap: var(--spacing-sm);
          flex: 1;
          min-width: 300px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
        }

        .metric-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          padding: calc(var(--spacing-sm) - 2px);
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
          align-items: center;
          margin-bottom: var(--spacing-xs);
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
          letter-spacing: 0.2px;
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }

        .trend-text {
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
        }

        .insights-section {
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          border: 1px solid var(--border-primary);
        }

        .insights-header {
          display: flex;
          justify-content: space-between;
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
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: var(--spacing-md);
          margin-top: var(--spacing-md);
          align-items: stretch;
        }

        .insight-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          position: relative;
  }

        /* Animated accent bar that reflects impact */
        .insight-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          height: 3px;
          width: 0;
          background: var(--impact-color, transparent);
          transition: width .3s ease;
        }
        .insight-card:hover::after {
          width: 100%;
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
          align-items: center;
          margin-bottom: var(--spacing-xs);
          gap: var(--spacing-xs);
        }

        .insight-title-row {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          flex: 1;
        }

        .category-avatar {
          width: 20px; height: 20px; border-radius: 999px;
          background: var(--bg-primary);
          border: 2px solid var(--accent-blue);
          display: inline-flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

  .insight-title {
          font-size: var(--font-size-md);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .insight-badges { display: none; }
        .status-dock {
          position: absolute; top: 8px; right: 8px;
          display: inline-flex; gap: 6px; align-items: center;
          background: var(--bg-primary);
          border: 1px solid var(--border-primary);
          border-radius: 999px;
          padding: 4px 8px;
        }

        .insight-badge {
          font-size: var(--font-size-xs);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-weight: 500;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
          cursor: default;
          letter-spacing: 0.2px;
        }

        /* Compact, icon-only pill for status badges */
        .insight-badge.icon-only {
          width: 20px;
          height: 20px;
          padding: 0;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .insight-badge:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

        /* Radial confidence ring */
        .confidence-badge.icon-only { background: transparent; }
        .confidence-ring {
          width: 20px; height: 20px; border-radius: 999px;
          background: conic-gradient(var(--accent-blue) var(--confDeg,0deg), var(--border-primary) 0);
          display: inline-flex; align-items: center; justify-content: center;
        }
        .confidence-center {
          width: 14px; height: 14px; border-radius: 999px;
          background: var(--bg-secondary);
          display: flex; align-items: center; justify-content: center;
        }

        .insight-description {
          font-size: var(--font-size-sm);
          color: var(--text-primary);
          line-height: 1.5;
          margin-bottom: var(--spacing-xs);
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .insight-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: var(--spacing-xs);
          border-top: 1px solid var(--border-primary);
          gap: var(--spacing-xs);
        }

        .relevant-clients {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          flex: 1;
          align-items: flex-start;
        }

        .client-tag {
          font-size: var(--font-size-xs);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
          cursor: default;
        }

        .client-tag:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .insight-actions {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
          align-items: flex-start;
          align-self: flex-end;
        }

        /* Tweak icon buttons inside action area */
        .insight-actions .modern-icon-button {
          border-radius: var(--radius-md);
          width: 28px; height: 28px;
        }

        .insight-actions .modern-icon-button:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
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

  @media (max-width: 1200px) {
          .insights-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
        }

        @media (max-width: 900px) {
          .insights-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
          /* footer actions always visible */
          .insight-actions { display: flex; }
        }
        /* on wider screens keep footer actions visible */

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

          .insights-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }

          .insight-header {
            flex-direction: column;
            gap: var(--spacing-sm);
            align-items: stretch;
          }

          .insight-badges {
            flex-wrap: wrap;
          }

          .insight-footer {
            flex-direction: column;
            gap: var(--spacing-sm);
            align-items: stretch;
          }

          .insight-actions {
            justify-content: center;
          }
        }

        /* Collapse client tag labels on very small screens */
        @media (max-width: 420px) {
          .client-tag .client-tag-label { display: none; }
          .client-tag { width: 32px; justify-content: center; }
        }

        /* Footer icon row */
        .footer-icons {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: var(--spacing-xs);
        }
        .icon-group { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .client-icon { width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; background: var(--bg-primary); border: 1px solid var(--border-primary); }

        /* Legend styling */
        .insights-legend {
          display: flex;
          flex-wrap: nowrap;
          gap: var(--spacing-lg);
          align-items: center;
          margin-top: var(--spacing-lg);
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--border-primary);
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          overflow: hidden;
          white-space: nowrap;
        }

        .legend-group {
          display: inline-flex; align-items: center; gap: var(--spacing-xs);
        }

        .legend-label {
          font-weight: 600;
          color: var(--text-primary);
          margin-right: 4px;
        }

        .legend-chip { display: inline-flex; align-items: center; gap: 6px; }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Generic tooltip pattern */
        .has-tooltip {
          position: relative;
        }
        .tooltip-bubble {
          position: absolute;
          z-index: 20;
          bottom: 100%;
          left: 0;
          transform: translateY(-6px);
          background: var(--bg-primary);
          color: var(--text-primary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-sm);
          padding: 8px 10px;
          font-size: var(--font-size-sm);
          line-height: 1.4;
          opacity: 0;
          pointer-events: none;
          transition: opacity .15s ease, transform .15s ease;
          max-width: 420px;
          white-space: normal;
        }
        .tooltip-bubble::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 12px;
          border-width: 6px;
          border-style: solid;
          border-color: var(--bg-primary) transparent transparent transparent;
          filter: drop-shadow(0 -1px 0 var(--border-primary));
        }
        .has-tooltip:hover .tooltip-bubble {
          opacity: 1;
          transform: translateY(-10px);
        }

  /* Ultra-compact mode: further tighten */
  .ultra-compact .insights-grid { gap: var(--spacing-sm); }
  .ultra-compact .insight-card { padding: 6px; min-height: 160px; }
  .ultra-compact .insight-description { -webkit-line-clamp: 2; margin-bottom: 4px; }
  .ultra-compact .insights-legend { display: none; }
      `}</style>

      {/* <div className="dashboard-header">
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
        <div className="view-controls">
          <Toggle
            label="Ultra-compact"
            inlineLabel
            checked={ultraCompact}
            onChange={(_, val) => setUltraCompact(!!val)}
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
      </div> */}

      <div className="insights-section">
        <div className="insights-header">
          <h3 className="insights-title">AI-Powered Market Intelligence</h3>
          <span className="legend-info has-tooltip" aria-label="Legend">
            <Info24Regular />
            <span className="tooltip-bubble">
              <strong>Legend</strong>
              <div style={{marginTop:6, display:'grid', gridTemplateColumns:'auto 1fr', gap:6}}>
                <span className="insight-badge icon-only" style={{ backgroundColor: 'var(--accent-red)' }}>{getImpactIcon('high')}</span>
                <span>Impact level</span>
                <span className="insight-badge timeframe-badge icon-only">{getTimeframeIcon('short')}</span>
                <span>Timeframe</span>
                <span className="insight-badge confidence-badge icon-only"><Star24Regular style={{ color: 'white', fontSize: '12px' }} /></span>
                <span>Confidence</span>
                <span className="client-icon">{getClientCategoryIcon('Conservative Investors')}</span>
                <span>Relevant clients</span>
              </div>
            </span>
          </span>
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
            <div 
              key={insight.id} 
              className={`insight-card ${insight.category}`}
              style={{ ['--impact-color' as any]: getImpactColor(insight.impact) }}
            >
              <div className="insight-header">
                <div className="insight-title-row has-tooltip">
                  <span className="category-avatar">{getInsightIcon(insight.category)}</span>
                  <h4 className="insight-title">{insight.title}</h4>
                  <div className="tooltip-bubble">
                    <strong style={{display:'inline-flex', alignItems:'center', gap:6}}>
                      {getInsightIcon(insight.category)}
                      {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)} insight
                    </strong>
                    <div style={{marginTop:6, color:'var(--text-secondary)'}}>Hover the card for quick actions and glanceable status. Click icons to act.</div>
                  </div>
                </div>
                {/* status icons moved to footer */}
              </div>
              
              <div className="has-tooltip">
                <p className="insight-description">{insight.description}</p>
                <div className="tooltip-bubble" style={{left:'auto', right:0}}>
                  <strong>Full detail</strong>
                  <div style={{marginTop:6}}>{insight.description}</div>
                </div>
              </div>
              
              <div className="insight-footer">
                <div className="footer-icons">
                  <span className="icon-group">
                    <span 
                      className="insight-badge impact-badge icon-only"
                      style={{ backgroundColor: getImpactColor(insight.impact) }}
                      title={`${insight.impact} impact`}
                      aria-label={`${insight.impact} impact`}
                    >
                      {getImpactIcon(insight.impact)}
                    </span>
                    <span 
                      className="insight-badge timeframe-badge icon-only"
                      title={`${insight.timeframe} term`}
                      aria-label={`${insight.timeframe} term`}
                    >
                      {getTimeframeIcon(insight.timeframe)}
                    </span>
                    {insight.confidence > 0 && (
                      <span 
                        className="insight-badge confidence-badge icon-only"
                        title={`${insight.confidence}% confidence`}
                        aria-label={`${insight.confidence}% confidence`}
                      >
                        <span className="confidence-ring" style={{ ['--confDeg' as any]: `${insight.confidence * 3.6}deg` }}>
                          <span className="confidence-center">
                            <Star24Regular style={{ color: 'var(--accent-blue)', fontSize: '12px' }} />
                          </span>
                        </span>
                      </span>
                    )}
                  </span>

                  <span className="icon-group">
                    {(() => {
                      const maxIcons = 4;
                      const clients = (insight.relevantClients || []).filter(Boolean);
                      const groups = new Map<string, {names: string[], icon: JSX.Element, style: React.CSSProperties}>();
                      clients.forEach((c) => {
                        const key = getClientIconKey(c);
                        const icon = getClientCategoryIcon(c) as JSX.Element;
                        const style = getClientCategoryStyle(c) as React.CSSProperties;
                        const g = groups.get(key);
                        if (g) { g.names.push(c); }
                        else { groups.set(key, { names: [c], icon, style }); }
                      });
                      const grouped = Array.from(groups.values());
                      const show = grouped.slice(0, maxIcons);
                      const extra = grouped.length - show.length;
                      return (
                        <>
                          {show.map((g, idx) => (
                            <span key={idx} className="has-tooltip client-icon" aria-label={g.names.join(', ')} title={g.names.join(', ')} style={g.style}>
                              {g.icon}
                              <div className="tooltip-bubble">
                                <strong>{g.names.join(' • ')}</strong>
                                <div style={{marginTop:6}}>{getClientRationale(g.names[0])}</div>
                              </div>
                            </span>
                          ))}
                          {extra > 0 && (
                            <span className="client-icon" title={`+${extra} more groups`} aria-label={`+${extra} more groups`}>+{extra}</span>
                          )}
                        </>
                      );
                    })()}
                  </span>

                  {insight.id !== 'loading-placeholder' && insight.id !== 'ai-generation-error' && (
                    <span className="icon-group">
                      <ModernIconButton
                        icon={<AlertOn24Regular />}
                        title="Create Alert"
                        variant="secondary"
                        size="small"
                        onClick={() => {/* TODO: wire alert creation */}}
                      />
                      <ModernIconButton
                        icon={<Lightbulb24Regular />}
                        title="Generate Recommendation"
                        variant="primary"
                        size="small"
                        onClick={() => {/* TODO: wire recommendation generation */}}
                      />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Condensed single-line legend */}
        <div className="insights-legend">
          <span className="legend-group">
            <span className="legend-label">Legend:</span>
            <span className="legend-chip" title="Impact"><span className="insight-badge icon-only" style={{ backgroundColor: 'var(--accent-red)' }}>{getImpactIcon('high')}</span> Impact</span>
            <span className="legend-chip" title="Timeframe"><span className="insight-badge timeframe-badge icon-only">{getTimeframeIcon('short')}</span> Timeframe</span>
            <span className="legend-chip" title="Confidence"><span className="insight-badge confidence-badge icon-only"><Star24Regular style={{ color: 'white', fontSize: '12px' }} /></span> Confidence</span>
            <span className="legend-chip" title="Relevant clients"><span className="client-icon">{getClientCategoryIcon('Conservative Investors')}</span> Clients</span>
          </span>
        </div>
      </div>
    </div>
  );
};
