import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  title?: string;
  showNavigation?: boolean;
}

export const Header = ({ 
  title = "CodeLogs", 
  showNavigation = true 
}: HeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            
            {showNavigation && (
              <nav className="hidden md:flex space-x-6">
                <a href="/blogs" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Home
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Write
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Following
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Topics
                </a>
              </nav>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Debug element to test dark mode */}
            <div className="hidden md:block px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 text-xs rounded test-dark">
              Theme Test
            </div>
            
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {user ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  Welcome, {user.username || user.email || 'User'}
                </span>
                <div className="flex items-center space-x-2">
                  {/* User Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Logout Button */}
                  <button 
                    onClick={logout}
                    className="px-4 py-2 text-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <a 
                  href="/signin"
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </a>
                <a 
                  href="/signup"
                  className="px-4 py-2 text-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Get Started
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
