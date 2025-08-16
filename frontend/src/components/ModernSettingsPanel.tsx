import React from 'react';
import { 
  Panel, 
  PanelType, 
  Dropdown, 
  IDropdownOption, 
  TextField, 
  Label,
  Toggle,
  Text
} from '@fluentui/react';
import { useTheme } from '../contexts/ThemeContext';
import { ModernButton } from './ModernButton';
import SpokenLanguageOptions from '../AppSettings';
import { ScenarioOptions } from '../AppSettings';

interface ModernSettingsPanelProps {
  isOpen: boolean;
  onDismiss: () => void;
  spokenLanguage: string;
  onSpokenLanguageChange: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => void;
  showTranscriptPanel: boolean;
  onTranscriptPanelToggle: () => void;
  showPromptPanel: boolean;
  onPromptPanelToggle: () => void;
  showPhotoPanel: boolean;
  onPhotoPanelToggle: () => void;
  showPIIRedactedTranscript: boolean;
  onPIITranscriptToggle: () => void;
  copilotChecked: boolean;
  onCopilotToggle: () => void;
  conversationTemplate: string;
  onConversationTemplateChange: () => void;
  // Enhanced features
  showEnhancedFeatures?: boolean;
  onEnhancedFeaturesToggle?: () => void;
  showIntelligenceDashboard?: boolean;
  onIntelligenceDashboardToggle?: () => void;
  showClientWorkflow?: boolean;
  onClientWorkflowToggle?: () => void;
}

