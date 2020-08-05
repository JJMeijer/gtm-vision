import React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../store/types';

import { ContainerContent } from './container-content';
import { LoadingSpinner } from './loading-spinner';

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
