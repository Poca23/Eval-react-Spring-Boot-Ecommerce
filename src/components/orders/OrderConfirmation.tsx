// src/components/orders/OrderConfirmation.tsx
import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice } from '../../utils/formatters';
import '../../styles/index.css';

export const OrderConfirmation: React.FC = () => {
  const { items, total, confirmOrder, isProcessingOrder, orderConfirmed } = useCart();
  const { user } = useAuth();

  const handleConfirmOrder = async () => {
    if (!user) {
      console.error('Utilisateur non connecté');
      return;
    }

    try {
      const shippingAddress = {
        fullName: user.firstName + ' ' + user.lastName,
        street: '', // À remplir avec les données de l'utilisateur
        city: '',
        postalCode: '',
        country: '',
        phone: '',
        email: user.email
      };

      const paymentDetails = {
        method: 'card' as const,
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
      };

      await confirmOrder(shippingAddress, paymentDetails);
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
    }
  };

  return (
    <div className="order-confirmation">
      <h2>Confirmation de commande</h2>
      
      <div className="cart-summary">
        <h3>Résumé de votre commande</h3>
        {items.map((item) => (
          <div key={item.product.id} className="cart-item">
            <span className="item-name">{item.product.name}</span>
            <span className="item-quantity">x {item.quantity}</span>
            <span className="item-price">
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
        
        <div className="cart-total">
          <strong>Total:</strong> {formatPrice(total)}
        </div>
      </div>
      
      {user && (
        <div className="user-info">
          <h3>Informations client</h3>
          <p>Email: {user.email}</p>
          {user.firstName && <p>Nom: {user.firstName} {user.lastName}</p>}
        </div>
      )}

      <button 
        className="confirm-button"
        onClick={handleConfirmOrder}
        disabled={isProcessingOrder || !items.length || !user}
      >
        {isProcessingOrder ? 'Traitement en cours...' : 'Confirmer la commande'}
      </button>

      {orderConfirmed && (
        <div className="confirmation-message">
          <p>Votre commande a été confirmée avec succès!</p>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
