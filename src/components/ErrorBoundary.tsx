/**
 * Error Boundary component for graceful error handling
 * Catches React component errors and displays fallback UI
 * Prevents entire app crash from single component failures
 */

import { Component, type ReactNode, type ErrorInfo } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component
 * Wraps child components and catches any render errors
 * Shows fallback UI if error occurs
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call optional error callback for logging services
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="class-retention-mfe__error-boundary">
            <div className="class-retention-mfe__error-content">
              <h2 className="class-retention-mfe__error-title">Oops! Something went wrong</h2>
              <p className="class-retention-mfe__error-message">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                className="class-retention-mfe__error-button"
                onClick={this.handleReset}
                type="button"
              >
                Try Again
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
