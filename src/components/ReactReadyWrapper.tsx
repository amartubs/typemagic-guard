
import React from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ReactReadyWrapperProps {
  children: React.ReactNode;
}

const ReactReadyWrapper: React.FC<ReactReadyWrapperProps> = ({ children }) => {
  // Simplified approach - just render children directly since React is already loaded if this component is executing
  return <>{children}</>;
};

export default ReactReadyWrapper;
