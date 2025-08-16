import React, { useState } from 'react';
import { Text, PrimaryButton, DefaultButton, Separator } from '@fluentui/react';
import { ModernButton } from './ModernButton';
import { 
  PersonFeedback24Regular,
  Calendar24Regular,
  Mail24Regular,
  Phone24Regular,
  DocumentText24Regular,
  Share24Regular,
  Target24Regular,
  CheckmarkCircle24Regular,
  People24Regular,
  Clock24Regular,
  DocumentPdf24Regular,
  ArrowRight24Regular,
  StarAdd24Regular,
  TaskListLtr24Regular
} from '@fluentui/react-icons';
import { generateClientPitch as buildPitchFromUtils } from '../utils/client_pitch';
import { generateClientPitchAPI } from '../api/backend_api_orchestrator';
import { markdownToHtml, exportHtmlToPdf } from '../utils/markdown';

interface ClientWorkflowProps {
  recommendation: string;
  conversationText: string;
  sentimentData: any;
  clientName?: string;
  onScheduleMeeting?: () => void;
  onSendEmail?: () => void;
  onCreatePitch?: () => void;
  onGenerateReport?: () => void;
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  status: 'pending' | 'in-progress' | 'completed' | 'optional';
  estimatedTime: string;
  action: () => void;
  priority: 'high' | 'medium' | 'low';
}

