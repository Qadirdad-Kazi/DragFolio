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
        return 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg active:shadow-sm active:translate-y-0.5';
      case 'secondary':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 shadow-sm hover:shadow-md active:shadow-none active:translate-y-0.5';
      case 'outline':
        return 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:translate-y-0.5';
      case 'ghost':
        return 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 active:translate-y-0.5';
      case 'link':
        return 'bg-transparent text-blue-500 underline hover:text-blue-600 active:text-blue-700 active:translate-y-0.5';
      case 'destructive':
        return 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg active:shadow-sm active:translate-y-0.5';
      default:
        return 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg active:shadow-sm active:translate-y-0.5';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm rounded-md';
      case 'lg':
        return 'px-6 py-3.5 text-lg rounded-lg';
      case 'icon':
        return 'p-2.5 rounded-full';
      default:
        return 'px-4 py-2.5 text-base rounded-md';
    }
  };

  const buttonClasses = `
    inline-flex items-center justify-center
    font-medium
    transition-all duration-200
    transform hover:-translate-y-0.5
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
