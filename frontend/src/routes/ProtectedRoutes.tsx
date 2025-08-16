import { Route } from 'react-router-dom';
import { Blog } from '../pages/Blog';
import { Blogs } from '../pages/Blogs';
import { Publish } from '../components/Publish';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const protectedRoutes = (
  <>
    <Route 
      path="/blogs" 
      element={
        <ProtectedRoute>
          <Blogs />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/blog/:id" 
      element={
        <ProtectedRoute>
          <Blog />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/publish" 
      element={
        <ProtectedRoute>
          <Publish />
        </ProtectedRoute>
      } 
    />
  </>
);
