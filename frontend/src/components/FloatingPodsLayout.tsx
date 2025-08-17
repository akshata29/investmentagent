import React, { useState, useRef, useEffect } from 'react';

interface FloatingPodsLayoutProps {
  liveGuidanceComponent: React.ReactNode;
  sentimentComponent: React.ReactNode;
  transcriptComponent: React.ReactNode;
  recommendationComponent: React.ReactNode;
  isRecording: boolean;
}

// Individual floating pod component
const FloatingPod: React.FC<{
  id: string;
  title: string;
  icon: string;
  position: { x: number; y: number; width: number; height: number };
  isMinimized: boolean;
  isLocked: boolean;
  priority: 'primary' | 'secondary' | 'minimal';
  children: React.ReactNode;
  onPositionChange: (id: string, position: { x: number; y: number; width: number; height: number }) => void;
  onMinimize: (id: string) => void;
  onLock: (id: string) => void;
  metrics?: { label: string; value: string; color: string }[];
}> = ({
  id,
  title,
  icon,
  position,
  isMinimized,
  isLocked,
  priority,
  children,
  onPositionChange,
  onMinimize,
  onLock,
  metrics
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const podRef = useRef<HTMLDivElement>(null);

  const headerTextClass = priority === 'primary' ? 'text-on-primary' : priority === 'secondary' ? 'text-primary' : 'text-secondary';
  const minimizedSize = { width: 60, height: 60 };
  const currentSize = isMinimized ? { ...minimizedSize, x: position.x, y: position.y } : position;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isLocked) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - currentSize.width, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(window.innerHeight - currentSize.height, e.clientY - dragStart.y));
    
    onPositionChange(id, { ...position, x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, position, isLocked]);

  return (
    <div
      ref={podRef}
      className={`floating-pod ${priority}${isMinimized ? ' minimized' : ''}${isDragging ? ' dragging' : ''}${isLocked ? ' locked' : ''}`}
      style={{ left: currentSize.x, top: currentSize.y, width: currentSize.width, height: currentSize.height, zIndex: priority === 'primary' ? 1000 : priority === 'secondary' ? 900 : 800 }}
      onMouseDown={handleMouseDown}
    >
      {/* Pod Header */}
      <div className={`pod-header ${isMinimized ? 'minimized' : ''} ${priority}`}>
        {isMinimized ? (
          <div className="pod-minimized-icon">
            {icon}
          </div>
        ) : (
          <>
            <div className="pod-header-left">
              <span className="pod-icon">{icon}</span>
              <span className={`pod-title ${headerTextClass}`}>
                {title}
              </span>
            </div>
            
            <div className="pod-actions">
              {metrics && (
                <div className="pod-metrics">
                  {metrics.map((metric, index) => (
                    <div key={index} className="pod-metric-chip">
                      {metric.value}
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={(e) => { e.stopPropagation(); onLock(id); }}
                className="pod-btn"
              >
                {isLocked ? '🔒' : '🔓'}
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
                className="pod-btn"
              >
                {isMinimized ? '🔍' : '➖'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Pod Content */}
      {!isMinimized && (
        <div className={`pod-content ${priority === 'primary' ? 'text-on-primary' : ''}`}>
          {children}
        </div>
      )}
    </div>
  );
};

// Magnetic zones for auto-arrangement
const MagneticZone: React.FC<{
  zone: 'top' | 'bottom' | 'left' | 'right' | 'center';
  isActive: boolean;
}> = ({ zone, isActive }) => (
  <div className={`magnetic-zone ${zone}${isActive ? ' active' : ''}`} />
);

export const FloatingPodsLayout: React.FC<FloatingPodsLayoutProps> = ({
  liveGuidanceComponent,
  sentimentComponent,
  transcriptComponent,
  recommendationComponent,
  isRecording
}) => {
  const [pods, setPods] = useState([
    {
      id: 'transcript',
      title: 'Real-Time Transcript',
      icon: '📝',
      position: { x: 20, y: 20, width: 400, height: 300 },
      isMinimized: false,
      isLocked: false,
      priority: 'primary' as const,
      component: transcriptComponent
    },
    {
      id: 'guidance',
      title: 'Live Guidance',
      icon: '🤖',
      position: { x: 440, y: 20, width: 350, height: 250 },
      isMinimized: false,
      isLocked: false,
      priority: 'secondary' as const,
      component: liveGuidanceComponent
    },
    {
      id: 'recommendations',
      title: 'Investment Recommendations',
      icon: '💡',
      position: { x: 810, y: 20, width: 320, height: 280 },
      isMinimized: false,
      isLocked: false,
      priority: 'secondary' as const,
      component: recommendationComponent
    },
    {
      id: 'sentiment',
      title: 'Sentiment Analysis',
      icon: '📊',
      position: { x: 20, y: 340, width: 300, height: 200 },
      isMinimized: !isRecording,
      isLocked: false,
      priority: 'minimal' as const,
      component: sentimentComponent
    }
  ]);

  const [magneticZones, setMagneticZones] = useState<string[]>([]);

  const handlePositionChange = (id: string, newPosition: { x: number; y: number; width: number; height: number }) => {
    setPods(prev => prev.map(pod => 
      pod.id === id ? { ...pod, position: newPosition } : pod
    ));
  };

  const handleMinimize = (id: string) => {
    setPods(prev => prev.map(pod => 
      pod.id === id ? { ...pod, isMinimized: !pod.isMinimized } : pod
    ));
  };

  const handleLock = (id: string) => {
    setPods(prev => prev.map(pod => 
      pod.id === id ? { ...pod, isLocked: !pod.isLocked } : pod
    ));
  };

  const autoArrange = () => {
    const arrangements = {
      transcript: { x: 20, y: 20, width: 500, height: 350 },
      guidance: { x: 540, y: 20, width: 400, height: 200 },
      recommendations: { x: 540, y: 240, width: 400, height: 280 },
      sentiment: { x: 960, y: 20, width: 300, height: 200 }
    };

    setPods(prev => prev.map(pod => ({
      ...pod,
      position: arrangements[pod.id as keyof typeof arrangements] || pod.position,
      isMinimized: false
    })));
  };

  const minimizeAll = () => {
    setPods(prev => prev.map(pod => ({ ...pod, isMinimized: true })));
  };

  const expandAll = () => {
    setPods(prev => prev.map(pod => ({ ...pod, isMinimized: false })));
  };

  return (
    <div className="floating-pods-layout">
      {/* Floating Control Panel */}
      <div className="pods-controls">
        <button onClick={autoArrange} className="pods-btn primary">
          🎯 Auto Arrange
        </button>
        <button onClick={minimizeAll} className="pods-btn muted">
          ➖ Minimize All
        </button>
        <button onClick={expandAll} className="pods-btn success">
          🔍 Expand All
        </button>
      </div>

      {/* Magnetic Zones */}
      {magneticZones.map(zone => (
        <MagneticZone 
          key={zone} 
          zone={zone as any} 
          isActive={true} 
        />
      ))}

      {/* Floating Pods */}
      {pods.map(pod => (
        <FloatingPod
          key={pod.id}
          id={pod.id}
          title={pod.title}
          icon={pod.icon}
          position={pod.position}
          isMinimized={pod.isMinimized}
          isLocked={pod.isLocked}
          priority={pod.priority}
          onPositionChange={handlePositionChange}
          onMinimize={handleMinimize}
          onLock={handleLock}
          metrics={
            pod.id === 'transcript' ? [
              { label: 'Words', value: '1,247', color: 'var(--accent-blue)' },
              { label: 'Time', value: '12:34', color: 'var(--accent-green)' }
            ] :
            pod.id === 'sentiment' ? [
              { label: 'Positive', value: '67%', color: 'var(--accent-green)' }
            ] :
            pod.id === 'guidance' && isRecording ? [
              { label: 'Active', value: '3', color: 'var(--accent-orange)' }
            ] : undefined
          }
        >
          {pod.component}
        </FloatingPod>
      ))}

      {/* Recording Status Overlay */}
      {isRecording && (
        <div className="pods-recording-banner">
          <div className="pods-recording-dot" />
          🎤 Recording Active - AI Analysis in Progress
        </div>
      )}
    </div>
  );
};
