import { Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

export const publicRoutes = (
  <>
    {/* Redirect root to signin */}
    <Route path="/" element={<Navigate to="/signin" replace />} />
    
    {/* 404 fallback - redirect to signin */}
    <Route path="*" element={<Navigate to="/signin" replace />} />
  </>
);
