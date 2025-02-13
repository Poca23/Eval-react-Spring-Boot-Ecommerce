// src/components/cart/OrderConfirmation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useError } from '../../contexts/ErrorContext';
import '../../styles/index.css';

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const { setError } = useError();
  const orderId = location.state?.orderId;

  React.useEffect(() => {
    if (!orderId) {
      setError('Impossible d\'accéder directement à la page de confirmation');
    }
  }, [orderId, setError]);

  if (!orderId) {
    return (
      <div className="error-message">
        <p>Accès non autorisé</p>
        <Link to="/products" className="return-link">
          Retourner aux produits
        </Link>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="confirmation-content">
        <h2>Commande confirmée !</h2>
        <p>Votre numéro de commande est : {orderId}</p>
        <p>Un email de confirmation vous a été envoyé.</p>
        
        <div className="confirmation-actions">
          <Link to="/products" className="continue-shopping">
            Continuer les achats
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
