import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";
import { ThemeToggle } from "../components/ThemeToggle";
    
export const Signin = () => {
  return (
    <div className="h-screen grid lg:grid-cols-2 bg-white dark:bg-gray-900 relative">
      {/* Theme Toggle - Positioned in top-right corner */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="flex items-center justify-center min-h-screen lg:min-h-0 bg-white dark:bg-gray-900">
        <Auth type="signin" />
      </div>
      <div className="invisible lg:visible bg-gray-50 dark:bg-gray-800">
        <Quote type="signin" />
      </div>
    </div>
  );
};
