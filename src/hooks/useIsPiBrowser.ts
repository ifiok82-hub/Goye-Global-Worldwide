import { useState, useEffect } from 'react';

export const useIsPiBrowser = () => {
  const [isPi, setIsPi] = useState(false);

  useEffect(() => {
    const checkPiBrowser = () => {
      const isPiBrowser = !!(window as any).Pi || navigator.userAgent.includes("PiBrowser");
      setIsPi(isPiBrowser);
    };
    checkPiBrowser();
  }, []);

  return isPi;
};
