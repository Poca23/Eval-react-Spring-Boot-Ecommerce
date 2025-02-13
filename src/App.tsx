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
import { Toast } from './components/common/Toast';


function App() {
  return (
    <ErrorProvider>
      <Toast />
    <Router>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin/orders" element={<OrderList />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Routes>
        </Layout>
      </CartProvider>
    </Router>
    <Toast />
    </ErrorProvider>
  );
}

export default App;
