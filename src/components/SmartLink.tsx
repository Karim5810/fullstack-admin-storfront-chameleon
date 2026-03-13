import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface SmartLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function SmartLink({ href, children, className, style, onClick }: SmartLinkProps) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className} style={style} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} style={style} onClick={onClick}>
      {children}
    </a>
  );
}
