//App.tsx file content
import React , { Component, RefObject } from 'react';
import { Dropdown, IDropdownOption, PrimaryButton, DefaultButton, TextField, Panel, Text, Link, Pivot, PivotItem, Label } from '@fluentui/react';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { getKeyPhrases, getTokenOrRefresh, getGPTCustomPromptCompletion, gptLiveGuidance, generateRecommendation } from './api/backend_api_orchestrator.ts';
import {getImageSasUrls, getGPTVInsights } from './api/backend_api_orchestrator.ts';
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import './App.css';
import './styles/modern-theme.css';
import { Delete24Regular } from "@fluentui/react-icons";
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import SpokenLanguageOptions from './AppSettings.tsx';
import { ScenarioOptions } from './AppSettings.tsx';
import { insuranceConversationTemplate } from './ConversationTemplates';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { ModernSettingsPanel } from './components/ModernSettingsPanel';
import { UnifiedLiveGuidancePanel } from './components/UnifiedLiveGuidancePanel';
import { ProgressLiveGuidancePanel } from './components/ProgressLiveGuidancePanel';
import { KanbanLiveGuidancePanel } from './components/KanbanLiveGuidancePanel';
import { ChatLiveGuidancePanel } from './components/ChatLiveGuidancePanel';
import { ModernSection, ModernPivotSection, ModernTextArea } from './components/ModernSection';
import { ModernButton, ModernIconButton } from './components/ModernButton';
import { SentimentGauge } from './components/SentimentGauge';
import { StatusBar } from './components/StatusBar';
import { NotificationSystem, useNotifications } from './components/NotificationSystem';
import { RecommendationPanel } from './components/RecommendationPanel';
import { CombinedInsightsPanel } from './components/CombinedInsightsPanel';
import { SmartNotificationHeader } from './components/SmartNotificationHeader';
import { EnhancedRecommendationPanel } from './components/EnhancedRecommendationPanel';
import { InvestmentIntelligenceDashboard } from './components/InvestmentIntelligenceDashboard';
import { ClientEngagementWorkflow } from './components/ClientEngagementWorkflow';

let recognizer: any;
// Define an interface for the image object  
interface Image {  
  name: string;  
  sasUrl: string;  
  imageInsights: string;
} 

