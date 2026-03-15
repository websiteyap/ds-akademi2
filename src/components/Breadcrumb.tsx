import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      <div className="container">
        <ol className="breadcrumb-list">
          <li className="breadcrumb-item">
            <Link href="/" className="breadcrumb-link">
              Ana Sayfa
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={i} className="breadcrumb-item">
              <ChevronRight size={12} className="breadcrumb-separator" />
              {item.href ? (
                <Link href={item.href} className="breadcrumb-link">
                  <span className="breadcrumb-label">{item.label}</span>
                </Link>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  <span className="breadcrumb-label">{item.label}</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
