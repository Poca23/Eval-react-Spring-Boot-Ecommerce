// src/components/cart/CheckoutForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrder';
import { useCart } from '../../hooks/useCart';
import { useStock } from '../../hooks/useStock';
import './CheckoutForm.css';

const CheckoutForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { createOrder, loading: orderLoading, error: orderError } = useOrder();
  const { cart } = useCart();
  const { validateCartStocks, loading: stockLoading } = useStock();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Veuillez entrer une adresse email valide');
      return;
    }

    if (cart.length === 0) {
      setEmailError('Votre panier est vide');
      return;
    }

    const cartItems = cart.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    const stocksValid = await validateCartStocks(cartItems);
    if (!stocksValid) {
      setEmailError('Certains produits ne sont plus disponibles en quantité suffisante');
      return;
    }

    const success = await createOrder(email);
    if (success) {
      navigate('/order-confirmation');
    }
  };

  const loading = orderLoading || stockLoading;

  return (
    <div className="checkout-form-container">
      <h2>Finaliser la commande</h2>
      
      {(orderError || emailError) && (
        <div className="error-message">{orderError || emailError}</div>
      )}
      
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            placeholder="votre@email.com"
            required
            disabled={loading}
          />
        </div>

        <div className="order-summary">
          <h3>Récapitulatif de la commande</h3>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.name} x {item.quantity} = {(item.price * item.quantity).toFixed(2)}€
              </li>
            ))}
          </ul>
          <div className="total">
            Total: {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}€
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || cart.length === 0}
          className="submit-button"
        >
          {loading ? 'Traitement...' : 'Confirmer la commande'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
