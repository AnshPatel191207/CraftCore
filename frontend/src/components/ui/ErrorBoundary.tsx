import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-text">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full glass p-10 rounded-[40px] border border-red-500/20 text-center space-y-8 shadow-[0_0_100px_rgba(239,68,68,0.1)]"
          >
            <div className="w-20 h-20 rounded-3xl bg-error/10 flex items-center justify-center mx-auto text-error border border-error/20 scale-110 rotate-3">
              <AlertTriangle size={40} />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-display font-black tracking-tighter uppercase">System Fracture</h1>
              <p className="text-text-muted font-bold text-sm leading-relaxed uppercase tracking-widest">
                An unexpected protocol error has occurred within the core engine.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left font-mono text-[10px] text-error/70 overflow-hidden truncate">
               {this.state.error?.message || 'Unknown Execution Error'}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full py-4 rounded-2xl bg-teal-500 text-bg text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <RefreshCcw size={14} />
                Re-Initialize System
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-4 rounded-2xl bg-white/5 text-text text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Home size={14} />
                Return to Nexus
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
