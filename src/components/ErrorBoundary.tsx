import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
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
    console.error('Uncaught React Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050A14] flex flex-col items-center justify-center p-6 text-center text-slate-200 font-sans">
          <div className="max-w-md w-full bg-[#0A1020] border border-cyan-500/30 rounded-2xl p-8 shadow-2xl">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400 font-black text-2xl">
              !
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Đã xảy ra lỗi hệ thống</h2>
            <p className="text-sm text-slate-400 mb-6">
              Ứng dụng vừa gặp sự cố hiển thị. Vui lòng bấm nút bên dưới để làm mới trang.
            </p>
            {this.state.error && (
              <div className="bg-slate-900/80 p-3 rounded-lg text-left text-xs font-mono text-rose-300 mb-6 overflow-x-auto border border-white/5 max-h-32">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
            >
              Làm mới trang (Reload)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
