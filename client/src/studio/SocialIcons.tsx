import type { SVGProps } from 'react';
type Props = SVGProps<SVGSVGElement> & { size?: number };

export function Github({size = 16,...props}: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props} aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.75-1.32-3.75-1.32-.51-1.29-1.24-1.64-1.24-1.64-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15 1 1.71 2.61 1.22 3.25.93.1-.72.4-1.22.71-1.5-2.47-.28-5.07-1.24-5.07-5.49 0-1.21.43-2.2 1.14-2.98-.12-.28-.49-1.41.11-2.94 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.43 3.04-1.14 3.04-1.14.61 1.53.23 2.66.12 2.94.71.78 1.14 1.77 1.14 2.98 0 4.26-2.6 5.2-5.09 5.48.4.35.76 1.03.76 2.07v3.1c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" /></svg>;
}

export function Linkedin({size = 16,...props}: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" /><path d="M7.5 11v6M11.5 17v-6m0 2.5c0-3.6 5-3.6 5 0V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
