import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ReCaptchaProvider from './components/ReCaptchaProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CommunityChat from './components/CommunityChat';
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
import SolarCalculatorPage from './pages/SolarCalculatorPage';

function App() {
  return (
    <ReCaptchaProvider>
      <AuthProvider>
        <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/conservation" element={<ConservationPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/event" element={<EventDetailPage />} />
              <Route path="/energy" element={<EnergyPage />} />
              <Route path="/energy/calculator" element={<SolarCalculatorPage />} />
              <Route path="/energy/contact" element={<EnergyContactPage />} />
              <Route path="/transport" element={<TransportPage />} />
              <Route path="/waste" element={<WastePage />} />
            </Routes>
          </main>
          <Footer />
          {/* Community Chat - Floating button on all pages */}
          <CommunityChat />
        </div>
        </Router>
      </AuthProvider>
    </ReCaptchaProvider>
  );
}

export default App;
