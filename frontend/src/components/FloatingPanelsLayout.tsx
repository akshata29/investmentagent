import React, { useState, useEffect } from 'react';
import { Toggle } from '@fluentui/react';
import { ModernIconButton } from './ModernButton';

interface FloatingPanelsLayoutProps {
  liveGuidanceComponent: React.ReactNode;
  sentimentComponent: React.ReactNode;
  transcriptComponent: React.ReactNode;
  recommendationComponent: React.ReactNode;
  isRecording: boolean;
}

interface PanelPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
}

interface Panel {
  key: string;
  title: string;
  icon: string;
  component: React.ReactNode;
  color: string;
  isLive: boolean;
  position: PanelPosition;
}

export const FloatingPanelsLayout: React.FC<FloatingPanelsLayoutProps> = ({
  liveGuidanceComponent,
  sentimentComponent,
  transcriptComponent,
  recommendationComponent,
  isRecording
}) => {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    draggedPanel: string | null;
    offset: { x: number; y: number };
  }>({
    isDragging: false,
    draggedPanel: null,
    offset: { x: 0, y: 0 }
  });
  const [layoutMode, setLayoutMode] = useState<'free' | 'grid' | 'cascade'>('grid');
  const [maxZIndex, setMaxZIndex] = useState(1000);

  // Initialize panels with default positions
  useEffect(() => {
    const containerWidth = window.innerWidth - 40; // Account for margins
    const containerHeight = window.innerHeight - 200; // Account for header
    const panelWidth = Math.min(400, containerWidth / 2 - 10);
    const panelHeight = Math.min(300, containerHeight / 2 - 10);

    const initialPanels: Panel[] = [
      {
        key: 'transcript',
        title: 'Real-Time Transcript',
        icon: '📝',
        component: transcriptComponent,
        color: '#0066cc',
        isLive: isRecording,
        position: { x: 20, y: 20, width: panelWidth, height: panelHeight, zIndex: 1001, minimized: false }
      },
      {
        key: 'guidance',
        title: 'Live Guidance',
        icon: '🤖',
        component: liveGuidanceComponent,
        color: '#10b981',
        isLive: isRecording,
        position: { x: panelWidth + 30, y: 20, width: panelWidth, height: panelHeight, zIndex: 1002, minimized: false }
      },
      {
        key: 'sentiment',
        title: 'Sentiment Analysis',
        icon: '📊',
        component: sentimentComponent,
        color: '#f59e0b',
        isLive: false,
        position: { x: 20, y: panelHeight + 30, width: panelWidth, height: panelHeight, zIndex: 1003, minimized: false }
      },
      {
        key: 'recommendation',
        title: 'Investment Recommendations',
        icon: '💡',
        component: recommendationComponent,
        color: '#8b5cf6',
        isLive: false,
        position: { x: panelWidth + 30, y: panelHeight + 30, width: panelWidth, height: panelHeight, zIndex: 1004, minimized: false }
      }
    ];

    setPanels(initialPanels);
  }, [transcriptComponent, liveGuidanceComponent, sentimentComponent, recommendationComponent, isRecording]);

  const handleMouseDown = (e: React.MouseEvent, panelKey: string) => {
    const panel = panels.find(p => p.key === panelKey);
    if (!panel) return;

    // Bring panel to front
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    
    setPanels(prev => prev.map(p => 
      p.key === panelKey 
        ? { ...p, position: { ...p.position, zIndex: newZIndex } }
        : p
    ));

    setDragState({
      isDragging: true,
      draggedPanel: panelKey,
      offset: {
        x: e.clientX - panel.position.x,
        y: e.clientY - panel.position.y
      }
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.draggedPanel) return;

      const newX = e.clientX - dragState.offset.x;
      const newY = e.clientY - dragState.offset.y;

      setPanels(prev => prev.map(panel => 
        panel.key === dragState.draggedPanel
          ? { 
              ...panel, 
              position: { 
                ...panel.position, 
                x: Math.max(0, Math.min(newX, window.innerWidth - panel.position.width - 20)),
                y: Math.max(0, Math.min(newY, window.innerHeight - panel.position.height - 100))
              }
            }
          : panel
      ));
    };

    const handleMouseUp = () => {
      setDragState({ isDragging: false, draggedPanel: null, offset: { x: 0, y: 0 } });
    };

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState]);

  const toggleMinimize = (panelKey: string) => {
    setPanels(prev => prev.map(panel =>
      panel.key === panelKey
        ? { ...panel, position: { ...panel.position, minimized: !panel.position.minimized } }
        : panel
    ));
  };

  const resetLayout = () => {
    const containerWidth = window.innerWidth - 40;
    const containerHeight = window.innerHeight - 200;
    const panelWidth = Math.min(400, containerWidth / 2 - 10);
    const panelHeight = Math.min(300, containerHeight / 2 - 10);

    if (layoutMode === 'grid') {
      setPanels(prev => prev.map((panel, index) => ({
        ...panel,
        position: {
          ...panel.position,
          x: (index % 2) * (panelWidth + 10) + 20,
          y: Math.floor(index / 2) * (panelHeight + 10) + 20,
          width: panelWidth,
          height: panelHeight,
          minimized: false
        }
      })));
    } else if (layoutMode === 'cascade') {
      setPanels(prev => prev.map((panel, index) => ({
        ...panel,
        position: {
          ...panel.position,
          x: 20 + index * 30,
          y: 20 + index * 30,
          width: panelWidth,
          height: panelHeight,
          minimized: false
        }
      })));
    }
  };

  const renderPanel = (panel: Panel) => (
    <div
      key={panel.key}
      style={{
        position: 'absolute',
        left: panel.position.x,
        top: panel.position.y,
        width: panel.position.width,
        height: panel.position.minimized ? '40px' : panel.position.height,
        zIndex: panel.position.zIndex,
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--border-primary)',
        boxShadow: dragState.draggedPanel === panel.key ? 'var(--shadow-2xl)' : 'var(--shadow-lg)',
        transition: dragState.draggedPanel === panel.key ? 'none' : 'all 0.3s ease',
        cursor: dragState.isDragging ? 'grabbing' : 'default',
        overflow: 'hidden'
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          padding: 'var(--spacing-sm)',
          background: panel.color,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'grab',
          userSelect: 'none'
        }}
        onMouseDown={(e) => handleMouseDown(e, panel.key)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span style={{ fontSize: 'var(--font-size-md)' }}>{panel.icon}</span>
          <h4 style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>{panel.title}</h4>
          {panel.isLive && (
            <span style={{
              padding: '2px 6px',
              background: 'rgba(255, 68, 68, 0.9)',
              borderRadius: '8px',
              fontSize: '10px',
              fontWeight: 600,
              animation: 'pulse 1.5s infinite'
            }}>
              LIVE
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
          <button
            onClick={() => toggleMinimize(panel.key)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {panel.position.minimized ? '⬆' : '⬇'}
          </button>
        </div>
      </div>

      {/* Panel Content */}
      {!panel.position.minimized && (
        <div style={{
          height: 'calc(100% - 40px)',
          overflow: 'auto',
          padding: 'var(--spacing-sm)',
          background: 'var(--bg-secondary)'
        }}>
          {panel.component}
        </div>
      )}
    </div>
  );

  return (
    <div className="floating-panels-layout" style={{ position: 'relative', height: '100vh' }}>
      {/* Controls */}
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xs)',
        background: 'var(--bg-card)',
        padding: 'var(--spacing-sm)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
          Layout Control
        </div>
        
        <select
          value={layoutMode}
          onChange={(e) => setLayoutMode(e.target.value as any)}
          style={{
            padding: '4px',
            borderRadius: '4px',
            border: '1px solid var(--border-primary)',
            fontSize: '12px'
          }}
        >
          <option value="free">Free Form</option>
          <option value="grid">Grid Layout</option>
          <option value="cascade">Cascade</option>
        </select>
        
        <ModernIconButton
          icon="🔄"
          onClick={resetLayout}
          title="Reset Layout"
          variant="secondary"
          size="small"
        />
      </div>

      {/* Floating Panels */}
      {panels.map(renderPanel)}

      {/* Minimized Panels Dock */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 'var(--spacing-xs)',
        background: 'var(--bg-card)',
        padding: 'var(--spacing-sm)',
        borderRadius: '24px',
        border: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 1999
      }}>
        {panels.filter(p => p.position.minimized).map(panel => (
          <button
            key={`dock-${panel.key}`}
            onClick={() => toggleMinimize(panel.key)}
            style={{
              padding: 'var(--spacing-sm)',
              background: panel.color,
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.3s ease'
            }}
            title={panel.title}
          >
            <span>{panel.icon}</span>
            {panel.isLive && (
              <span style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#ff4444',
                borderRadius: '50%',
                animation: 'pulse 1.5s infinite'
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'var(--bg-card)',
        padding: 'var(--spacing-sm)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-primary)',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-secondary)',
        maxWidth: '200px',
        zIndex: 1999
      }}>
        💡 <strong>Tips:</strong><br />
        • Drag panels by their headers<br />
        • Click minimize (⬇) to dock panels<br />
        • Use layout presets for quick arrangements
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .floating-panels-layout {
          user-select: none;
        }

        @media (max-width: 768px) {
          .floating-panels-layout .floating-panel {
            width: calc(100vw - 40px) !important;
            height: 200px !important;
          }
        }
      `}</style>
    </div>
  );
};
