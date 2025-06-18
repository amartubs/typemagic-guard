
import React from 'react';
import { ensureReactReady } from '@/lib/reactGuard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ReactReadyWrapperProps {
  children: React.ReactNode;
}

const ReactReadyWrapper: React.FC<ReactReadyWrapperProps> = ({ children }) => {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    ensureReactReady().then(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Initializing application..." />
      </div>
    );
  }

  return <>{children}</>;
};

export default ReactReadyWrapper;
