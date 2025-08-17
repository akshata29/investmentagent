import React, { useState } from 'react';
import { Dropdown, IDropdownOption, Toggle } from '@fluentui/react';
import { DashboardLayout } from './DashboardLayout';
import { TabletLayout } from './TabletLayout';
import { SidebarLayout } from './SidebarLayout';
import { FloatingPanelsLayout } from './FloatingPanelsLayout';
import { CommandCenterLayout } from './CommandCenterLayout';
import { SpotlightLayout } from './SpotlightLayout';
import { ContextualFlowLayout } from './ContextualFlowLayout';
import { FloatingPodsLayout } from './FloatingPodsLayout';
import { ModernButton } from './ModernButton';

interface MasterLayoutControllerProps {
  liveGuidanceComponent: React.ReactNode;
  sentimentComponent: React.ReactNode;
  transcriptComponent: React.ReactNode;
  recommendationComponent: React.ReactNode;
  isRecording: boolean;
  onLayoutChange?: (layout: string) => void;
  currentLayout?: string;
  showLayoutSelector?: boolean;
}

type LayoutType = 'dashboard' | 'tablet' | 'sidebar' | 'floating' | 'command' | 'spotlight' | 'contextual' | 'pods' | 'original';

const layoutOptions: IDropdownOption[] = [
  { 
    key: 'dashboard', 
    text: '📐 Dashboard Grid (Recommended)', 
    data: { 
      description: 'Professional 2x2 grid with focus modes',
      pros: ['No scrolling', 'Equal visibility', 'Professional look'],
      bestFor: 'Presentations, monitoring sessions'
    }
  },
  { 
    key: 'command', 
    text: '🎯 Command Center', 
    data: { 
      description: 'Trading floor style with compact components',
      pros: ['Space efficient', 'High information density', 'Professional'],
      bestFor: 'Fast-paced analysis, trading environments'
    }
  },
  { 
    key: 'spotlight', 
    text: '🔍 Spotlight Focus', 
    data: { 
      description: 'Focus-based with contextual peripherals',
      pros: ['Reduces cognitive load', 'Auto-switching', 'Clean interface'],
      bestFor: 'Deep analysis, presentation mode'
    }
  },
  { 
    key: 'contextual', 
    text: '🧠 Contextual Flow', 
    data: { 
      description: 'Smart adaptive layout based on context',
      pros: ['Intelligent prioritization', 'Dynamic adaptation', 'Context-aware'],
      bestFor: 'AI-driven workflows, adaptive interfaces'
    }
  },
  { 
    key: 'pods', 
    text: '🌊 Floating Pods', 
    data: { 
      description: 'Floating information bubbles',
      pros: ['Fully customizable', 'Magnetic zones', 'Minimizable'],
      bestFor: 'Creative workflows, multi-monitor setups'
    }
  },
  { 
    key: 'tablet', 
    text: '📱 Tablet View', 
    data: { 
      description: 'Tab-based interface with dual-pane option',
      pros: ['Clean interface', 'Mobile friendly', 'Auto-rotation'],
      bestFor: 'Touch devices, focus on one section'
    }
  },
  { 
    key: 'sidebar', 
    text: '📋 Sidebar Navigation', 
    data: { 
      description: 'Main content with collapsible sidebar',
      pros: ['Quick switching', 'Pinned previews', 'Space efficient'],
      bestFor: 'Workflow-based usage, multitasking'
    }
  },
  { 
    key: 'floating', 
    text: '🪟 Floating Panels', 
    data: { 
      description: 'Draggable, resizable floating windows',
      pros: ['Fully customizable', 'Multi-monitor support', 'Dynamic'],
      bestFor: 'Power users, custom arrangements'
    }
  },
  { 
    key: 'original', 
    text: '📜 Original Layout', 
    data: { 
      description: 'Current vertical scrolling layout',
      pros: ['Familiar', 'All content visible', 'Sequential'],
      bestFor: 'Detailed analysis, documentation'
    }
  }
];

