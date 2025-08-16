import React from 'react';

interface ModernButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  icon
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
          color: 'var(--text-on-primary)',
          border: 'none'
        };
      case 'secondary':
        return {
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-primary)'
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, var(--color-danger), #c82333)',
          color: 'var(--text-on-primary)',
          border: 'none'
        };
      case 'success':
        return {
          background: 'linear-gradient(135deg, var(--color-success), #157347)',
          color: 'var(--text-on-primary)',
          border: 'none'
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          fontSize: 'var(--font-size-sm)'
        };
      case 'large':
        return {
          padding: 'var(--spacing-md) var(--spacing-xl)',
          fontSize: 'var(--font-size-lg)'
        };
      default:
        return {
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          fontSize: 'var(--font-size-base)'
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    borderRadius: 'var(--radius-md)',
    fontWeight: 'var(--font-weight-medium)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: 'var(--shadow-sm)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-xs)',
    opacity: disabled || loading ? 0.6 : 1,
    position: 'relative',
    ...getVariantStyles(),
    ...getSizeStyles()
  };

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`modern-button ${className} ${loading ? 'loading' : ''}`}
      style={baseStyles}
    >
      {loading ? (
        <>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

interface ModernIconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  title?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

export const ModernIconButton: React.FC<ModernIconButtonProps> = ({
  icon,
  onClick,
  title,
  variant = 'secondary',
  size = 'medium',
  disabled = false,
  className = ''
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: '32px', height: '32px' };
      case 'large':
        return { width: '48px', height: '48px' };
      default:
        return { width: '40px', height: '40px' };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--color-primary)',
          color: 'var(--text-on-primary)'
        };
      case 'danger':
        return {
          background: 'var(--color-danger)',
          color: 'var(--text-on-primary)'
        };
      default:
        return {
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-primary)'
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    border: 'none',
    borderRadius: '50%',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)',
    opacity: disabled ? 0.6 : 1,
    ...getSizeStyles(),
    ...getVariantStyles()
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`modern-icon-button ${className}`}
      style={baseStyles}
    >
      {icon}
    </button>
  );
};
