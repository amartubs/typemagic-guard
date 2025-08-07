import React from 'react';

interface ReactReadyWrapperProps {
  children: React.ReactNode;
}

// Simple pass-through component to handle browser cache issues
const ReactReadyWrapper: React.FC<ReactReadyWrapperProps> = ({ children }) => {
  return <>{children}</>;
};

export default ReactReadyWrapper;