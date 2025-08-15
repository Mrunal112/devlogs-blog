import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Blog } from './pages/Blog'
import { Blogs } from './pages/Blogs'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthGuard } from './components/AuthGuard'
import { AuthProvider } from './contexts/AuthContext'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
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
          {/* <Route path="/" element={<Signin />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App