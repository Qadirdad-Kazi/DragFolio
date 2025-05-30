import React, { lazy, Suspense, useEffect } from 'react';

// LazyLoad component for code splitting
export const LazyLoad = ({ 
  children, 
  fallback = <div className="w-full h-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
  </div>
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// Image optimization component
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  placeholder = 'blur',
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  placeholder?: 'blur' | 'empty';
}) => {
  // Generate a tiny placeholder if blur is requested
  const blurDataURL = placeholder === 'blur' ? 
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PC9zdmc+' : 
    undefined;

  return (
    <img
      src={src}
      alt={alt || ''}
      width={width}
      height={height}
      loading={loading}
      className={`transition-opacity duration-500 ${className || ''}`}
      style={{
        backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
        backgroundSize: 'cover',
      }}
      {...props}
    />
  );
};

// Component to defer non-critical operations
export const DeferredOperations = ({ 
  children,
  delay = 1000 
}: { 
  children: React.ReactNode;
  delay?: number;
}) => {
  const [shouldRender, setShouldRender] = React.useState(false);

  useEffect(() => {
    // Use requestIdleCallback if available, otherwise setTimeout
    const timeoutId = 'requestIdleCallback' in window
      ? (window as any).requestIdleCallback(() => setShouldRender(true), { timeout: delay })
      : setTimeout(() => setShouldRender(true), delay);

    return () => {
      if ('requestIdleCallback' in window) {
        (window as any).cancelIdleCallback(timeoutId);
      } else {
        clearTimeout(timeoutId);
      }
    };
  }, [delay]);

  return shouldRender ? <>{children}</> : null;
};

// Component to prefetch resources
export const ResourcePrefetcher = ({ 
  resources = [] 
}: { 
  resources: Array<{ href: string; as: string; type?: string }>
}) => {
  useEffect(() => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource.href;
      if (resource.as) link.setAttribute('as', resource.as);
      if (resource.type) link.setAttribute('type', resource.type);
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    });
  }, [resources]);

  return null;
};

// Memoization helper for expensive components
export const MemoizedComponent = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  },
  (prevProps, nextProps) => {
    // Custom comparison logic if needed
    return prevProps.children === nextProps.children;
  }
);

export default {
  LazyLoad,
  OptimizedImage,
  DeferredOperations,
  ResourcePrefetcher,
  MemoizedComponent
};
