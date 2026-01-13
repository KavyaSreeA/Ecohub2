import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ConservationPage from './pages/ConservationPage';
import EnergyPage from './pages/EnergyPage';
import EnergyContactPage from './pages/EnergyContactPage';
import TransportPage from './pages/TransportPage';
import WastePage from './pages/WastePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PaymentPage from './pages/PaymentPage';
import EventDetailPage from './pages/EventDetailPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ContentModeration from './pages/admin/ContentModeration';
import Analytics from './pages/admin/Analytics';

// Protected Route Component for Admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Protected Route Component for Authenticated Users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Layout component to conditionally show Navbar/Footer
const Layout = ({ children, showFooter = true }: { 
  children: React.ReactNode; 
  showNavbar?: boolean; 
  showFooter?: boolean;
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {<Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

// App Routes Component (needs to be inside AuthProvider)
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/login" element={<Layout showFooter={false}><LoginPage /></Layout>} />
      <Route path="/register" element={<Layout showFooter={false}><RegisterPage /></Layout>} />
      <Route path="/conservation" element={<Layout><ConservationPage /></Layout>} />
      <Route path="/energy" element={<Layout><EnergyPage /></Layout>} />
      <Route path="/energy/contact" element={<Layout><EnergyContactPage /></Layout>} />
      <Route path="/transport" element={<Layout><TransportPage /></Layout>} />
      <Route path="/waste" element={<Layout><WastePage /></Layout>} />
      <Route path="/event" element={<Layout><EventDetailPage /></Layout>} />
      
      {/* Protected Routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout><ProfilePage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/payment" element={
        <ProtectedRoute>
          <Layout><PaymentPage /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <Layout showFooter={false}><AdminDashboard /></Layout>
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <Layout showFooter={false}><UserManagement /></Layout>
        </AdminRoute>
      } />
      <Route path="/admin/content" element={
        <AdminRoute>
          <Layout showFooter={false}><ContentModeration /></Layout>
        </AdminRoute>
      } />
      <Route path="/admin/approvals" element={
        <AdminRoute>
          <Layout showFooter={false}><ContentModeration /></Layout>
        </AdminRoute>
      } />
      <Route path="/admin/analytics" element={
        <AdminRoute>
          <Layout showFooter={false}><Analytics /></Layout>
        </AdminRoute>
      } />
      
      {/* Catch all - 404 */}
      <Route path="*" element={
        <Layout>
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <span className="text-6xl mb-4">🌿</span>
            <h1 className="text-3xl font-serif font-semibold text-charcoal mb-2">Page Not Found</h1>
            <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
            <a href="/" className="px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors">
              Go Home
            </a>
          </div>
        </Layout>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
