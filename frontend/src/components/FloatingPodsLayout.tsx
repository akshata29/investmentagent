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

  const getPriorityStyles = () => {
    switch (priority) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          headerColor: 'white',
          shadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
          border: '2px solid #3b82f6',
          opacity: 1
        };
      case 'secondary':
        return {
          background: 'var(--bg-card)',
          headerColor: 'var(--text-primary)',
          shadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--border-primary)',
          opacity: 0.95
        };
      case 'minimal':
        return {
          background: 'rgba(255, 255, 255, 0.8)',
          headerColor: 'var(--text-secondary)',
          shadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          opacity: 0.9
        };
    }
  };

  const styles = getPriorityStyles();
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
      style={{
        position: 'absolute',
        left: currentSize.x,
        top: currentSize.y,
        width: currentSize.width,
        height: currentSize.height,
        background: styles.background,
        border: styles.border,
        borderRadius: isMinimized ? '50%' : '16px',
        boxShadow: styles.shadow,
        opacity: styles.opacity,
        cursor: isLocked ? 'default' : 'move',
        userSelect: 'none',
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: priority === 'primary' ? 1000 : priority === 'secondary' ? 900 : 800,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(10px)'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Pod Header */}
      <div style={{
        background: priority === 'primary' ? 'rgba(255,255,255,0.1)' : 'var(--bg-header)',
        color: styles.headerColor,
        padding: isMinimized ? '0' : '8px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: isMinimized ? '60px' : '40px',
        borderRadius: isMinimized ? '50%' : '0',
        position: 'relative'
      }}>
        {isMinimized ? (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '20px'
          }}>
            {icon}
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>{icon}</span>
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {title}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '4px' }}>
              {metrics && (
                <div style={{ display: 'flex', gap: '6px', marginRight: '8px' }}>
                  {metrics.map((metric, index) => (
                    <div key={index} style={{
                      background: 'rgba(255,255,255,0.2)',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '9px',
                      fontWeight: 600
                    }}>
                      {metric.value}
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLock(id);
                }}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px',
                  color: styles.headerColor,
                  cursor: 'pointer',
                  fontSize: '10px'
                }}
              >
                {isLocked ? '🔒' : '🔓'}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize(id);
                }}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px',
                  color: styles.headerColor,
                  cursor: 'pointer',
                  fontSize: '10px'
                }}
              >
                {isMinimized ? '🔍' : '➖'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Pod Content */}
      {!isMinimized && (
        <div style={{
          flex: 1,
          padding: '12px',
          overflow: 'auto',
          fontSize: '13px',
          lineHeight: 1.4,
          color: priority === 'primary' ? 'white' : 'var(--text-primary)'
        }}>
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
}> = ({ zone, isActive }) => {
  const getZoneStyles = () => {
    const base = {
      position: 'absolute' as const,
      background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
      border: '2px dashed #3b82f6',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      opacity: isActive ? 1 : 0.5,
      pointerEvents: 'none' as const
    };

    switch (zone) {
      case 'top':
        return { ...base, top: '10px', left: '10px', right: '10px', height: '120px' };
      case 'bottom':
        return { ...base, bottom: '10px', left: '10px', right: '10px', height: '120px' };
      case 'left':
        return { ...base, top: '140px', bottom: '140px', left: '10px', width: '200px' };
      case 'right':
        return { ...base, top: '140px', bottom: '140px', right: '10px', width: '200px' };
      case 'center':
        return { ...base, top: '50%', left: '50%', width: '300px', height: '200px', transform: 'translate(-50%, -50%)' };
    }
  };

  return <div style={getZoneStyles()} />;
};

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
    <div style={{
      position: 'relative',
      height: 'calc(100vh - 140px)',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      overflow: 'hidden'
    }}>
      {/* Floating Control Panel */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        gap: '8px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        zIndex: 2000
      }}>
        <button
          onClick={autoArrange}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          🎯 Auto Arrange
        </button>
        <button
          onClick={minimizeAll}
          style={{
            background: '#64748b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          ➖ Minimize All
        </button>
        <button
          onClick={expandAll}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
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
              { label: 'Words', value: '1,247', color: '#3b82f6' },
              { label: 'Time', value: '12:34', color: '#10b981' }
            ] :
            pod.id === 'sentiment' ? [
              { label: 'Positive', value: '67%', color: '#10b981' }
            ] :
            pod.id === 'guidance' && isRecording ? [
              { label: 'Active', value: '3', color: '#f59e0b' }
            ] : undefined
          }
        >
          {pod.component}
        </FloatingPod>
      ))}

      {/* Recording Status Overlay */}
      {isRecording && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(90deg, #ef4444, #dc2626)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '50px',
          fontSize: '14px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
          animation: 'pulse 2s infinite',
          zIndex: 2000
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'white',
            animation: 'pulse 1s infinite'
          }} />
          🎤 Recording Active - AI Analysis in Progress
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.8; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
