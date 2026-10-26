import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { navigate } from './route';

export function Link({ href = '/', onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (props.target && props.target !== '_self') || props.download != null) return;
    if (href.startsWith('/') && !href.startsWith('//')) { event.preventDefault(); navigate(href); }
  };
  return <a {...props} href={href} onClick={handleClick} />;
}