interface AppState {
    displayText: string;
    displayNLPOutput: string;  
    value: string;
    displayKeyPhrases: string;
    displayPiiText: string;
    gptInsightsOutput: string;
    transcriptEventCount: number;
    isSettingsPanelOpen: boolean;
    conversationTemplate: string;
    copilotChecked: boolean;
    agentGuidance: string;
    taskCompleted: string;
    spokenLanguage: string;
    imageList: Image[];
    selectedImage: string;
    caseNumber: number;
    gptvInsights: string;
    showPhotoPanel: boolean;
    showPromptPanel: boolean;
    showTranscriptPanel: boolean;
    showPIIRedactedTranscript: boolean;
    sentimentData: {
        // Current/Latest sentiment from most recent utterance
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
        };
        // Rolling/Aggregated sentiment from entire conversation
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
    };
    isRecording: boolean;
    isProcessing: boolean;
    connectionStatus: 'connected' | 'disconnected' | 'connecting';
    recommendation: string;
    isGeneratingRecommendation: boolean;
    liveGuidanceViewMode: 'unified' | 'progress' | 'kanban' | 'chat';
    // Notification system for recommendation alerts
    newRecommendationCount: number;
    lastRecommendationTime: Date | null;
    showRecommendationAlert: boolean;
    recommendationHistory: Array<{
        id: string;
        content: string;
        timestamp: Date;
        isRead: boolean;
        priority: 'low' | 'medium' | 'high';
    }>;
    // Enhanced features control
    showEnhancedFeatures: boolean;
    showIntelligenceDashboard: boolean;
    showClientWorkflow: boolean;
}export default class App extends Component<{}, AppState> {
  private containerRef: RefObject<HTMLDivElement>;
  
  constructor(props: any) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
        value: '',
        displayText: 'Speak to your microphone or copy/paste conversation transcript here',
        displayNLPOutput: '',
        displayKeyPhrases: '',
        displayPiiText: '',
        gptInsightsOutput: '',
        transcriptEventCount: 0,
        isSettingsPanelOpen: false, 
        conversationTemplate: insuranceConversationTemplate,    
        agentGuidance: '',
        taskCompleted: '',
        spokenLanguage: 'en-US',
        selectedImage: '',
        imageList: [],    
        caseNumber: Date.now(),
        gptvInsights: '',  
        copilotChecked: true,  
        showPhotoPanel: false,
        showPromptPanel: false,
        showTranscriptPanel: true,
        showPIIRedactedTranscript: true,
        sentimentData: {
            current: {
                overall: {
                    sentiment: 'neutral',
                    score: 0.5,
                    confidenceScores: {
                        positive: 0.33,
                        negative: 0.33,
                        neutral: 0.34
                    }
                },
                sentences: []
            },
            rolling: {
                overall: {
                    sentiment: 'neutral',
                    score: 0.5,
                    confidenceScores: {
                        positive: 0.33,
                        negative: 0.33,
                        neutral: 0.34
                    }
                },
                allSentences: []
            }
        },
        isRecording: false,
        isProcessing: false,
        connectionStatus: 'disconnected',
        recommendation: 'Click "Generate Recommendations" to analyze the conversation and get personalized Fisher Investments recommendations.',
        isGeneratingRecommendation: false,
        liveGuidanceViewMode: 'unified',
        // Initialize notification system
        newRecommendationCount: 0,
        lastRecommendationTime: null,
        showRecommendationAlert: false,
        recommendationHistory: [],
        // Enhanced features control
        showEnhancedFeatures: true,
        showIntelligenceDashboard: true,
        showClientWorkflow: false
    };  }

  // Notification system methods
  addRecommendationAlert = (content: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newAlert = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      timestamp: new Date(),
      isRead: false,
      priority
    };

    this.setState(prevState => ({
      recommendationHistory: [newAlert, ...prevState.recommendationHistory],
      newRecommendationCount: prevState.newRecommendationCount + 1,
      lastRecommendationTime: new Date(),
      showRecommendationAlert: true
    }));

    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      this.setState({ showRecommendationAlert: false });
    }, 5000);
  };

  markRecommendationAsRead = (id: string) => {
    this.setState(prevState => ({
      recommendationHistory: prevState.recommendationHistory.map(alert =>
        alert.id === id ? { ...alert, isRead: true } : alert
      ),
      newRecommendationCount: Math.max(0, prevState.newRecommendationCount - 1)
    }));
  };

  markAllRecommendationsAsRead = () => {
    this.setState(prevState => ({
      recommendationHistory: prevState.recommendationHistory.map(alert => ({ ...alert, isRead: true })),
      newRecommendationCount: 0
    }));
  };

  viewRecommendation = (id: string) => {
    const alert = this.state.recommendationHistory.find(a => a.id === id);
    if (alert) {
      this.setState({ recommendation: alert.content });
      // Scroll to recommendation section
      const recommendationElement = document.querySelector('.recommendation-panel');
      if (recommendationElement) {
        recommendationElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  handleSpokenLangDropdownChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option) {
      this.setState({spokenLanguage: option.key as string});
    } else {
      this.setState({spokenLanguage: 'en-US'});
    }
  };

  handleToggleChange = () => {
    this.setState((prevState) => ({
      copilotChecked: !prevState.copilotChecked,
    }));
  };

  handleTranscriptPanelToggleChange = () => {
    this.setState((prevState) => ({
      showTranscriptPanel: !prevState.showTranscriptPanel,
    }));
  };

  handlePIITranscriptToggleChange = () => {
    this.setState((prevState) => ({
      showPIIRedactedTranscript: !prevState.showPIIRedactedTranscript,
    }));
  };

  handlePhotoPanelToggleChange = () => {
    this.setState((prevState) => ({
      showPhotoPanel: !prevState.showPhotoPanel,
    }));
  };

  handlePromptPanelToggleChange = () => {
    this.setState((prevState) => ({
      showPromptPanel: !prevState.showPromptPanel,
    }));
  };

  // Enhanced features toggle handlers
  handleEnhancedFeaturesToggleChange = () => {
    this.setState((prevState) => ({
      showEnhancedFeatures: !prevState.showEnhancedFeatures,
    }));
  };

  handleIntelligenceDashboardToggleChange = () => {
    this.setState((prevState) => ({
      showIntelligenceDashboard: !prevState.showIntelligenceDashboard,
    }));
  };

  handleClientWorkflowToggleChange = () => {
    this.setState((prevState) => ({
      showClientWorkflow: !prevState.showClientWorkflow,
    }));
  };

  scrollLeft = () => { if (this.containerRef.current) {
      this.containerRef.current.scrollLeft -= 200; //Adjust as needed
    }
  };

  scrollRight = () => { if (this.containerRef.current) {
          this.containerRef.current.scrollLeft += 200; //Adjust as needed
      }
  };

  async componentDidMount() { // check for valid speech key/region
      const tokenRes = await getTokenOrRefresh();
      if (tokenRes.authToken === null) {
          this.setState({ displayText: 'ERROR: ' + tokenRes.error });
      }
  }

  async sttFromMic() {
      // Set connecting status
      this.setState({ connectionStatus: 'connecting', isProcessing: true });
      
      const tokenObj = await getTokenOrRefresh();
      
      if (tokenObj.authToken === null) {
          this.setState({ 
              displayText: 'ERROR: ' + tokenObj.error,
              connectionStatus: 'disconnected',
              isProcessing: false,
              isRecording: false
          });
          return;
      }
      
      const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken as string, tokenObj.region as string);
      speechConfig.speechRecognitionLanguage = this.state.spokenLanguage;        
      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
      recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
      
      this.setState({
          displayText: 'Speak to your microphone or copy/paste conversation transcript here',
          connectionStatus: 'connected',
          isRecording: true,
          isProcessing: false
      });      

      let resultText = "";
      let nlpText = "";
      let keyPhraseText = "";
      let piiText = "";

      recognizer.sessionStarted = (s: any, e: any) => { };

      recognizer.recognized = async (s: any, e: any) => {
          if(e.result.reason === ResultReason.RecognizedSpeech){
              resultText += `\n${e.result.text}`;    
              this.setState({ displayText: resultText }); 
              this.setState( {transcriptEventCount: this.state.transcriptEventCount+1});
           
            (document.getElementById('transcriptTextarea') as HTMLTextAreaElement).value = resultText;  
            const nlpObj = await getKeyPhrases(e.result.text);   
            const entityText = nlpObj.entityExtracted;             
            if(entityText.length > 12){
                nlpText += entityText;
                this.setState({ displayNLPOutput: nlpText.replace('<br/>', '\n') });
            }
            const keyPhraseOut = JSON.stringify(nlpObj.keyPhrasesExtracted); 
            if(keyPhraseOut.length > 15){
                keyPhraseText += "\n" + keyPhraseOut;
                this.setState({ displayKeyPhrases: keyPhraseText }); 
            }                
            const piiOut = nlpObj.piiExtracted;
            if(piiOut.length > 21){
              piiText += "\n" + piiOut; 
                this.setState({ displayPiiText: piiText.replace('<br/>', '\n') }); 
            }
            
            // Update sentiment analysis if available
            if(nlpObj.sentimentAnalysis){
                // Update current sentiment from latest utterance
                const currentSentiment = nlpObj.sentimentAnalysis;
                
                // Calculate rolling sentiment by accumulating all sentences
                if (currentSentiment.sentences && currentSentiment.sentences.length > 0) {
                    const newSentence = {
                        ...currentSentiment.sentences[0], // Assuming single sentence for current utterance
                        timestamp: Date.now()
                    };
                    
                    const allSentences = [...this.state.sentimentData.rolling.allSentences, newSentence];
                    
                    // Calculate rolling overall sentiment from all sentences
                    const totalPositive = allSentences.reduce((sum, s) => sum + s.confidenceScores.positive, 0);
                    const totalNegative = allSentences.reduce((sum, s) => sum + s.confidenceScores.negative, 0);
                    const totalNeutral = allSentences.reduce((sum, s) => sum + s.confidenceScores.neutral, 0);
                    
                    const avgPositive = totalPositive / allSentences.length;
                    const avgNegative = totalNegative / allSentences.length;
                    const avgNeutral = totalNeutral / allSentences.length;
                    
                    // Determine overall sentiment based on highest average
                    let rollingSentiment: 'positive' | 'negative' | 'neutral' | 'mixed' = 'neutral';
                    let rollingScore = avgNeutral;
                    
                    if (avgPositive > avgNegative && avgPositive > avgNeutral) {
                        rollingSentiment = 'positive';
                        rollingScore = avgPositive;
                    } else if (avgNegative > avgPositive && avgNegative > avgNeutral) {
                        rollingSentiment = 'negative';
                        rollingScore = avgNegative;
                    } else if (Math.abs(avgPositive - avgNegative) < 0.1) {
                        rollingSentiment = 'mixed';
                        rollingScore = (avgPositive + avgNegative) / 2;
                    }
                    
                    this.setState({ 
                        sentimentData: {
                            current: currentSentiment,
                            rolling: {
                                overall: {
                                    sentiment: rollingSentiment,
                                    score: rollingScore,
                                    confidenceScores: {
                                        positive: avgPositive,
                                        negative: avgNegative,
                                        neutral: avgNeutral
                                    }
                                },
                                allSentences
                            }
                        }
                    });
                } else {
                    // If no sentences, just update current sentiment
                    this.setState({ 
                        sentimentData: {
                            ...this.state.sentimentData,
                            current: currentSentiment
                        }
                    });
                }
            }
            
            // Auto-generate recommendations every 4 transcript events with full context
            // Use resultText to ensure we have the most current accumulated transcript
            if(this.state.transcriptEventCount % 4 === 0 && this.state.copilotChecked && resultText.length > 150){
                // Update state first to ensure generateInvestmentRecommendation has the latest transcript
                setTimeout(() => {
                    this.generateInvestmentRecommendation();
                }, 100); // Small delay to ensure state is updated
            }
            
            if(this.state.transcriptEventCount % 2 === 0 && this.state.copilotChecked){
                this.gptLiveGuidance();
            }            
          }
          else if (e.result.reason === ResultReason.NoMatch) {
              resultText += `\n`
          }
      };
      recognizer.startContinuousRecognitionAsync();
  }

  async stopRecording(){
      this.setState({ isProcessing: true });
      
      if (recognizer) {
          recognizer.stopContinuousRecognitionAsync();
      }
      
      this.setState({ 
          isRecording: false, 
          connectionStatus: 'disconnected',
          isProcessing: false 
      });
      
      if(this.state.copilotChecked){
          this.gptLiveGuidance();
          // Also generate final recommendation when recording stops
          this.generateInvestmentRecommendation();
      }
  }

  async agentAssistDebug(){              
    if(this.state.copilotChecked){      
        this.gptLiveGuidance();     
    }
  }

  async gptCustomPromptCompetion(){
    var customPromptText = (document.getElementById("customPromptTextarea") as HTMLTextAreaElement).value;
    var transcriptInputForPmt = this.state.displayText;
    const gptObj = await getGPTCustomPromptCompletion(transcriptInputForPmt, customPromptText);
    const gptText = gptObj.data.text;
    try{
        this.setState({ gptInsightsOutput: gptText.replace("\n\n", "") });
    }catch(error){
        this.setState({ gptInsightsOutput: gptObj.data });
    }
  }

  async gptLiveGuidance(){
    var conversationTemplate = this.state.conversationTemplate;    
    var transcriptText = this.state.displayText;
    const gptObj = await gptLiveGuidance(transcriptText, conversationTemplate);
    const gptText = gptObj.data.message.content;
    const regex = /Addressed Questions(.*?)Unaddressed Questions(.*)/s;
    var contentBetweenSections = '';
    var contentAfterSecondSection = '';   
    const match = gptText.match(regex);
    if (match) {
      contentBetweenSections = match[2].trim();
      contentAfterSecondSection = match[1].trim();      
    } else {
      contentBetweenSections = gptText;
      contentAfterSecondSection = gptText;  
    }

    try{
        this.setState({ agentGuidance: contentBetweenSections });
        this.setState({ taskCompleted: contentAfterSecondSection });
    }catch(error){
        this.setState({ agentGuidance: 'unknown error happened' });
    }
  }

  async generateInvestmentRecommendation() {
    // Prevent duplicate calls if already generating
    if (this.state.isGeneratingRecommendation) {
      return;
    }
    
    this.setState({ isGeneratingRecommendation: true });
    
    try {
      // Always use the full accumulated transcript for recommendations (unlike key phrases which use individual utterances)
      const transcriptText = this.state.displayText;
      
      console.log(`Generating recommendation with full transcript (${transcriptText.length} chars):`, transcriptText.substring(0, 200) + '...');
      
      // Enhanced validation for transcript content
      if (!transcriptText || transcriptText.length < 50) {
        this.setState({ 
          recommendation: '***Waiting for More Client Information***\n\nPlease ensure you have captured sufficient conversation content including client\'s financial goals, risk tolerance, investment timeline, and current financial situation before generating recommendations.',
          isGeneratingRecommendation: false 
        });
        return;
      }
      
      // Check for placeholder text
      if (transcriptText === 'Speak to your microphone or copy/paste conversation transcript here') {
        this.setState({ 
          recommendation: '🎤 **Start Your Conversation**\n\nPlease start recording your conversation or paste a conversation transcript to generate personalized investment recommendations.',
          isGeneratingRecommendation: false 
        });
        return;
      }
      
      // Validate transcript contains meaningful content (not just whitespace or special characters)
      const meaningfulContent = transcriptText.replace(/[\s\n\r\t]/g, '').length;
      if (meaningfulContent < 30) {
        this.setState({ 
          recommendation: '📝 **More Content Needed**\n\nThe current transcript appears to have limited content. Please ensure you have a substantial conversation about:\n\n• Financial goals and objectives\n• Investment timeline\n• Risk tolerance\n• Current financial situation\n\nThen try generating recommendations again.',
          isGeneratingRecommendation: false 
        });
        return;
      }

      const gptObj = await generateRecommendation(transcriptText);
      console.log('Recommendation response:', gptObj); // Debug log
      
      // Handle different response structures and errors
      let recommendationText = '';
      if (gptObj && gptObj.data) {
        // Check if it's an error response from backend
        if (gptObj.data.message && gptObj.data.message.content) {
          recommendationText = gptObj.data.message.content;
          
          // Check if the response contains an error message
          if (recommendationText.includes('Error generating recommendation:')) {
            recommendationText = '⚠️ **Service Temporarily Unavailable**\n\nThe investment recommendation service is currently experiencing issues. This could be due to:\n\n• Azure OpenAI API rate limits\n• Network connectivity issues\n• Service configuration problems\n\nPlease try again in a few moments, or continue with other features while we resolve this issue.';
          }
        } else if (gptObj.data.content) {
          recommendationText = gptObj.data.content;
        } else if (typeof gptObj.data === 'string') {
          // Handle string error messages from API
          if (gptObj.data.includes('Error occurred while generating investment recommendation:')) {
            recommendationText = '⚠️ **Recommendation Service Error**\n\nThere was an issue connecting to the investment recommendation service. Please check:\n\n• Internet connection\n• Try refreshing the page\n• Contact support if the issue persists\n\nYou can continue using other features while we resolve this.';
          } else {
            recommendationText = gptObj.data;
          }
        } else {
          recommendationText = '⚠️ **Unexpected Response Format**\n\nThe recommendation service returned an unexpected response format. Please try again or contact support if the issue persists.';
        }
      } else {
        recommendationText = '⚠️ **No Response Received**\n\nNo response was received from the recommendation service. Please check your internet connection and try again.';
      }
      
      this.setState({ 
        recommendation: recommendationText,
        isGeneratingRecommendation: false 
      });

      // Create alert for new recommendation (only if it's not an error or waiting message)
      if (!recommendationText.includes('Error') && 
          !recommendationText.includes('***Waiting for More Client Information***') &&
          !recommendationText.includes('Start Your Conversation') &&
          !recommendationText.includes('More Content Needed')) {
        
        // Determine priority based on content analysis
        let priority: 'low' | 'medium' | 'high' = 'medium';
        
        if (recommendationText.toLowerCase().includes('urgent') || 
            recommendationText.toLowerCase().includes('immediate') ||
            recommendationText.toLowerCase().includes('critical')) {
          priority = 'high';
        } else if (recommendationText.toLowerCase().includes('consider') ||
                   recommendationText.toLowerCase().includes('potential')) {
          priority = 'low';
        }

        // Create alert notification
        this.addRecommendationAlert(recommendationText, priority);
        
        // Auto-enable client workflow for successful recommendations
        if (!this.state.showClientWorkflow) {
          this.setState({ showClientWorkflow: true });
        }
      }
    } catch (error: any) {
      console.error('Error generating recommendation:', error);
      
      // Enhanced error handling with user-friendly messages
      let userFriendlyError = '';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        userFriendlyError = '🌐 **Connection Error**\n\nUnable to connect to the recommendation service. Please check your internet connection and try again.';
      } else if (error.message && error.message.includes('timeout')) {
        userFriendlyError = '⏱️ **Request Timeout**\n\nThe recommendation request is taking longer than expected. The service may be busy. Please try again in a moment.';
      } else if (error.message && error.message.includes('400')) {
        userFriendlyError = '📝 **Input Validation Error**\n\nThere may be an issue with the conversation transcript format. Please ensure you have a meaningful conversation recorded before generating recommendations.';
      } else if (error.message && error.message.includes('429')) {
        userFriendlyError = '🚦 **Service Busy**\n\nThe recommendation service is currently handling many requests. Please wait a few moments and try again.';
      } else if (error.message && error.message.includes('500')) {
        userFriendlyError = '⚙️ **Service Error**\n\nThe recommendation service is temporarily experiencing technical difficulties. Our team has been notified. Please try again later.';
      } else {
        userFriendlyError = `⚠️ **Recommendation Error**\n\nAn unexpected error occurred while generating recommendations.\n\n**Error Details:** ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try again or contact support if the issue persists.`;
      }
      
      this.setState({ 
        recommendation: userFriendlyError,
        isGeneratingRecommendation: false 
      });
    }
  }

  async getImageSasUrls(){    
    //var caseNumber = (document.getElementById("casenumbertextarea") as HTMLTextAreaElement).value;
    var caseNumber = this.state.caseNumber;
    const imageListObj = await getImageSasUrls(String(caseNumber));
    this.setState({imageList :imageListObj.data});
    const imageListWithGptvObj = await getGPTVInsights(imageListObj.data);
    this.setState({imageList :imageListWithGptvObj.data});
  }

  onThumbnailClick = (imageUrl: string, imageInsights: string) => {  
    this.setState({selectedImage: imageUrl});
    this.setState({gptvInsights: imageInsights  });
  }; 

  openSettingsPanel = () => { this.setState({ isSettingsPanelOpen: true }); }
  closeSettingsPanel = () => { this.setState({ isSettingsPanelOpen: false });  }
  onConversationTemplateChange = () => {
    var conversationTemplateText = (document.getElementById("conversationtemplatetextarea") as HTMLTextAreaElement).value;
    this.setState({conversationTemplate: conversationTemplateText})
  }

  onTranscriptTextareaChange = () => {
    var transcritionText = (document.getElementById("transcriptTextarea") as HTMLTextAreaElement).value;
    this.setState({displayText: transcritionText})
  }

  onClearAllTextarea = () => {
    this.setState({displayText: ''});
    this.setState({displayNLPOutput: ''});
    this.setState({displayKeyPhrases: ''});
    this.setState({displayPiiText: ''});
    this.setState({gptInsightsOutput: ''});    
    (document.getElementById("customPromptTextarea") as HTMLTextAreaElement).value= '';
    (document.getElementById("transcriptTextarea") as HTMLTextAreaElement).value= '';
  }

  render() {   
    return (
        <div className="app-container" style={{ paddingBottom: '80px' }}>
          {/* Modern Header */}
          <div className="modern-card bounce-in">
            <div className="modern-card-header compact-header" style={{ 
              padding: 'var(--spacing-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {/* Left side - Title and status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: 'var(--font-size-lg)',
                  lineHeight: 1.2
                }}>
                  {this.state.isRecording && (
                    <span style={{ 
                      display: 'inline-block', 
                      width: '10px', 
                      height: '10px', 
                      backgroundColor: '#ff4444', 
                      borderRadius: '50%', 
                      marginRight: '6px',
                      animation: 'pulse 1.5s infinite'
                    }}></span>
                  )}
                  🤖 AI Investment Agent - Conversation Copilot
                </h3>
                {this.state.isRecording && (
                  <span style={{
                    fontSize: 'var(--font-size-xs)',
                    color: '#ff4444',
                    fontWeight: 600,
                    animation: 'pulse 1.5s infinite'
                  }}>
                    LIVE
                  </span>
                )}
              </div>

              {/* Right side - All controls */}
              <div style={{ 
                display: 'flex', 
                gap: 'var(--spacing-sm)', 
                alignItems: 'center' 
              }}>
                {/* Recording Controls */}
                <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                  <ModernIconButton
                    icon={
                      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 1a3 3 0 0 0-3 3v3a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM6 4a2 2 0 1 1 4 0v3a2 2 0 1 1-4 0V4z"/>
                        <path d="M4 9.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H4.5a.5.5 0 0 1-.5-.5z"/>
                        <path d="M8 13.5a4.5 4.5 0 0 1-4.473-4H2.5a.5.5 0 0 1 0-1h1.027a4.5 4.5 0 0 1 8.946 0H13.5a.5.5 0 0 1 0 1h-1.027A4.5 4.5 0 0 1 8 13.5z"/>
                      </svg>
                    }
                    onClick={() => this.sttFromMic()}
                    title={this.state.isRecording ? 'Recording...' : 'Start Conversation'}
                    variant="primary"
                    disabled={this.state.isRecording}
                  />
                  
                  <ModernIconButton
                    icon={
                      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <rect x="5" y="6" width="6" height="4" rx="1"/>
                      </svg>
                    }
                    onClick={() => this.stopRecording()}
                    title="End Conversation"
                    variant="danger"
                    disabled={!this.state.isRecording}
                  />
                </div>

                {/* Separator */}
                <div style={{ 
                  width: '1px', 
                  height: '24px', 
                  backgroundColor: 'var(--border-color)', 
                  opacity: 0.5 
                }} />

                {/* App Controls */}
                <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                  <ModernIconButton
                    icon={
                      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
                      </svg>
                    }
                    onClick={this.openSettingsPanel}
                    title="Settings"
                    variant="secondary"
                  />
                  
                  <ModernIconButton
                    icon={<Delete24Regular />}
                    onClick={this.onClearAllTextarea}
                    title="Clear all text areas"
                    variant="secondary"
                  />

                  {/* Smart Notification System */}
                  <SmartNotificationHeader
                    newRecommendationCount={this.state.newRecommendationCount}
                    recommendationHistory={this.state.recommendationHistory}
                    onMarkAsRead={this.markRecommendationAsRead}
                    onMarkAllAsRead={this.markAllRecommendationsAsRead}
                    onViewRecommendation={this.viewRecommendation}
                  />

                  <ThemeToggle variant="inline" />
                </div>
              </div>
            </div>

            {/* Status description - moved below header */}
            <div style={{ 
              padding: '0 var(--spacing-md) var(--spacing-sm) var(--spacing-md)',
              textAlign: 'center'
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: 'var(--font-size-xs)', 
                opacity: 0.9,
                lineHeight: 1.3
              }}>
                {this.state.isRecording 
                  ? '🎤 Recording conversation - AI analysis in progress...' 
                  : 'Multimodal AI-powered conversation analysis and real-time guidance'
                }
              </p>
            </div>
          </div>

          {/* Modern Settings Panel */}
          <ModernSettingsPanel
            isOpen={this.state.isSettingsPanelOpen}
            onDismiss={this.closeSettingsPanel}
            spokenLanguage={this.state.spokenLanguage}
            onSpokenLanguageChange={this.handleSpokenLangDropdownChange}
            showTranscriptPanel={this.state.showTranscriptPanel}
            onTranscriptPanelToggle={this.handleTranscriptPanelToggleChange}
            showPromptPanel={this.state.showPromptPanel}
            onPromptPanelToggle={this.handlePromptPanelToggleChange}
            showPhotoPanel={this.state.showPhotoPanel}
            onPhotoPanelToggle={this.handlePhotoPanelToggleChange}
            showPIIRedactedTranscript={this.state.showPIIRedactedTranscript}
            onPIITranscriptToggle={this.handlePIITranscriptToggleChange}
            copilotChecked={this.state.copilotChecked}
            onCopilotToggle={this.handleToggleChange}
            conversationTemplate={this.state.conversationTemplate}
            onConversationTemplateChange={this.onConversationTemplateChange}
            // Enhanced features props
            showEnhancedFeatures={this.state.showEnhancedFeatures}
            onEnhancedFeaturesToggle={this.handleEnhancedFeaturesToggleChange}
            showIntelligenceDashboard={this.state.showIntelligenceDashboard}
            onIntelligenceDashboardToggle={this.handleIntelligenceDashboardToggleChange}
            showClientWorkflow={this.state.showClientWorkflow}
            onClientWorkflowToggle={this.handleClientWorkflowToggleChange}
          />

          {/* Live Guidance Section - Dynamic View Modes */}
          {this.state.copilotChecked && (
            <div>
              {/* Render the selected view */}
              {this.state.liveGuidanceViewMode === 'unified' && (
                <UnifiedLiveGuidancePanel
                  pendingTasks={this.state.agentGuidance}
                  completedTasks={this.state.taskCompleted}
                  isProcessing={this.state.isProcessing}
                  currentViewMode={this.state.liveGuidanceViewMode}
                  onViewModeChange={(mode) => this.setState({ liveGuidanceViewMode: mode })}
                />
              )}
              
              {this.state.liveGuidanceViewMode === 'progress' && (
                <ProgressLiveGuidancePanel
                  pendingTasks={this.state.agentGuidance}
                  completedTasks={this.state.taskCompleted}
                  isProcessing={this.state.isProcessing}
                  currentViewMode={this.state.liveGuidanceViewMode}
                  onViewModeChange={(mode) => this.setState({ liveGuidanceViewMode: mode })}
                />
              )}
              
              {this.state.liveGuidanceViewMode === 'kanban' && (
                <KanbanLiveGuidancePanel
                  pendingTasks={this.state.agentGuidance}
                  completedTasks={this.state.taskCompleted}
                  isProcessing={this.state.isProcessing}
                  currentViewMode={this.state.liveGuidanceViewMode}
                  onViewModeChange={(mode) => this.setState({ liveGuidanceViewMode: mode })}
                />
              )}
              
              {this.state.liveGuidanceViewMode === 'chat' && (
                <ChatLiveGuidancePanel
                  pendingTasks={this.state.agentGuidance}
                  completedTasks={this.state.taskCompleted}
                  isProcessing={this.state.isProcessing}
                  currentViewMode={this.state.liveGuidanceViewMode}
                  onViewModeChange={(mode) => this.setState({ liveGuidanceViewMode: mode })}
                />
              )}
            </div>
          )}

          {/* Transcript Section */}
          {this.state.showTranscriptPanel && (
            <div className="modern-grid modern-grid-2">
              <ModernPivotSection
                title="Conversation Transcripts"
                items={[
                  {
                    key: 'realtime',
                    headerText: 'Real-time Transcript',
                    content: (
                      <ModernTextArea
                        id="transcriptTextarea"
                        defaultValue={this.state.displayText}
                        onChange={() => this.onTranscriptTextareaChange()}
                        rows={10}
                      />
                    )
                  },
                  ...(this.state.showPIIRedactedTranscript ? [{
                    key: 'pii',
                    headerText: 'PII-redacted Transcript',
                    content: (
                      <ModernTextArea
                        id="piiTextarea"
                        defaultValue={this.state.displayPiiText}
                        rows={10}
                        readOnly
                      />
                    )
                  }] : [])
                ]}
              />
              
              {/* Combined Language AI Insights & Sentiment Analysis */}
              <CombinedInsightsPanel
                entitiesExtracted={this.state.displayNLPOutput}
                sentimentData={this.state.sentimentData}
              />
            </div>
          )}

          {/* Investment Intelligence Dashboard */}
          {this.state.showIntelligenceDashboard && (
            <InvestmentIntelligenceDashboard
              conversationText={this.state.displayText}
              sentimentData={this.state.sentimentData}
              transcriptEventCount={this.state.transcriptEventCount}
              recommendation={this.state.recommendation}
              onGenerateInsights={() => console.log('Generating market insights...')}
            />
          )}

          {/* Investment Recommendations Section */}
          {this.state.showEnhancedFeatures ? (
            <EnhancedRecommendationPanel
              recommendation={this.state.recommendation}
              isGenerating={this.state.isGeneratingRecommendation}
              onGenerateRecommendation={() => this.generateInvestmentRecommendation()}
              conversationTranscript={this.state.displayText}
              sentimentData={this.state.sentimentData}
              keyPhrases={this.state.displayKeyPhrases}
            />
          ) : (
            <RecommendationPanel
              recommendation={this.state.recommendation}
              isGenerating={this.state.isGeneratingRecommendation}
              onGenerateRecommendation={() => this.generateInvestmentRecommendation()}
            />
          )}

          {/* Client Engagement Workflow */}
          {this.state.showClientWorkflow && !this.state.recommendation.includes('***Waiting for More Client Information***') && !this.state.recommendation.includes('Error') && (
            <ClientEngagementWorkflow
              recommendation={this.state.recommendation}
              conversationText={this.state.displayText}
              sentimentData={this.state.sentimentData}
              clientName="Sarah Johnson"
              onScheduleMeeting={() => console.log('Scheduling meeting...')}
              onSendEmail={() => console.log('Sending email preview...')}
              onCreatePitch={() => console.log('Creating client pitch...')}
              onGenerateReport={() => console.log('Generating formal report...')}
            />
          )}

          {/* Custom Prompts Section */}
          {this.state.showPromptPanel && (
            <div className="modern-grid modern-grid-2">
              <ModernSection 
                title="Custom Business Insights"
                headerActions={
                  <ModernButton 
                    onClick={() => this.gptCustomPromptCompetion()}
                    variant="primary"
                    size="small"
                  >
                    Ask GPT
                  </ModernButton>
                }
              >
                <ModernTextArea
                  id="customPromptTextarea"
                  placeholder="Enter your custom prompt to extract business insights..."
                  rows={10}
                />
              </ModernSection>
              
              <ModernSection title="GPT Response">
                <ModernTextArea
                  id="gptResponseTextarea"
                  defaultValue={this.state.gptInsightsOutput}
                  rows={12}
                  readOnly
                />
              </ModernSection>
            </div>
          )}

          {/* Photo Analysis Section */}
          {this.state.showPhotoPanel && (
            <div className="modern-grid modern-grid-3">
              <ModernSection title="Photo Upload" className="col-span-1">
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <TextField
                    label="Case number:"
                    id="casenumbertextarea"
                    defaultValue={String(this.state.caseNumber)}
                    styles={{
                      fieldGroup: {
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-primary)'
                      },
                      field: {
                        color: 'var(--text-primary)'
                      }
                    }}
                  />
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--spacing-sm)', 
                  flexWrap: 'wrap' 
                }}>
                  <ModernButton
                    onClick={() => {
                      const url = `/upload/${this.state.caseNumber}`;
                      window.open(url, '_blank');
                    }}
                    variant="primary"
                    size="small"
                  >
                    Go to Photo Upload
                  </ModernButton>
                  
                  <ModernButton
                    onClick={() => this.getImageSasUrls()}
                    variant="secondary"
                    size="small"
                  >
                    Ask GPT-Vision
                  </ModernButton>
                </div>

                {/* Photo Gallery */}
                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                  <h4>Received Photos</h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                    gap: 'var(--spacing-sm)' 
                  }}>
                    {this.state.imageList.map((image, index) => (
                      <img
                        key={index}
                        src={image.sasUrl}
                        alt={image.name}
                        onClick={() => this.onThumbnailClick(image.sasUrl, image.imageInsights)}
                        style={{
                          width: '100%',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          border: '2px solid var(--border-primary)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.borderColor = 'var(--color-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.borderColor = 'var(--border-primary)';
                        }}
                      />
                    ))}
                  </div>
                </div>
              </ModernSection>
              
              <ModernSection title="Selected Image" className="col-span-1">
                {this.state.selectedImage && (
                  <img
                    src={this.state.selectedImage}
                    alt="Selected"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-primary)'
                    }}
                  />
                )}
              </ModernSection>
              
              <ModernSection title="GPT-Vision Analysis" className="col-span-1">
                <ModernTextArea
                  id="imageInsightsTextarea"
                  defaultValue={this.state.gptvInsights}
                  rows={12}
                  readOnly
                />
              </ModernSection>
            </div>
          )}
          
          <StatusBar 
            isRecording={this.state.isRecording}
            connectionStatus={this.state.connectionStatus}
            isProcessing={this.state.isProcessing}
            transcriptCount={this.state.transcriptEventCount}
          />
    </div>
    );
  }//end of render method
}//end of App class


