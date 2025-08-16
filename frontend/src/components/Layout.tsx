import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  headerTitle?: string;
  showNavigation?: boolean;
  className?: string;
}

export const Layout = ({ 
  children, 
  headerTitle, 
  showNavigation = true,
  className = ""
}: LayoutProps) => {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors ${className}`}>
      <Header title={headerTitle} showNavigation={showNavigation} />
      
      <main className="flex-1 bg-inherit">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};
