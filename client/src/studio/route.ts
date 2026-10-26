import { useEffect, useState } from 'react';

export function navigate(href: string) {
  window.history.pushState(null, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function useLocation() {
  const [location, setLocation] = useState(() => window.location.pathname + window.location.hash);
  useEffect(() => {
    const update = () => setLocation(window.location.pathname + window.location.hash);
    window.addEventListener('popstate', update);
    window.addEventListener('hashchange', update);
    return () => { window.removeEventListener('popstate', update); window.removeEventListener('hashchange', update); };
  }, []);
  return location;
}
