import { useEffect } from 'react';

export default function usePolling(callback, delay, deps = []) {
  useEffect(() => {
    if (!delay) return undefined;

    const intervalId = setInterval(() => {
      callback();
    }, delay);

    return () => clearInterval(intervalId);
  }, [callback, delay, ...deps]);
}