export const ClientEngagementWorkflow: React.FC<ClientWorkflowProps> = ({
  recommendation,
  conversationText,
  sentimentData,
  clientName = "Client",
  onScheduleMeeting,
  onSendEmail,
  onCreatePitch,
  onGenerateReport
}) => {
  const [activeStep, setActiveStep] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState<string>('');
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);

  const markStepCompleted = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    setActiveStep('');
  };

  // Simple client detail extraction from transcript (fallback heuristics)
  const extractClientDetails = (text: string) => {
    const t = text || '';
    const email = t.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
    const phone = t.match(/(?:\+?\d{1,2}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?){2}\d{4}\b/)?.[0];
    const location = t.match(/\b(?:from|in)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/)?.[1];
    return { email, phone, location };
  };

  // Generate real client pitch based on conversation and recommendations
  const generateClientPitch = async (): Promise<string> => {
    try {
      setIsGeneratingPitch(true);
      const apiRes = await generateClientPitchAPI(conversationText || '', recommendation || '', sentimentData);
      const apiPitch = apiRes?.data?.message?.content;
      if (apiPitch && typeof apiPitch === 'string' && apiPitch.trim().length > 0) {
        return apiPitch;
      }
    } catch (e) {
      console.error('Backend pitch generation failed, falling back to local:', e);
    } finally {
      setIsGeneratingPitch(false);
    }
    return buildPitchFromUtils({ conversationText, recommendation, sentimentData, clientName });
  };

  const getWorkflowSteps = (): WorkflowStep[] => [
    {
      id: 'review-recommendation',
      title: 'Review Recommendation',
      description: 'Analyze AI-generated recommendation for accuracy and completeness',
      icon: <DocumentText24Regular />,
      status: 'pending',
      estimatedTime: '5 min',
      action: () => {
        setActiveStep('review-recommendation');
        // Auto-complete after a moment to simulate review
        setTimeout(() => markStepCompleted('review-recommendation'), 2000);
      },
      priority: 'high'
    },
    {
      id: 'prepare-pitch',
      title: 'Prepare Client Pitch',
      description: 'Create professional presentation materials and talking points',
      icon: <PersonFeedback24Regular />,
      status: 'pending',
      estimatedTime: '10 min',
      action: async () => {
        const pitch = await generateClientPitch();
        setGeneratedPitch(pitch);
        setShowPitchModal(true);
        if (onCreatePitch) onCreatePitch();
        setActiveStep('prepare-pitch');
        setTimeout(() => markStepCompleted('prepare-pitch'), 3000);
      },
      priority: 'high'
    },
    {
      id: 'schedule-meeting',
      title: 'Schedule Client Meeting',
      description: 'Book calendar appointment to discuss recommendations',
      icon: <Calendar24Regular />,
      status: 'pending',
      estimatedTime: '3 min',
      action: () => {
        if (onScheduleMeeting) onScheduleMeeting();
        setActiveStep('schedule-meeting');
        setTimeout(() => markStepCompleted('schedule-meeting'), 1500);
      },
      priority: 'high'
    },
    {
      id: 'send-preview',
      title: 'Send Preview to Client',
      description: 'Email summary of recommendations for client review',
      icon: <Mail24Regular />,
      status: 'pending',
      estimatedTime: '5 min',
      action: () => {
        if (onSendEmail) onSendEmail();
        setActiveStep('send-preview');
        setTimeout(() => markStepCompleted('send-preview'), 2500);
      },
      priority: 'medium'
    },
    {
      id: 'generate-report',
      title: 'Generate Formal Report',
      description: 'Create detailed investment proposal document',
      icon: <DocumentPdf24Regular />,
      status: 'optional',
      estimatedTime: '8 min',
      action: () => {
        if (onGenerateReport) onGenerateReport();
        setActiveStep('generate-report');
        setTimeout(() => markStepCompleted('generate-report'), 4000);
      },
      priority: 'low'
    },
    {
      id: 'follow-up',
      title: 'Set Follow-up Reminder',
      description: 'Schedule post-meeting follow-up task',
      icon: <Clock24Regular />,
      status: 'optional',
      estimatedTime: '2 min',
      action: () => {
        setActiveStep('follow-up');
        setTimeout(() => markStepCompleted('follow-up'), 1000);
      },
      priority: 'low'
    }
  ];

  const steps = getWorkflowSteps();
  const completedCount = completedSteps.size;
  const totalSteps = steps.filter(s => s.status !== 'optional').length;
  const progressPercentage = (completedCount / steps.length) * 100;

  const getStepStatus = (step: WorkflowStep): 'pending' | 'in-progress' | 'completed' => {
    if (completedSteps.has(step.id)) return 'completed';
    if (activeStep === step.id) return 'in-progress';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckmarkCircle24Regular style={{ color: 'var(--accent-green)' }} />;
      case 'in-progress':
        return <div className="spinner-small" />;
      default:
        return <div className="step-number" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--accent-red)';
      case 'medium': return 'var(--accent-orange)';
      case 'low': return 'var(--accent-blue)';
      default: return 'var(--text-secondary)';
    }
  };

  const canExecuteStep = (step: WorkflowStep) => {
    // Some basic workflow logic
    if (step.id === 'prepare-pitch' && !completedSteps.has('review-recommendation')) {
      return false;
    }
    if (step.id === 'send-preview' && !completedSteps.has('prepare-pitch')) {
      return false;
    }
    return true;
  };

  const executeAllHighPriority = () => {
    const highPrioritySteps = steps.filter(s => s.priority === 'high' && !completedSteps.has(s.id));
    highPrioritySteps.forEach((step, index) => {
      setTimeout(() => {
        step.action();
      }, index * 1000);
    });
  };

  return (
    <div className="client-engagement-workflow">
      <style>{`
        .client-engagement-workflow {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          border: 1px solid var(--border-color);
          margin-bottom: var(--spacing-lg);
        }

        .workflow-header {
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

        .workflow-title {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .workflow-subtitle {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin: 0;
          margin-top: 2px;
        }

        .progress-section {
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          border: 1px solid var(--border-primary);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }

        .progress-title {
          font-size: var(--font-size-md);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .progress-stats {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: var(--spacing-sm);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-blue), var(--accent-green));
          transition: width 0.5s ease;
          border-radius: 4px;
        }

        .quick-actions {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
          flex-wrap: wrap;
        }

        .steps-container {
          display: grid;
          gap: var(--spacing-md);
        }

        .workflow-step {
          background: var(--bg-primary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .workflow-step.completed {
          border-color: var(--accent-green);
          background: var(--bg-success);
        }

        .workflow-step.in-progress {
          border-color: var(--accent-blue);
          background: var(--bg-info);
          box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.2);
        }

        .workflow-step.disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        .workflow-step:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-sm);
        }

        .step-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          flex: 1;
        }

        .step-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
        }

        .step-details {
          flex: 1;
        }

        .step-title {
          font-size: var(--font-size-md);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .step-description {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin: 4px 0 0 0;
          line-height: 1.4;
        }

        .step-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: var(--spacing-xs);
        }

        .step-time {
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
          background: var(--bg-tertiary);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }

        .priority-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .step-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--border-primary);
        }

        .step-status {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .status-completed {
          color: var(--accent-green);
          font-weight: 600;
        }

        .status-in-progress {
          color: var(--accent-blue);
          font-weight: 600;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid var(--bg-tertiary);
          border-top: 2px solid var(--accent-blue);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .step-number {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-primary);
        }

        .optional-steps {
          margin-top: var(--spacing-lg);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--border-primary);
        }

        .optional-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .optional-title {
          font-size: var(--font-size-md);
          font-weight: 600;
          color: var(--text-secondary);
          margin: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .workflow-header {
            flex-direction: column;
            gap: var(--spacing-md);
            align-items: stretch;
          }

          .quick-actions {
            flex-direction: column;
          }

          .step-header {
            flex-direction: column;
            gap: var(--spacing-sm);
            align-items: stretch;
          }

          .step-meta {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .step-actions {
            flex-direction: column;
            gap: var(--spacing-sm);
            align-items: stretch;
          }
        }
      `}</style>

      <div className="workflow-header">
        <div className="header-left">
          <TaskListLtr24Regular style={{ color: 'var(--accent-blue)', fontSize: '24px' }} />
          <div>
            <h2 className="workflow-title">Client Engagement Workflow</h2>
            <p className="workflow-subtitle">Streamlined process for {clientName} recommendation delivery</p>
          </div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <h3 className="progress-title">Workflow Progress</h3>
          <span className="progress-stats">
            {completedCount} of {steps.length} steps completed
          </span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="quick-actions">
          <ModernButton
            variant="primary"
            size="small"
            onClick={executeAllHighPriority}
            icon={<ArrowRight24Regular />}
            disabled={steps.filter(s => s.priority === 'high').every(s => completedSteps.has(s.id))}
          >
            Execute All Priority Steps
          </ModernButton>
          
          <ModernButton
            variant="secondary"
            size="small"
            onClick={() => setShowAdvanced(!showAdvanced)}
            icon={<StarAdd24Regular />}
          >
            {showAdvanced ? 'Hide' : 'Show'} Optional Steps
          </ModernButton>
        </div>
      </div>

      <div className="steps-container">
        {steps
          .filter(step => step.status !== 'optional' || showAdvanced)
          .map((step, index) => {
            const status = getStepStatus(step);
            const canExecute = canExecuteStep(step);
            
            return (
              <div 
                key={step.id} 
                className={`workflow-step ${status} ${!canExecute ? 'disabled' : ''}`}
              >
                <div className="step-header">
                  <div className="step-info">
                    <div className="step-icon">
                      {status === 'completed' ? (
                        <CheckmarkCircle24Regular style={{ color: 'var(--accent-green)' }} />
                      ) : status === 'in-progress' ? (
                        <div className="spinner-small" />
                      ) : (
                        React.cloneElement(step.icon, { 
                          style: { color: canExecute ? 'var(--accent-blue)' : 'var(--text-secondary)' }
                        })
                      )}
                    </div>
                    
                    <div className="step-details">
                      <h4 className="step-title">{step.title}</h4>
                      <p className="step-description">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="step-meta">
                    <span className="step-time">{step.estimatedTime}</span>
                    <div 
                      className="priority-indicator"
                      style={{ backgroundColor: getPriorityColor(step.priority) }}
                    />
                  </div>
                </div>
                
                <div className="step-actions">
                  <div className="step-status">
                    {getStatusIcon(status)}
                    <span className={`status-${status}`}>
                      {status === 'completed' ? 'Completed' : 
                       status === 'in-progress' ? 'In Progress...' : 
                       canExecute ? 'Ready' : 'Waiting for prerequisites'}
                    </span>
                  </div>
                  
          {status === 'pending' && canExecute && (
                    <ModernButton
                      variant="primary"
                      size="small"
            onClick={step.action}
            loading={step.id === 'prepare-pitch' && isGeneratingPitch}
                      icon={<ArrowRight24Regular />}
                    >
            {step.id === 'prepare-pitch' && isGeneratingPitch ? 'Preparing Pitch...' : 'Start Step'}
                    </ModernButton>
                  )}
                  
                  {status === 'completed' && (
                    <ModernButton
                      variant="secondary"
                      size="small"
                      onClick={() => {
                        const newCompleted = new Set(completedSteps);
                        newCompleted.delete(step.id);
                        setCompletedSteps(newCompleted);
                      }}
                    >
                      Redo Step
                    </ModernButton>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Pitch Modal */}
      {showPitchModal && (
        <div className="pitch-modal-overlay" onClick={() => setShowPitchModal(false)}>
          <div className="pitch-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pitch-modal-header">
              <h3>Generated Client Pitch</h3>
              <div className="pitch-modal-actions">
                <ModernButton
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    const blob = new Blob([generatedPitch], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `investment-pitch-${clientName}-${new Date().toISOString().split('T')[0]}.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  icon={<DocumentPdf24Regular />}
                >
                  Export Markdown
                </ModernButton>
                <ModernButton
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    const html = markdownToHtml(generatedPitch);
                    exportHtmlToPdf(html, `Investment Pitch - ${clientName}`);
                  }}
                  icon={<DocumentPdf24Regular />}
                >
                  Export PDF
                </ModernButton>
                <ModernButton
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPitch);
                    // You could add a toast notification here
                  }}
                  icon={<Share24Regular />}
                >
                  Copy
                </ModernButton>
                <button 
                  className="close-modal-btn"
                  onClick={() => setShowPitchModal(false)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="pitch-modal-content">
              <pre className="pitch-content">{generatedPitch}</pre>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .pitch-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-lg);
        }

        .pitch-modal {
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 900px;
          max-height: 80vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          border: 2px solid var(--accent-blue);
        }

        .pitch-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg);
          border-bottom: 2px solid var(--border-primary);
          background: var(--bg-secondary);
        }

        .pitch-modal-header h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: var(--font-size-lg);
          font-weight: 600;
        }

        .pitch-modal-actions {
          display: flex;
          gap: var(--spacing-sm);
          align-items: center;
        }

        .close-modal-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--text-secondary);
          padding: 4px;
          margin-left: var(--spacing-sm);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-modal-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .pitch-modal-content {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-lg);
        }

        .pitch-content {
          white-space: pre-wrap;
          font-family: 'Segoe UI', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-primary);
          margin: 0;
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-primary);
        }
      `}</style>
    </div>
  );
};
