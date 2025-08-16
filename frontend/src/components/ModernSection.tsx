import React from 'react';
import { Pivot, PivotItem } from '@fluentui/react';

interface ModernSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

export const ModernSection: React.FC<ModernSectionProps> = ({ 
  title, 
  children, 
  className = '',
  headerActions 
}) => {
  return (
    <div className={`modern-section fade-in ${className}`}>
      <div className="modern-section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{title}</span>
          {headerActions && <div>{headerActions}</div>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

interface ModernPivotSectionProps {
  title: string;
  items: Array<{
    headerText: string;
    key: string;
    content: React.ReactNode;
  }>;
  className?: string;
}

export const ModernPivotSection: React.FC<ModernPivotSectionProps> = ({ 
  title, 
  items, 
  className = '' 
}) => {
  return (
    <ModernSection title={title} className={className}>
      <Pivot 
        aria-label={title}
        styles={{
          root: {
            backgroundColor: 'var(--bg-card)'
          },
          link: {
            color: 'var(--text-primary)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            margin: '0 2px'
          },
          linkIsSelected: {
            backgroundColor: 'var(--bg-card)',
            borderBottom: '2px solid var(--color-primary)',
            color: 'var(--color-primary)'
          }
        }}
      >
        {items.map((item) => (
          <PivotItem 
            key={item.key} 
            headerText={item.headerText}
          >
            <div style={{ 
              padding: 'var(--spacing-md)', 
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderTop: 'none',
              borderRadius: '0 0 var(--radius-md) var(--radius-md)'
            }}>
              {item.content}
            </div>
          </PivotItem>
        ))}
      </Pivot>
    </ModernSection>
  );
};

interface ModernTextAreaProps {
  id: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  className?: string;
}

export const ModernTextArea: React.FC<ModernTextAreaProps> = ({
  id,
  value,
  defaultValue,
  onChange,
  placeholder = '',
  rows = 10,
  readOnly = false,
  className = ''
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <textarea
      id={id}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      placeholder={placeholder}
      rows={rows}
      readOnly={readOnly}
      className={`modern-textarea ${className}`}
      style={{
        width: '100%',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-sm)',
        fontSize: 'var(--font-size-sm)',
        lineHeight: '1.5',
        resize: 'vertical'
      }}
    />
  );
};