export const MasterLayoutController: React.FC<MasterLayoutControllerProps> = ({
  liveGuidanceComponent,
  sentimentComponent,
  transcriptComponent,
  recommendationComponent,
  isRecording,
  onLayoutChange,
  currentLayout: externalCurrentLayout = 'dashboard',
  showLayoutSelector = true
}) => {
  const [internalCurrentLayout, setInternalCurrentLayout] = useState<LayoutType>('dashboard');
  const [showLayoutInfo, setShowLayoutInfo] = useState(false);
  const [autoSwitchLayout, setAutoSwitchLayout] = useState(false);
  
  // Use external layout control if provided, otherwise use internal state
  const currentLayout = showLayoutSelector ? internalCurrentLayout : (externalCurrentLayout as LayoutType);

  // Auto-switch layout based on screen size
  React.useEffect(() => {
    if (!autoSwitchLayout) return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width < 768) {
        setInternalCurrentLayout('tablet');
      } else if (width < 1024) {
        setInternalCurrentLayout('sidebar');
      } else if (width > 1400 && height > 900) {
        setInternalCurrentLayout('dashboard');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, [autoSwitchLayout]);

  const handleLayoutChange = (option: IDropdownOption | undefined) => {
    if (option) {
      const newLayout = option.key as LayoutType;
      setInternalCurrentLayout(newLayout);
      onLayoutChange?.(newLayout);
    }
  };

  const currentLayoutInfo = layoutOptions.find(opt => opt.key === currentLayout)?.data;

  const renderLayoutSelector = () => (
    <div style={{
      background: 'var(--bg-card)',
      padding: 'var(--spacing-md)',
      borderRadius: 'var(--radius-lg)',
      border: '2px solid var(--border-primary)',
      marginBottom: 'var(--spacing-md)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: showLayoutInfo ? 'var(--spacing-md)' : '0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <div style={{ minWidth: '200px' }}>
            <Dropdown
              label="Layout Mode"
              selectedKey={currentLayout}
              options={layoutOptions}
              onChange={(_, option) => handleLayoutChange(option)}
              styles={{
                dropdown: { minWidth: '280px' },
                title: { 
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)'
                }
              }}
            />
          </div>
          
          <Toggle
            label="Auto-adapt to screen size"
            checked={autoSwitchLayout}
            onChange={(_, checked) => setAutoSwitchLayout(!!checked)}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <ModernButton
            onClick={() => setShowLayoutInfo(!showLayoutInfo)}
            variant="secondary"
            size="small"
          >
            {showLayoutInfo ? 'Hide' : 'Show'} Layout Info
          </ModernButton>
          
          {isRecording && (
            <div style={{
              padding: '6px 12px',
              background: 'var(--accent-red)',
              color: 'white',
              borderRadius: '16px',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              animation: 'pulse 1.5s infinite'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                backgroundColor: 'white',
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }} />
              RECORDING ACTIVE
            </div>
          )}
        </div>
      </div>

      {/* Layout Information Panel */}
      {showLayoutInfo && currentLayoutInfo && (
        <div style={{
          background: 'var(--bg-secondary)',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-sm)'
          }}>
            <div>
              <h4 style={{ margin: '0 0 var(--spacing-xs) 0', color: 'var(--text-primary)' }}>
                Description
              </h4>
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                {currentLayoutInfo.description}
              </p>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 var(--spacing-xs) 0', color: 'var(--text-primary)' }}>
                Advantages
              </h4>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                {currentLayoutInfo.pros.map((pro: string, index: number) => (
                  <li key={index}>{pro}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 var(--spacing-xs) 0', color: 'var(--text-primary)' }}>
                Best For
              </h4>
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                {currentLayoutInfo.bestFor}
              </p>
            </div>
          </div>
          
          <div style={{
            padding: 'var(--spacing-sm)',
            background: 'var(--bg-info)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--text-primary)'
          }}>
            💡 <strong>Tip:</strong> Use Dashboard Grid for presentations, Tablet View for mobile, 
            Sidebar for workflow tasks, and Floating Panels for power users with multiple monitors.
          </div>
        </div>
      )}
    </div>
  );

  const renderCurrentLayout = () => {
    const commonProps = {
      liveGuidanceComponent,
      sentimentComponent,
      transcriptComponent,
      recommendationComponent,
      isRecording
    };

    switch (currentLayout) {
      case 'dashboard':
        return <DashboardLayout {...commonProps} />;
      case 'command':
        return <CommandCenterLayout {...commonProps} />;
      case 'spotlight':
        return <SpotlightLayout {...commonProps} />;
      case 'contextual':
        return <ContextualFlowLayout {...commonProps} />;
      case 'pods':
        return <FloatingPodsLayout {...commonProps} />;
      case 'tablet':
        return <TabletLayout {...commonProps} />;
      case 'sidebar':
        return <SidebarLayout {...commonProps} />;
      case 'floating':
        return <FloatingPanelsLayout {...commonProps} />;
      case 'original':
        return (
          <div style={{
            background: 'var(--bg-secondary)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--border-primary)',
            textAlign: 'center'
          }}>
            {/* <h3>📜 Original Layout Active</h3>
            <p>This will use your existing vertical scrolling layout structure.</p>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Switch to another layout mode to see the key components without scrolling.
            </p> */}
          </div>
        );
      default:
        return <DashboardLayout {...commonProps} />;
    }
  };

  return (
    <div className="master-layout-controller">
      {showLayoutSelector && renderLayoutSelector()}
      {currentLayout !== 'original' && renderCurrentLayout()}
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .master-layout-controller {
          width: 100%;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
};
