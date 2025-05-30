import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Suspense, lazy, useEffect } from 'react';
import { LazyLoad } from './components/PerformanceOptimizer';
import Navbar from "./components/Navbar";
import { useAuth, AuthProvider } from "./hooks/useAuth";

// Lazy load pages for code splitting
const NotFound = lazy(() => import("./pages/not-found"));
const Home = lazy(() => import("./pages/home"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Editor = lazy(() => import("./pages/editor"));
const Templates = lazy(() => import("./pages/templates"));
const Preview = lazy(() => import("./pages/preview"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Admin = lazy(() => import("./pages/admin"));
const ConnectionTest = lazy(() => import("./pages/connection-test"));

// Preload critical routes after initial render
const preloadCriticalRoutes = () => {
  const importPromises = [
    import("./pages/home"),
    import("./pages/login")
  ];
  
  // Preload in background
  Promise.all(importPromises).catch(err => {
    console.error('Error preloading routes:', err);
  });
};

function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, path: string }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [_, navigate] = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to home if not authenticated
    navigate("/");
    return null;
  }
  
  return <Component {...rest} />;
}

function Router() {
  // Loading fallback for lazy-loaded components
  const loadingFallback = (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  return (
    <Suspense fallback={loadingFallback}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard">
          {() => <ProtectedRoute component={Dashboard} path="/dashboard" />}
        </Route>
        <Route path="/editor">
          {() => <ProtectedRoute component={Editor} path="/editor" />}
        </Route>
        <Route path="/editor/:id">
          {(params) => <ProtectedRoute component={Editor} path={`/editor/${params.id}`} />}
        </Route>
        <Route path="/templates" component={Templates} />
        <Route path="/preview" component={Preview} />
        <Route path="/connection-test" component={ConnectionTest} />
        <Route path="/admin">
          {() => <ProtectedRoute component={Admin} path="/admin" />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function App() {
  // Preload critical routes after initial render
  useEffect(() => {
    // Use requestIdleCallback for non-critical preloading
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preloadCriticalRoutes, { timeout: 2000 });
    } else {
      // Fallback to setTimeout
      setTimeout(preloadCriticalRoutes, 2000);
    }
    
    // Add performance monitoring
    if (process.env.NODE_ENV === 'production') {
      // Report web vitals
      const reportWebVitals = () => {
        const cls = (window as any).CLS || 0;
        const fid = (window as any).FID || 0;
        const lcp = (window as any).LCP || 0;
        
        console.log('Performance metrics:', { cls, fid, lcp });
        // Here you could send these metrics to your analytics service
      };
      
      // Report after page is fully loaded
      window.addEventListener('load', () => {
        setTimeout(reportWebVitals, 3000);
      });
    }
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DndProvider backend={HTML5Backend}>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Router />
              </main>
            </div>
          </DndProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
