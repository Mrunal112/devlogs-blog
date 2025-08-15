import { Route } from 'react-router-dom';
import { Signin } from '../pages/Signin';
import { Signup } from '../pages/Signup';
import { AuthGuard } from '../components/AuthGuard';

export const authRoutes = (
  <>
    <Route 
      path="/signup" 
      element={
        <AuthGuard>
          <Signup />
        </AuthGuard>
      } 
    />
    <Route 
      path="/signin" 
      element={
        <AuthGuard>
          <Signin />
        </AuthGuard>
      } 
    />
  </>
);
