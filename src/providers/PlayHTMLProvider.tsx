import React, { Component, ErrorInfo, ReactNode } from 'react';
import { PlayProvider } from '@playhtml/react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Custom Error Boundary to catch any playhtml or Yjs failures gracefully
class PlayHTMLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PlayHTML Provider Error Caught:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Return children directly if playhtml crashes, bypassing playhtml connection
      return <>{this.props.children}</>;
    }

    return this.props.children;
  }
}

interface PlayHTMLProviderProps {
  children: ReactNode;
}

export const PlayHTMLProvider: React.FC<PlayHTMLProviderProps> = ({ children }) => {
  return (
    <PlayHTMLErrorBoundary>
      <PlayProvider
        initOptions={{
          cursors: {
            enabled: false, // Turn off floating user cursors to avoid visual clutter
          },
        }}
      >
        {children}
      </PlayProvider>
    </PlayHTMLErrorBoundary>
  );
};
