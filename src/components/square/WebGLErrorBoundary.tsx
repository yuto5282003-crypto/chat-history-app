"use client";

import { Component, type ReactNode } from "react";

type Props = {
  size: number;
  children: ReactNode;
  onError?: () => void;
};

type State = {
  hasError: boolean;
  retryCount: number;
};

const MAX_RETRIES = 2;

/**
 * Error Boundary that catches WebGL crashes and recovers gracefully.
 * On first crash, retries rendering. After MAX_RETRIES, shows a static fallback.
 */
export default class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, retryCount: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  handleRetry = () => {
    if (this.state.retryCount < MAX_RETRIES) {
      this.setState((s) => ({ hasError: false, retryCount: s.retryCount + 1 }));
    }
  };

  render() {
    if (this.state.hasError) {
      const { size } = this.props;
      const canRetry = this.state.retryCount < MAX_RETRIES;

      return (
        <div
          className="flex flex-col items-center justify-center rounded-xl"
          style={{
            width: size,
            height: size,
            background: "linear-gradient(135deg, rgba(155,138,251,0.15), rgba(155,138,251,0.05))",
          }}
        >
          <div
            className="flex items-center justify-center rounded-full mb-1"
            style={{
              width: size * 0.4,
              height: size * 0.4,
              background: "linear-gradient(135deg, rgba(155,138,251,0.3), rgba(155,138,251,0.15))",
            }}
          >
            <svg
              width={size * 0.2}
              height={size * 0.2}
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(155,138,251,0.8)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          {canRetry && (
            <button
              onClick={this.handleRetry}
              className="text-[8px] font-medium rounded-full px-2 py-0.5"
              style={{ color: "rgba(155,138,251,0.8)", background: "rgba(155,138,251,0.1)" }}
            >
              再読み込み
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