export const ModernSettingsPanel: React.FC<ModernSettingsPanelProps> = ({
  isOpen,
  onDismiss,
  spokenLanguage,
  onSpokenLanguageChange,
  showTranscriptPanel,
  onTranscriptPanelToggle,
  showPromptPanel,
  onPromptPanelToggle,
  showPhotoPanel,
  onPhotoPanelToggle,
  showPIIRedactedTranscript,
  onPIITranscriptToggle,
  copilotChecked,
  onCopilotToggle,
  conversationTemplate,
  onConversationTemplateChange,
  // Enhanced features
  showEnhancedFeatures = true,
  onEnhancedFeaturesToggle,
  showIntelligenceDashboard = true,
  onIntelligenceDashboardToggle,
  showClientWorkflow = false,
  onClientWorkflowToggle
}) => {
  const { isDark, theme } = useTheme();

  // Modern panel styles that work with themes
  const panelStyles = {
    main: {
      backgroundColor: 'var(--bg-panel)',
      color: 'var(--text-primary)',
    },
    content: {
      padding: 0, // We'll handle padding ourselves
      backgroundColor: 'var(--bg-panel)',
    },
    header: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--text-on-primary)',
      borderBottom: `2px solid var(--border-primary)`,
    },
    scrollableContent: {
      backgroundColor: 'var(--bg-panel)',
    }
  };

  // Modern component styles
  const dropdownStyles = {
    dropdown: { 
      backgroundColor: 'var(--bg-secondary)',
      border: `1px solid var(--border-primary)`,
    },
    title: {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      border: `1px solid var(--border-primary)`,
      borderRadius: 'var(--radius-md)',
    },
    caretDown: {
      color: 'var(--text-secondary)',
    },
    dropdownItem: {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
    },
    dropdownItemSelected: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--text-on-primary)',
    }
  };

  const textFieldStyles = {
    fieldGroup: {
      backgroundColor: 'var(--bg-secondary)',
      border: `1px solid var(--border-primary)`,
      borderRadius: 'var(--radius-md)',
    },
    field: {
      color: 'var(--text-primary)',
      backgroundColor: 'var(--bg-secondary)',
    }
  };

  const toggleStyles = {
    root: {
      marginBottom: 'var(--spacing-sm)',
    },
    label: {
      color: 'var(--text-primary)',
      fontSize: 'var(--font-size-base)',
    },
    thumb: {
      backgroundColor: isDark ? '#ffffff' : '#000000',
    }
  };

  const labelStyles = {
    root: {
      color: 'var(--text-primary)',
      fontSize: 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-medium)',
      marginBottom: 'var(--spacing-xs)',
    }
  };

  return (
    <Panel
      isOpen={isOpen}
      isBlocking={false}
      onDismiss={onDismiss}
      type={PanelType.medium}
      hasCloseButton={false}
      onRenderHeader={() => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          backgroundColor: 'var(--color-primary)',
          color: 'var(--text-on-primary)',
          borderBottom: '2px solid var(--border-primary)',
          minHeight: '60px'
        }}>
          <Text variant="large" style={{ 
            color: 'var(--text-on-primary)', 
            fontWeight: '600',
            fontSize: 'var(--font-size-lg)'
          }}>
            ⚙️ Application Settings
          </Text>
          <button
            onClick={onDismiss}
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.9)',
              border: isDark ? '2px solid #ffffff' : '2px solid #333333',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: isDark ? '#ffffff' : '#000000',
              boxShadow: isDark ? '0 2px 8px rgba(255,255,255,0.2)' : '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (isDark) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.borderColor = '#ffffff';
              } else {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#333333';
              }
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              if (isDark) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = '#ffffff';
              } else {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.borderColor = '#333333';
              }
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Close settings"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
      styles={panelStyles}
      className="modern-panel slide-in"
    >
      <div className="settings-panel-content">
        
        {/* Theme Section */}
        <div className="modern-section">
          <div className="modern-section-header">🎨 Appearance</div>
          <div className="theme-mode-display">
            <div>
              <Label styles={labelStyles}>Theme Mode</Label>
              <div style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--text-secondary)',
                marginTop: '2px'
              }}>
                Current: {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </div>
            </div>
            <div>
              <span style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--text-secondary)',
                marginRight: 'var(--spacing-sm)'
              }}>
                Toggle in top-right corner
              </span>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="modern-section">
          <div className="modern-section-header">🌐 Language & Scenario</div>
          
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <Label styles={labelStyles}>Spoken Language for Conversation</Label>
            <Dropdown
              placeholder="Select Language"
              options={SpokenLanguageOptions()}
              selectedKey={spokenLanguage}
              onChange={onSpokenLanguageChange}
              styles={dropdownStyles}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <Label styles={labelStyles}>Conversation Scenario</Label>
            <Dropdown
              placeholder="Select Conversation Scenario"
              options={ScenarioOptions()}
              styles={dropdownStyles}
            />
          </div>
        </div>

        {/* Feature Visibility Settings */}
        <div className="modern-section">
          <div className="modern-section-header">👁️ AI Features Display</div>
          
          <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
            <Toggle
              label="Live Transcription"
              checked={showTranscriptPanel}
              onChange={onTranscriptPanelToggle}
              onText="Shown"
              offText="Hidden"
              inlineLabel
              styles={toggleStyles}
            />

            <Toggle
              label="PII-Redacted Transcript"
              checked={showPIIRedactedTranscript}
              onChange={onPIITranscriptToggle}
              onText="Shown"
              offText="Hidden"
              inlineLabel
              styles={toggleStyles}
            />

            <Toggle
              label="Custom Prompts"
              checked={showPromptPanel}
              onChange={onPromptPanelToggle}
              onText="Shown"
              offText="Hidden"
              inlineLabel
              styles={toggleStyles}
            />

            <Toggle
              label="GPT-Vision"
              checked={showPhotoPanel}
              onChange={onPhotoPanelToggle}
              onText="Shown"
              offText="Hidden"
              inlineLabel
              styles={toggleStyles}
            />

            <Toggle
              label="Live Guidance"
              checked={copilotChecked}
              onChange={onCopilotToggle}
              onText="Enabled"
              offText="Disabled"
              inlineLabel
              styles={toggleStyles}
            />
          </div>
        </div>

        {/* Enhanced Investment Features */}
        <div className="modern-section fade-in">
          <div className="modern-section-header">💼 Enhanced Investment Features</div>
          <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
            <Toggle
              label="Enhanced Recommendation Panel"
              checked={showEnhancedFeatures}
              onChange={onEnhancedFeaturesToggle}
              onText="Enhanced UI"
              offText="Standard UI"
              inlineLabel
              styles={toggleStyles}
            />

            <Toggle
              label="Investment Intelligence Dashboard"
              checked={showIntelligenceDashboard}
              onChange={onIntelligenceDashboardToggle}
              onText="Shown"
              offText="Hidden"
              inlineLabel
              styles={toggleStyles}
            />

            <Toggle
              label="Client Engagement Workflow"
              checked={showClientWorkflow}
              onChange={onClientWorkflowToggle}
              onText="Enabled"
              offText="Disabled"
              inlineLabel
              styles={toggleStyles}
            />
          </div>
        </div>

        {/* Live Guidance Settings */}
        {copilotChecked && (
          <div className="modern-section fade-in">
            <div className="modern-section-header">🤖 Live Guidance Configuration</div>
            <TextField
              label="Enter task/question list for Live Guidance"
              multiline
              autoAdjustHeight
              rows={6}
              id="conversationtemplatetextarea"
              defaultValue={conversationTemplate}
              onChange={onConversationTemplateChange}
              styles={textFieldStyles}
              placeholder="Enter prompts and questions for AI guidance..."
            />
          </div>
        )}

        {/* Resources */}
        <div className="modern-section">
          <div className="modern-section-header">📚 Resources & Help</div>
          <div className="resources-content">
            <Label styles={labelStyles}>
              📹 Demo delivery instruction video & resources are{' '}
              <a 
                href="https://conversationcopilotdemo.z14.web.core.windows.net/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                  fontWeight: 'var(--font-weight-semibold)'
                }}
              >
                available here
              </a>
            </Label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-action-buttons">
          <ModernButton
            onClick={onDismiss}
            variant="primary"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
              </svg>
            }
          >
            Save & Close Settings
          </ModernButton>
        </div>
      </div>
    </Panel>
  );
};
