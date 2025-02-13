// src/components/cart/CheckoutForm.tsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useCart } from '../../hooks/useCart';
import { useStock } from '../../hooks/useStock';
import { useError } from '../../contexts/ErrorContext';
import { handleApiError } from '../../utils/errorHandler';
import { validators } from '../../utils/validators';
import { ERROR_MESSAGES } from '../../utils/errorMessages';
import { formatPrice } from '../../utils/formatters';
import '../../styles/index.css';

interface CheckoutFormProps {
  onClose?: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const { setError, clearError } = useError();
  const { createOrder } = useOrders();
  const { cart, clearCart, getTotalAmount } = useCart();
  const { validateCartStocks } = useStock();
  const navigate = useNavigate();

  const validateForm = useCallback(() => {
    const errors: { [key: string]: string } = {};
    
    try {
      validators.email(email);
    } catch (e) {
      errors.email = ERROR_MESSAGES.ORDER.INVALID_EMAIL;
    }

    if (cart.length === 0) {
      errors.cart = ERROR_MESSAGES.CART.EMPTY_CART;
    }

    const total = getTotalAmount();
    if (!validators.price(total)) {
      errors.total = ERROR_MESSAGES.ORDER.INVALID_AMOUNT;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email, cart, getTotalAmount]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setEmail(e.target.value);
    if (validationErrors.email) {
      const newErrors = { ...validationErrors };
      delete newErrors.email;
      setValidationErrors(newErrors);
    }
  };

  const prepareOrderItems = useCallback(() => {
    return cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));
  }, [cart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      const orderItems = prepareOrderItems();
      
      // Validation des stocks
      const stocksValid = await validateCartStocks(orderItems);
      if (!stocksValid) {
        throw new Error(ERROR_MESSAGES.ORDER.STOCK_VALIDATION_ERROR);
      }

      // Création de la commande
      const orderResult = await createOrder({ 
        customerEmail: email, 
        items: orderItems,
        totalAmount: getTotalAmount()
      });

      if (orderResult.success) {
        await clearCart();
        navigate('/order-confirmation', { 
          state: { 
            orderId: orderResult.orderId,
            email: email,
            total: getTotalAmount()
          }
        });
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-form-container">
      <div className="checkout-header">
        <h2>Finaliser la commande</h2>
        {onClose && (
          <button 
            onClick={onClose} 
            className="close-button"
            aria-label="Fermer"
          >
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
            onChange={handleEmailChange}
            placeholder="votre@email.com"
            required
            disabled={isProcessing}
            className={validationErrors.email ? 'error' : ''}
            aria-invalid={!!validationErrors.email}
          />
          {validationErrors.email && (
            <span className="error-message">{validationErrors.email}</span>
          )}
        </div>

        <div className="order-summary">
          <h3>Récapitulatif de la commande</h3>
          {cart.length === 0 ? (
            <p className="empty-cart-message">{ERROR_MESSAGES.CART.EMPTY_CART}</p>
          ) : (
            <ul>
              {cart.map(item => (
                <li key={item.product.id} className="order-item">
                  <span className="item-name">{item.product.name}</span>
                  <span className="item-quantity">x {item.quantity}</span>
                  <span className="item-price">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="total">
            <strong>Total:</strong> {formatPrice(getTotalAmount())}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isProcessing || cart.length === 0}
          className={`submit-button ${isProcessing ? 'processing' : ''}`}
        >
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              Traitement en cours...
            </>
          ) : (
            'Confirmer la commande'
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
