import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Glamgo Error Boundary Caught Exception]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full bg-bg text-text flex items-center justify-center p-6 sm:p-10 font-sans selection:bg-accent-soft selection:text-accent-pressed">
          <div className="w-full max-w-xl bg-card border border-border rounded-3xl shadow-warm-lg p-8 sm:p-10 text-center relative overflow-hidden">
            {/* Atelier Crest */}
            <div className="w-14 h-14 mx-auto rounded-2xl bg-accent text-white flex items-center justify-center mb-6 shadow-warm-xs">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-semibold uppercase tracking-wider mb-4 border border-accent/20">
              <AlertCircle className="w-3.5 h-3.5 text-accent" />
              <span>Session Recovery Protected</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-text mb-3">
              The Atelier Concierge Is Restoring Your Session
            </h1>

            <p className="text-sm text-text-muted leading-relaxed max-w-md mx-auto mb-8 font-sans">
              An unexpected client interface state occurred. Your active slot reservations and cart contents are safely cached.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-accent text-white hover:bg-accent-pressed text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-warm-xs active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-fill text-accent-pressed hover:bg-accent-soft border border-border text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95"
              >
                <Home className="w-4 h-4 text-accent" />
                <span>Return to Home</span>
              </button>
            </div>

            {/* Diagnostic Details (Non-Production / Debug Toggle) */}
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details className="mt-8 text-left bg-bg-alt border border-border rounded-2xl p-4 text-xs font-mono text-text">
                <summary className="font-semibold text-text cursor-pointer mb-2">
                  Technical Diagnostics ({this.state.error.name})
                </summary>
                <p className="text-error font-bold mb-2">{this.state.error.message}</p>
                <pre className="overflow-x-auto text-[11px] text-text-muted max-h-40 leading-relaxed">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
