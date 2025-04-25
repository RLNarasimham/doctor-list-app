import { useEffect, useState } from 'react';

export const useSearchParams = (): [URLSearchParams, (params: URLSearchParams) => void] => {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    return new URLSearchParams(window.location.search);
  });
  
  useEffect(() => {
    // Update URL when search params change
    const queryString = searchParams.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;
    
    window.history.pushState({ path: newUrl }, '', newUrl);
  }, [searchParams]);
  
  useEffect(() => {
    // Handle browser back/forward navigation
    const handlePopState = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  return [searchParams, setSearchParams];
};