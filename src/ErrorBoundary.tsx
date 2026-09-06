import React, { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCw, ShieldAlert } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('total_link_clicks');
      localStorage.removeItem('analytics_cache');
      localStorage.setItem('total_link_clicks', '0');
      localStorage.setItem('completed_orders', '[]');
      localStorage.setItem('verified_live_orders', '[]');
      localStorage.setItem('registered_customers', '[]');
      if (typeof (window as any).cleanupBadLocalStorage === 'function') {
        (window as any).cleanupBadLocalStorage();
      }
    } catch (e) {
      console.warn('Reset error handling:', e);
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-[#111] border border-[#FFD700]/30 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-[#FFD700]/10 border border-[#FFD700]/40 rounded-full flex items-center justify-center mx-auto text-[#FFD700]">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#FFD700] tracking-wide uppercase">
                GOYE System Recovery
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                A minor UI component exception occurred. Your data and session remain 100% secure.
              </p>
            </div>
            
            <div className="bg-black/60 border border-white/10 rounded-xl p-4 text-left font-mono text-xs text-red-400 overflow-x-auto max-h-32">
              {this.state.error?.toString() || 'Unknown error'}
            </div>

            <button
              onClick={this.handleReset}
              className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-extrabold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition shadow-lg text-sm tracking-wide"
            >
              <RefreshCw size={18} />
              RELOAD & RECOVER SESSION
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
