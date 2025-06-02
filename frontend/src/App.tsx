import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Components
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import { Login } from "./pages/Login";
import { RestaurantList } from "./pages/RestaurantList";
import { RestaurantDetail } from "./pages/RestaurantDetail";
import { MenuItemDetail } from "./pages/MenuItemDetail";
import { Cart } from "./pages/Cart";
import { OrderHistory } from "./pages/OrderHistory";
import { OngoingOrders } from "./pages/OngoingOrders";
import { OrderDetail } from "./pages/OrderDetail";
import { RatePage } from "./pages/RatePage";
import { RestaurantRatings } from "./pages/RestaurantRatings";
import { PersonalPage } from "./pages/PersonalPage";
import Inbox from "./pages/Inbox";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { RestaurantManagement } from "./pages/admin/RestaurantManagement";
import { OrderManagement } from "./pages/admin/OrderManagement";
import { POSInterface } from "./pages/admin/POSInterface";

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
              <Route index element={<Navigate to="/restaurant" replace />} />
              <Route path="restaurant" element={<RestaurantList />} />
              <Route
                path="restaurant/:restaurantId"
                element={<RestaurantDetail />}
              />
              <Route
                path="restaurant/:restaurantId/rate"
                element={<RestaurantRatings />}
              />
              <Route
                path="restaurant/:restaurantId/menu/:menuItemId"
                element={<MenuItemDetail />}
              />
              <Route path="cart" element={<Cart />} />
              <Route path="order" element={<OngoingOrders />} />
              <Route path="order/:orderId" element={<OrderDetail />} />
              <Route path="order-history" element={<OrderHistory />} />
              <Route path="rate/:restaurantId" element={<RatePage />} />
              <Route path="personal" element={<PersonalPage />} />
              <Route path="inbox" element={<Inbox />} />

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
                path="admin/orders"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <OrderManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/pos"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <POSInterface />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/restaurant" replace />} />
          </Routes>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
