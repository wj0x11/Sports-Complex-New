import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import Gallery from "./pages/Gallery";
import OurCoaches from "./pages/OurCoaches";
import Sports from "./pages/Sports";

import SportDetails from "./pages/SportDetails";
import CoachDetails from "./pages/CoachDetails";
import CourtDetails from "./pages/CourtDetails";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import BookingHistory from "./pages/BookingHistory";

import BookingForm from "./pages/BookingForm";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import BookingSuccess from "./pages/BookingSuccess";

import AdminDashboard from "./pages/AdminDashboard";
import ManageSports from "./pages/ManageSports";
import ManageCourts from "./pages/ManageCourts";
import ManageCoaches from "./pages/ManageCoaches";
import ManageEquipment from "./pages/ManageEquipment";
import ManageBookings from "./pages/ManageBookings";
import ManagePayments from "./pages/ManagePayments";
import ManageUsers from "./pages/ManageUsers";
import AdminReports from "./pages/AdminReports";
import { useBooking } from "./context/BookingContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useBooking();
  const isAuthenticated = isLoggedIn;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminProtectedRoute = ({ children }) => {
  const { isLoggedIn, authUser } = useBooking();
  const isAdminAuthenticated = isLoggedIn && authUser?.role === "admin";

  return isAdminAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

function AppLayout() {
  const location = useLocation();

  const dashboardRoutes = [
    "/dashboard",
    "/profile",
    "/settings",
    "/notifications",
    "/booking-history",

    "/admin-dashboard",
    "/manage-sports",
    "/manage-courts",
    "/manage-coaches",
    "/manage-equipment",
    "/manage-bookings",
    "/manage-payments",
    "/manage-users",
    "/admin-reports",
  ];

  const hideLayout = dashboardRoutes.includes(location.pathname);

  return (
    <div className="app-layout">
      {!hideLayout && <Navbar />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/our-coaches" element={<OurCoaches />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/sports/:sportSlug" element={<SportDetails />} />
          <Route path="/coaches/:id" element={<CoachDetails />} />
          <Route path="/courts/:id" element={<CourtDetails />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/booking-history"
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            }
          />

          <Route path="/booking-form" element={<BookingForm />} />

          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/booking-success"
            element={
              <ProtectedRoute>
                <BookingSuccess />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/manage-sports"
            element={
              <AdminProtectedRoute>
                <ManageSports />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/manage-courts"
            element={
              <AdminProtectedRoute>
                <ManageCourts />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/manage-coaches"
            element={
              <AdminProtectedRoute>
                <ManageCoaches />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/manage-equipment"
            element={
              <AdminProtectedRoute>
                <ManageEquipment />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/manage-bookings"
            element={
              <AdminProtectedRoute>
                <ManageBookings />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/manage-payments"
            element={
              <AdminProtectedRoute>
                <ManagePayments />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/manage-users"
            element={
              <AdminProtectedRoute>
                <ManageUsers />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin-reports"
            element={
              <AdminProtectedRoute>
                <AdminReports />
              </AdminProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
