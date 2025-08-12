'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} retry={this.retry} />
      }

      return (
        <div className="card text-center animate-fade-in">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2 text-error">Something went wrong</h2>
          <p className="text-muted mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button 
            onClick={this.retry}
            className="btn-primary hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label="Try again"
          >
            🔄 Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

// Game-specific error fallback component
export function GameErrorFallback({ error, retry }: { error?: Error; retry: () => void }) {
  return (
    <div className="card text-center animate-bounce-in">
      <div className="text-6xl mb-4">🎴</div>
      <h2 className="text-xl font-bold mb-2 text-error">Game Error</h2>
      <p className="text-muted mb-4">
        {error?.message?.includes('deck') 
          ? 'There was a problem with the card deck. Let\'s shuffle a new one!'
          : 'Something went wrong with the game. Don\'t worry, your progress is safe!'}
      </p>
      <div className="space-y-2">
        <button 
          onClick={retry}
          className="btn-primary w-full hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
          aria-label="Restart the game"
        >
          🎮 Restart Game
        </button>
        <p className="text-xs text-muted">
          If this keeps happening, try refreshing the page
        </p>
      </div>
    </div>
  )
}
