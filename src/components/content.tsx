import React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../store/types';

import { ContainerContent } from './container-content';
import { LoadingSpinner } from './loading-spinner';

/**
 * Parent element for the content in the application, options:
 * - Display a container
 * - Show a loading spinner
 * - Show explanation about tool (TODO)
 */
export const Content: React.FC = () => {
  const { container, loadingState } = useSelector((state: State) => state);

  if (container) {
    // Return Container
    return <ContainerContent />;
  }

  // Loading Spinner
  if (loadingState) {
    return <LoadingSpinner />;
  }

  return null;
};
