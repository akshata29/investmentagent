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
  color: 'var(--color-primary)',
        isLive: isRecording,
        position: { x: 20, y: 20, width: panelWidth, height: panelHeight, zIndex: 1001, minimized: false }
      },
      {
        key: 'guidance',
        title: 'Live Guidance',
        icon: '🤖',
        component: liveGuidanceComponent,
  color: 'var(--accent-green)',
        isLive: isRecording,
        position: { x: panelWidth + 30, y: 20, width: panelWidth, height: panelHeight, zIndex: 1002, minimized: false }
      },
      {
        key: 'sentiment',
        title: 'Sentiment Analysis',
        icon: '📊',
        component: sentimentComponent,
  color: 'var(--accent-orange)',
        isLive: false,
        position: { x: 20, y: panelHeight + 30, width: panelWidth, height: panelHeight, zIndex: 1003, minimized: false }
      },
      {
        key: 'recommendation',
        title: 'Investment Recommendations',
        icon: '💡',
        component: recommendationComponent,
  color: 'var(--accent-purple)',
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
      className={`floating-panel${dragState.draggedPanel === panel.key ? ' dragging' : ''}`}
      style={{
        left: panel.position.x,
        top: panel.position.y,
        width: panel.position.width,
        height: panel.position.minimized ? 40 : panel.position.height,
        zIndex: panel.position.zIndex
      }}
    >
      {/* Panel Header */}
      <div className="floating-panel-header" style={{ background: panel.color }} onMouseDown={(e) => handleMouseDown(e, panel.key)}>
        <div className="floating-panel-header-left">
          <span className="floating-panel-icon">{panel.icon}</span>
          <h4 className="floating-panel-title">{panel.title}</h4>
          {panel.isLive && (<span className="live-chip">LIVE</span>)}
        </div>
        <div className="floating-panel-actions">
          <button onClick={() => toggleMinimize(panel.key)} className="btn-minimize" title={panel.position.minimized ? 'Restore' : 'Minimize'}>
            {panel.position.minimized ? '⬆' : '⬇'}
          </button>
        </div>
      </div>

      {/* Panel Content */}
      {!panel.position.minimized && (
        <div className="floating-panel-content">
          {panel.component}
        </div>
      )}
    </div>
  );

  return (
    <div className="floating-panels-layout">
      {/* Controls */}
      <div className="floating-controls">
        <div className="controls-title">
          Layout Control
        </div>
        
        <select
          value={layoutMode}
          onChange={(e) => setLayoutMode(e.target.value as any)}
          className="controls-select"
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
  <div className="floating-dock">
        {panels.filter(p => p.position.minimized).map(panel => (
          <button
            key={`dock-${panel.key}`}
            onClick={() => toggleMinimize(panel.key)}
    className="dock-button"
    style={{ background: panel.color }}
            title={panel.title}
          >
            <span>{panel.icon}</span>
            {panel.isLive && (
      <span className="dock-live-dot" />
            )}
          </button>
        ))}
      </div>

      {/* Instructions */}
  <div className="floating-tips">
        💡 <strong>Tips:</strong><br />
        • Drag panels by their headers<br />
        • Click minimize (⬇) to dock panels<br />
        • Use layout presets for quick arrangements
      </div>
    </div>
  );
};
