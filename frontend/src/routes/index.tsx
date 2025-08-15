import { Routes } from 'react-router-dom';
import { authRoutes } from './AuthRoutes';
import { protectedRoutes } from './ProtectedRoutes';
import { publicRoutes } from './PublicRoutes';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentication Routes */}
      {authRoutes}
      
      {/* Protected Routes */}
      {protectedRoutes}
      
      {/* Public Routes & Fallbacks */}
      {publicRoutes}
    </Routes>
  );
};
