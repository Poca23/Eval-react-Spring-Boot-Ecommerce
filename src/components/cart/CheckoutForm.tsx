// src/components/cart/CheckoutForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useCart } from '../../hooks/useCart';
import { useStock } from '../../hooks/useStock';
import { useError } from '../../contexts/ErrorContext';
import { handleApiError } from '../../utils/errorHandler';
import { validators } from '../../utils/validators';
import { ERROR_MESSAGES } from '../../utils/errorMessages';
import '../../styles/index.css';

interface CheckoutFormProps {
  onClose?: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { setError } = useError();
  const { createOrder } = useOrders();
  const { cart, clearCart } = useCart();
  const { validateCartStocks } = useStock();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!validators.email(email)) {
      setError(ERROR_MESSAGES.ORDER.INVALID_EMAIL);
      return false;
    }

    if (cart.length === 0) {
      setError(ERROR_MESSAGES.CART.EMPTY_CART);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      // Préparation des items du panier
      const cartItems = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));

      // Validation des stocks
      const stocksValid = await validateCartStocks(cartItems);
      if (!stocksValid) {
        throw new Error(ERROR_MESSAGES.CART.STOCK_LIMIT);
      }

      // Création de la commande
      const orderResult = await createOrder({ 
        email, 
        items: cartItems,
        total: calculateTotal()
      });

      if (orderResult.success) {
        await clearCart();
        navigate('/order-confirmation', { 
          state: { orderId: orderResult.orderId }
        });
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  return (
    <div className="checkout-form-container">
      <div className="checkout-header">
        <h2>Finaliser la commande</h2>
        {onClose && (
          <button onClick={onClose} className="close-button">
            ×
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            disabled={isProcessing}
          />
        </div>

        <div className="order-summary">
          <h3>Récapitulatif de la commande</h3>
          <ul>
            {cart.map(item => (
              <li key={item.product.id} className="order-item">
                <span className="item-name">{item.product.name}</span>
                <span className="item-quantity">x {item.quantity}</span>
                <span className="item-price">
                  {(item.product.price * item.quantity).toFixed(2)}€
                </span>
              </li>
            ))}
          </ul>
          <div className="total">
            <strong>Total:</strong> {calculateTotal().toFixed(2)}€
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isProcessing || cart.length === 0}
          className="submit-button"
        >
          {isProcessing ? 'Traitement...' : 'Confirmer la commande'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
