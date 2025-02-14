import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import Cart from './components/cart/Cart';
import OrderList from './components/orders/OrderList';
import { CartProvider } from './contexts/CartContext';
import OrderConfirmation from './components/cart/OrderConfirmation';
import AdminOrders from './components/admin/AdminOrders';
import { ErrorProvider } from './contexts/ErrorContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toast } from './components/common/Toast';
import LoginForm from './components/auth/LoginForm';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <Router>
          <CartProvider>
            <Layout>
              <Toast />
              <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<ProductList />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<LoginForm />} />

                {/* Routes protégées utilisateur */}
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute>
                      <Cart />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/order-confirmation"
                  element={
                    <PrivateRoute>
                      <OrderConfirmation />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <OrderList orders={[]} />
                    </PrivateRoute>
                  }
                />

                {/* Routes protégées admin */}
                <Route
                  path="/admin/orders"
                  element={
                    <PrivateRoute requireAdmin>
                      <AdminOrders />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Layout>
          </CartProvider>
        </Router>
      </AuthProvider>
    </ErrorProvider>
  );
}

export default App;
