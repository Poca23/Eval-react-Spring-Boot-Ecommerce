// src/components/cart/OrderConfirmation.tsx
import { Link } from 'react-router-dom';
import './OrderConfirmation.css';

function OrderConfirmation() {
  return (
    <div className="order-confirmation">
      <h2>Commande confirmée !</h2>
      <p>Merci pour votre commande. Un email de confirmation vous a été envoyé.</p>
      <div className="confirmation-actions">
        <Link to="/products" className="continue-shopping">
          Continuer les achats
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;
