import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  children,
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'secondary':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'outline':
        return 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50';
      case 'ghost':
        return 'bg-transparent text-gray-700 hover:bg-gray-100';
      case 'link':
        return 'bg-transparent text-blue-500 underline hover:text-blue-600';
      case 'destructive':
        return 'bg-red-500 text-white hover:bg-red-600';
      default:
        return 'bg-blue-500 text-white hover:bg-blue-600';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      case 'icon':
        return 'p-2';
      default:
        return 'px-4 py-2';
    }
  };

  const buttonClasses = `
    inline-flex items-center justify-center
    font-medium
    rounded-md
    transition-colors
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
    disabled:opacity-50 disabled:cursor-not-allowed
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${className}
  `;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};
