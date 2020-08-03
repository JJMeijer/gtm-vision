import React from 'react';
import PropTypes from 'prop-types';

import { ErrorComponent } from './error-component';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  static propTypes = {};

  render(): React.ReactElement | React.ReactNode {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return <ErrorComponent />;
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.element.isRequired,
};
