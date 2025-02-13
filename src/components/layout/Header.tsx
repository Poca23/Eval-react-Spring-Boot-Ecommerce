import { Link } from 'react-router-dom';
import '../../../index.css';
function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">E-Commerce</Link>
        </div>
        <nav className="nav-links">
          <Link to="/products">Produits</Link>
          <Link to="/cart">Panier</Link>
          <Link to="/admin/orders">Admin</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
