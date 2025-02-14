// src/components/cart/CheckoutForm.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useCart } from '../../hooks/useCart';
import { useStock } from '../../hooks/useStock';
import { useError } from '../../contexts/ErrorContext';
import { OrderRequest, CartItem } from '../../types';
import '../../styles/index.css';

interface CheckoutFormProps {
  onClose?: () => void;
  disabled?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { setError } = useError();
  const { createOrder } = useOrders();
  const { cart, clearCart } = useCart();
  const { validateCartStocks } = useStock();
  const navigate = useNavigate();

  // Validation de l'email
  const validateEmail = useCallback((email: string): boolean => {
    if (!email || !EMAIL_REGEX.test(email)) {
      setError("Veuillez entrer une adresse email valide", "warning");
      return false;
    }
    return true;
  }, [setError]);

  // Validation du formulaire
  const validateForm = useCallback((): boolean => {
    if (!validateEmail(email)) return false;

    if (cart.length === 0) {
      setError("Votre panier est vide", "warning");
      return false;
    }

    return true;
  }, [email, cart.length, validateEmail, setError]);

  // Calcul du total avec mémoization
  const total = useMemo(() => 
    cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  // Gestion de la soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      // Préparation de la commande
      const orderRequest: OrderRequest = {
        email,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        })),
        totalAmount: total
      };

      // Vérification des stocks
      const stockItems = cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }));

      const stocksValid = await validateCartStocks(stockItems);
      if (!stocksValid) {
        throw new Error("Certains produits ne sont plus disponibles en stock");
      }

      // Création de la commande
      const result = await createOrder(orderRequest);
      
      if (result?.id) {
        await clearCart(); // Vider le panier après une commande réussie
        setError("Commande créée avec succès!", "success");
        navigate('/order-confirmation', { 
          state: { 
            orderId: result.id,
            email: result.email,
            status: result.status
          }
        });
      } else {
        throw new Error("Erreur lors de la création de la commande");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création de la commande",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Affichage du détail d'un article
  const renderOrderItem = useCallback((item: CartItem) => (
    <li key={item.product.id} className="order-item">
      <span className="item-name">{item.product.name}</span>
      <span className="item-quantity">x {item.quantity}</span>
      <span className="item-price">
        {(item.product.price * item.quantity).toFixed(2)}€
      </span>
    </li>
  ), []);

  return (
    <div className="checkout-form-container">
      <div className="checkout-header">
        <h2>Finaliser la commande</h2>
        {onClose && (
          <button 
            onClick={onClose} 
            className="close-button"
            disabled={isProcessing}
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            disabled={isProcessing}
            className={!validateEmail(email) && email ? 'invalid' : ''}
          />
        </div>

        <div className="order-summary">
          <h3>Récapitulatif de la commande</h3>
          <ul>
            {cart.map(renderOrderItem)}
          </ul>
          <div className="total">
            <strong>Total:</strong> {total.toFixed(2)}€
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isProcessing || cart.length === 0 || !email}
          className="submit-button"
        >
          {isProcessing ? 'Traitement en cours...' : 'Confirmer la commande'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
