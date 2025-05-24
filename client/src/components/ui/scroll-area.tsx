import React from 'react';

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollArea({ children, className = '' }: ScrollAreaProps) {
  return (
    <div className={`scroll-area ${className}`} style={{ overflowY: 'auto', height: '100%' }}>
      {children}
    </div>
  );
}
