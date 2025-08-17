import React, { useState, useEffect, useRef } from 'react';
import { 
  Stack, 
  Text, 
  Icon, 
  Spinner, 
  DefaultButton,
  PrimaryButton
} from '@fluentui/react';

interface ChatLiveGuidancePanelProps {
  liveGuidanceResult: string;
}

interface ChatMessage {
  id: string;
  type: 'advisor' | 'system' | 'action';
  content: string;
  timestamp: Date;
  isComplete?: boolean;
}

export const ChatLiveGuidancePanel: React.FC<ChatLiveGuidancePanelProps> = ({ liveGuidanceResult }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (liveGuidanceResult && liveGuidanceResult !== "Analyzing conversation...") {
      parseGuidanceIntoMessages(liveGuidanceResult);
    }
  }, [liveGuidanceResult]);

  useEffect(() => {
    if (messages.length > 0 && currentMessageIndex < messages.length && !showAllMessages) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => prev.map((msg, index) => 
            index === currentMessageIndex ? { ...msg, isComplete: true } : msg
          ));
          setIsTyping(false);
          setCurrentMessageIndex(prev => prev + 1);
        }, 1500); // Typing simulation duration
      }, 800); // Delay between messages

      return () => clearTimeout(timer);
    }
  }, [currentMessageIndex, messages.length, showAllMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentMessageIndex]);

  const parseGuidanceIntoMessages = (guidance: string) => {
    const lines = guidance.split('\n').filter(line => line.trim());
    const chatMessages: ChatMessage[] = [];

    // Welcome message
    chatMessages.push({
      id: 'welcome',
      type: 'advisor',
      content: "👋 Hi! I've analyzed the conversation and have some live guidance for you.",
      timestamp: new Date(),
      isComplete: false
    });

    let currentSection = '';
    let pendingTasks: string[] = [];
    let completedTasks: string[] = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.toLowerCase().includes('pending') && trimmedLine.toLowerCase().includes('task')) {
        currentSection = 'pending';
        chatMessages.push({
          id: `section-${chatMessages.length}`,
          type: 'system',
          content: "📋 Let me share the pending tasks that need attention:",
          timestamp: new Date(),
          isComplete: false
        });
      } else if (trimmedLine.toLowerCase().includes('completed') && trimmedLine.toLowerCase().includes('task')) {
        currentSection = 'completed';
        if (pendingTasks.length === 0) {
          chatMessages.push({
            id: `no-pending-${chatMessages.length}`,
            type: 'advisor',
            content: "✅ Great news! No pending tasks were identified.",
            timestamp: new Date(),
            isComplete: false
          });
        }
        chatMessages.push({
          id: `section-${chatMessages.length}`,
          type: 'system',
          content: "🎉 Here are the tasks that have been completed:",
          timestamp: new Date(),
          isComplete: false
        });
      } else if (trimmedLine.startsWith('-') || trimmedLine.match(/^\d+\./)) {
        const taskText = trimmedLine.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '');
        
        if (currentSection === 'pending') {
          pendingTasks.push(taskText);
          chatMessages.push({
            id: `pending-${chatMessages.length}`,
            type: 'action',
            content: `🔄 ${taskText}`,
            timestamp: new Date(),
            isComplete: false
          });
        } else if (currentSection === 'completed') {
          completedTasks.push(taskText);
          chatMessages.push({
            id: `completed-${chatMessages.length}`,
            type: 'advisor',
            content: `✅ ${taskText}`,
            timestamp: new Date(),
            isComplete: false
          });
        }
      }
    });

    // Summary message
    if (pendingTasks.length > 0 || completedTasks.length > 0) {
      let summaryMessage = "📊 Summary: ";
      if (completedTasks.length > 0) {
        summaryMessage += `${completedTasks.length} task${completedTasks.length > 1 ? 's' : ''} completed`;
      }
      if (pendingTasks.length > 0) {
        if (completedTasks.length > 0) summaryMessage += ", ";
        summaryMessage += `${pendingTasks.length} task${pendingTasks.length > 1 ? 's' : ''} pending`;
      }

      chatMessages.push({
        id: 'summary',
        type: 'system',
        content: summaryMessage,
        timestamp: new Date(),
        isComplete: false
      });
    }

    // Closing message
    chatMessages.push({
      id: 'closing',
      type: 'advisor',
      content: "Is there anything specific you'd like me to help you with regarding these tasks?",
      timestamp: new Date(),
      isComplete: false
    });

    setMessages(chatMessages);
    setCurrentMessageIndex(0);
  };

  const getMessageStyle = (messageType: string, isComplete: boolean) => {
    const baseStyle = {
      padding: '12px 16px',
      borderRadius: '18px',
      maxWidth: '80%',
      margin: '4px 0',
      position: 'relative' as const,
      opacity: isComplete ? 1 : 0.7
    };

    switch (messageType) {
      case 'advisor':
        return {
          ...baseStyle,
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          alignSelf: 'flex-start' as const,
          marginLeft: '0',
          marginRight: 'auto'
        };
      case 'system':
        return {
          ...baseStyle,
          backgroundColor: 'var(--bg-tertiary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-primary)',
          alignSelf: 'center' as const,
          fontSize: '14px',
          fontStyle: 'italic'
        };
      case 'action':
        return {
          ...baseStyle,
          backgroundColor: 'var(--bg-warning)',
          color: 'var(--text-primary)',
          border: '1px solid var(--color-warning)',
          alignSelf: 'flex-start' as const,
          marginLeft: '20px',
          marginRight: 'auto'
        };
      default:
        return baseStyle;
    }
  };

  const visibleMessages = showAllMessages ? messages : messages.slice(0, currentMessageIndex + 1);

  return (
    <Stack styles={{ root: { height: '100%', padding: '16px' } }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center" styles={{ root: { marginBottom: '16px' } }}>
  <Text variant="large" styles={{ root: { fontWeight: '600', color: 'var(--text-primary)' } }}>
          💬 Live Guidance Chat
        </Text>
        {messages.length > 0 && !showAllMessages && currentMessageIndex < messages.length && (
          <DefaultButton
            text="Show All"
            iconProps={{ iconName: 'FastForward' }}
            onClick={() => {
              setShowAllMessages(true);
              setMessages(prev => prev.map(msg => ({ ...msg, isComplete: true })));
            }}
          />
        )}
      </Stack>

      <Stack 
        styles={{ 
          root: { 
            flex: 1, 
            overflowY: 'auto',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column'
          } 
        }}
      >
        {liveGuidanceResult === "Analyzing conversation..." ? (
          <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { flex: 1 } }}>
            <Spinner size={3} label="Analyzing conversation for live guidance..." />
          </Stack>
        ) : (
          <>
            {visibleMessages.map((message, index) => (
              <div key={message.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={getMessageStyle(message.type, message.isComplete || showAllMessages)}>
                  <Text styles={{ root: { margin: 0 } }}>
                    {message.content}
                  </Text>
                </div>
                {!showAllMessages && index === currentMessageIndex && isTyping && (
                  <Stack horizontal verticalAlign="center" styles={{ root: { margin: '8px 0' } }}>
                    <div style={{ 
                      backgroundColor: 'var(--bg-tertiary)', 
                      borderRadius: '18px', 
                      padding: '8px 12px',
                      marginLeft: message.type === 'advisor' ? '0' : '20px'
                    }}>
                      <Spinner size={1} />
                      <Text styles={{ root: { marginLeft: '8px', fontSize: '12px', color: 'var(--text-muted)' } }}>
                        Typing...
                      </Text>
                    </div>
                  </Stack>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </>
        )}
      </Stack>

      {messages.length > 0 && (
        <Stack horizontal horizontalAlign="center" styles={{ root: { marginTop: '16px', gap: '8px' } }}>
          <PrimaryButton
            text="📝 Take Notes"
            iconProps={{ iconName: 'Edit' }}
            onClick={() => {/* Add note-taking functionality */}}
          />
          <DefaultButton
            text="🔄 Refresh Analysis"
            iconProps={{ iconName: 'Refresh' }}
            onClick={() => {
              setMessages([]);
              setCurrentMessageIndex(0);
              setShowAllMessages(false);
              // Trigger re-analysis
            }}
          />
        </Stack>
      )}
    </Stack>
  );
};
