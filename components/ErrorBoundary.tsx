// src/components/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ServerCrash } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-300 p-4 text-center">
            <div className="relative">
                <div className="absolute -inset-2 bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
                <ServerCrash className="relative h-20 w-20 text-red-400 mb-4" style={{ filter: 'drop-shadow(0 0 10px currentColor)'}} />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-red-400" style={{ textShadow: '0 0 10px rgba(248, 113, 113, 0.5)'}}>Tizimda Kritik Xatolik</h1>
            <p className="max-w-md text-slate-400">Kechirasiz, kutilmagan anomaliya ro'y berdi. Iltimos, tizimni qayta yuklang yoki birozdan so'ng qayta urinib ko'ring.</p>
            <button 
                onClick={() => window.location.reload()}
                className="mt-6 inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-bold transition-all duration-300 ease-in-out bg-slate-700/50 text-slate-300 border border-slate-600 hover:border-cyan-400 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
            >
                Sahifani qayta yuklash
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;