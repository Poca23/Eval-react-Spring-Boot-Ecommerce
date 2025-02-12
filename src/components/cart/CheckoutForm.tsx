// src/components/cart/CheckoutForm.tsx

import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CheckoutForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation de l'email
    if (!validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    // Validation du panier
    if (cart.length === 0) {
      setError('Votre panier est vide');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderData = {
        email,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande');
      }

      // Succès
      clearCart();
      navigate('/order-confirmation');
    } catch (error) {
      setError('Une erreur est survenue lors de la création de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-form">
      <h2>Finaliser la commande</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="votre@email.com"
          />
        </div>

        <div className="order-summary">
          <p>Total de la commande : {total.toFixed(2)}€</p>
          <p>Nombre d'articles : {cart.length}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Traitement en cours...' : 'Confirmer la commande'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
