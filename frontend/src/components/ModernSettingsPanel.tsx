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
import { Checkmark24Regular } from '@fluentui/react-icons';
import { useTheme } from '../contexts/ThemeContext';
import { ModernButton } from './ModernButton';
import SpokenLanguageOptions from '../AppSettings';
import { ScenarioOptions, LayoutOptions } from '../AppSettings';

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
  // Layout control
  useDashboardLayout?: boolean;
  onDashboardLayoutToggle?: () => void;
  // New layout selection
  selectedLayout?: string;
  onLayoutChange?: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => void;
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
  onClientWorkflowToggle,
  // Layout control
  useDashboardLayout = true,
  onDashboardLayoutToggle,
  // New layout selection
  selectedLayout = 'original',
  onLayoutChange
}) => {
  const { isDark, theme } = useTheme();

  // CSS driven panel theming; no inline styles

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
  backgroundColor: isDark ? 'var(--text-inverse)' : 'var(--text-primary)',
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
        <div className="notification-panel-header">
          <Text variant="large" className="notification-header-title">
            ⚙️ Application Settings
          </Text>
          <button
            onClick={onDismiss}
            className={`notification-close-btn ${isDark ? 'dark' : 'light'}`}
            title="Close settings"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
      className="modern-panel notification-panel slide-in"
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

        {/* Layout Settings */}
        <div className="modern-section fade-in">
          <div className="modern-section-header">🎨 Layout & Interface</div>
          
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <Label styles={labelStyles}>Interface Layout Mode</Label>
            <Dropdown
              placeholder="Select Layout Mode"
              options={LayoutOptions()}
              selectedKey={selectedLayout}
              onChange={onLayoutChange}
              styles={dropdownStyles}
            />
            <div style={{ 
              marginTop: '8px', 
              fontSize: '11px', 
              color: 'var(--text-secondary)',
              lineHeight: '1.4'
            }}>
              💡 <strong>Tip:</strong> Choose "Dashboard Grid" or "Command Center" for no-scroll experience, 
              "Spotlight Focus" for presentations, or "Floating Pods" for maximum customization.
            </div>
          </div>

          <div className="toggle-group">
            <Toggle
              label="Enable Advanced Layout Features"
              checked={useDashboardLayout}
              onChange={onDashboardLayoutToggle}
              onText="Advanced Layouts"
              offText="Original Only"
              inlineLabel
              styles={toggleStyles}
            />
            <div style={{ 
              marginTop: '8px', 
              fontSize: '12px', 
              color: 'var(--text-secondary)',
              fontStyle: 'italic'
            }}>
              � Advanced layouts provide modern UI alternatives to the original vertical scroll design
            </div>
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
            className="settings-save-btn"
            icon={
              <Checkmark24Regular />
            }
          >
            Save & Close Settings
          </ModernButton>
        </div>
      </div>
    </Panel>
  );
};
