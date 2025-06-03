import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Components
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleBasedRedirect } from "./components/RoleBasedRedirect";

// Pages
import { Login } from './pages/Login';
import { RestaurantList } from './pages/RestaurantList';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { MenuItemDetail } from './pages/MenuItemDetail';
import { Cart } from './pages/Cart';
import { OrderHistory } from './pages/OrderHistory';
import { OngoingOrders } from './pages/OngoingOrders';
import { OrderDetail } from './pages/OrderDetail';
import { RatePage } from './pages/RatePage';
import { RestaurantRatings } from './pages/RestaurantRatings';
import { PersonalPage } from './pages/PersonalPage';
import Inbox from './pages/Inbox';
import { Payment } from './pages/Payment';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { RestaurantManagement } from './pages/admin/RestaurantManagement';
import MenuManagement from './pages/admin/MenuManagement';
import { OrderManagement } from './pages/admin/OrderManagement';
import AdminInbox from './pages/admin/AdminInbox';
import AdminPersonal from './pages/admin/AdminPersonal';
import SendNotification from './pages/admin/SendNotification';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffOrderManagement from './pages/staff/StaffOrderManagement';
import StaffPOS from './pages/staff/StaffPOS';
import StaffPersonal from './pages/staff/StaffPersonal';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  console.log("🧭 React Router basename =", import.meta.env.BASE_URL);

  return (
    <QueryClientProvider client={queryClient}>
      <Router basename={import.meta.env.BASE_URL}>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Employee routes */}
              <Route index element={<RoleBasedRedirect />} />
              <Route 
                path="restaurant" 
                element={
                  <ProtectedRoute requiredRole="employee">
                    <RestaurantList />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="restaurant/:restaurantId"
                element={
                  <ProtectedRoute requiredRole="employee">
                    <RestaurantDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="restaurant/:restaurantId/rate"
                element={
                  <ProtectedRoute requiredRole="employee">
                    <RestaurantRatings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="restaurant/:restaurantId/menu/:menuItemId"
                element={
                  <ProtectedRoute requiredRole="employee">
                    <MenuItemDetail />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="cart" 
                element={
                  <ProtectedRoute requiredRole="employee">
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="payment" 
                element={
                  <ProtectedRoute requiredRole="employee">
                    <Payment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="order" 
                element={
                  <ProtectedRoute requiredRole="employee">
                    <OngoingOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="order/:orderId" 
                element={
                  <ProtectedRoute allowedRoles={['employee', 'admin', 'staff']}>
                    <OrderDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="order-history" 
                element={
                  <ProtectedRoute requiredRole="employee">
                    <OrderHistory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="rate/:restaurantId" 
                element={
                  <ProtectedRoute requiredRole="employee">
                    <RatePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="personal" 
                element={
                  <ProtectedRoute requiredRole="employee">
                    <PersonalPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="inbox" 
                element={
                  <ProtectedRoute requiredRole="employee">
                    <Inbox />
                  </ProtectedRoute>
                } 
              />

              {/* Admin routes */}
              <Route
                path="admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/restaurants"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <RestaurantManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/restaurants/:restaurantId/menu"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <MenuManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/orders"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <OrderManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/send-notification"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <SendNotification />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/inbox"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminInbox />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/personal"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPersonal />
                  </ProtectedRoute>
                }
              />

              {/* Staff routes */}
              <Route
                path="staff"
                element={
                  <ProtectedRoute requiredRole="staff">
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="staff/orders"
                element={
                  <ProtectedRoute requiredRole="staff">
                    <StaffOrderManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="staff/pos"
                element={
                  <ProtectedRoute requiredRole="staff">
                    <StaffPOS />
                  </ProtectedRoute>
                }
              />
              <Route
                path="staff/personal"
                element={
                  <ProtectedRoute requiredRole="staff">
                    <StaffPersonal />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<RoleBasedRedirect />} />
          </Routes>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
