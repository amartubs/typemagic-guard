
import React from 'react';

let reactReady = false;
let readyPromise: Promise<void> | null = null;

export const ensureReactReady = (): Promise<void> => {
  if (reactReady) {
    return Promise.resolve();
  }

  if (readyPromise) {
    return readyPromise;
  }

  readyPromise = new Promise((resolve) => {
    // Check if React is available
    const checkReact = () => {
      if (typeof React !== 'undefined' && React.useState && React.useEffect) {
        reactReady = true;
        resolve();
        return;
      }

      // If React global is not available, check if we can import it
      try {
        import('react').then((ReactModule) => {
          if (ReactModule.default && ReactModule.default.useState) {
            reactReady = true;
            resolve();
          } else {
            // Retry after a short delay
            setTimeout(checkReact, 10);
          }
        }).catch(() => {
          // Retry after a short delay
          setTimeout(checkReact, 10);
        });
      } catch {
        // Retry after a short delay
        setTimeout(checkReact, 10);
      }
    };

    checkReact();
  });

  return readyPromise;
};

export const isReactReady = () => reactReady;
