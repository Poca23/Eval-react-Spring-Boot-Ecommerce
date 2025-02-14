import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Administration</h2>
        <nav className="admin-nav-links">
          <NavLink 
            to="/admin/products"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Produits
          </NavLink>
          <NavLink 
            to="/admin/orders"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Commandes
          </NavLink>
        </nav>
      </aside>
      
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
