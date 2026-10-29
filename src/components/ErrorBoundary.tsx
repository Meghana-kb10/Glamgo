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
        <div className="min-h-screen w-full bg-[#FAF8F5] text-[#181311] flex items-center justify-center p-6 sm:p-10 font-sans selection:bg-[#E8DDD4]">
          <div className="w-full max-w-xl bg-white border border-stone-200/90 rounded-3xl shadow-xl p-8 sm:p-10 text-center relative overflow-hidden">
            {/* Atelier Crest */}
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#181311] text-[#FAF8F5] flex items-center justify-center mb-6 shadow-md">
              <Sparkles className="w-7 h-7 text-[#D4AF37]" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-stone-200/60">
              <AlertCircle className="w-3.5 h-3.5 text-[#8E3824]" />
              <span>Session Recovery Protected</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#181311] mb-3">
              The Atelier Concierge Is Restoring Your Session
            </h1>

            <p className="text-sm text-stone-600 leading-relaxed max-w-md mx-auto mb-8 font-sans">
              An unexpected client interface state occurred. Your active Redis slot reservations and cart contents are safely cached.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#181311] text-[#FAF8F5] hover:bg-stone-800 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200/80 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95"
              >
                <Home className="w-4 h-4 text-stone-600" />
                <span>Return to Showcase</span>
              </button>
            </div>

            {/* Diagnostic Details (Non-Production / Debug Toggle) */}
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details className="mt-8 text-left bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-xs font-mono text-stone-700">
                <summary className="font-semibold text-stone-900 cursor-pointer mb-2">
                  Technical Diagnostics ({this.state.error.name})
                </summary>
                <p className="text-red-700 font-bold mb-2">{this.state.error.message}</p>
                <pre className="overflow-x-auto text-[11px] text-stone-600 max-h-40 leading-relaxed">
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
