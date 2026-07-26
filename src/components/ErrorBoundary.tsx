import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AssetDoctor ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-20 h-20 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6 shadow-2xl shadow-emerald-500/20">
            <ShieldAlert className="w-10 h-10 text-emerald-400" />
          </div>

          <h1 className="text-2xl font-black text-white mb-2">AssetDoctor Core Guard</h1>
          <p className="text-xs text-slate-400 max-w-sm mb-6">
            Something went wrong while rendering the vault view. Don't worry, your data is safe and encrypted.
          </p>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-mono text-rose-300 max-w-md w-full mb-6 truncate">
            {this.state.error?.message || 'Unexpected application error'}
          </div>

          <button
            onClick={this.handleReload}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload AssetDoctor Vault</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
