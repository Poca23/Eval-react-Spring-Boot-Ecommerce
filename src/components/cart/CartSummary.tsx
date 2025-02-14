import React from 'react';
import { useError } from '../../contexts/ErrorContext';
import { handleApiError } from '../../utils/errorHandler';
import '../../styles/index.css'

interface Props {
    total: number;
    onClearCart: () => Promise<void>;
    onCheckout: () => void;
    disabled?: boolean;
}

const CartSummary: React.FC<Props> = ({ total, onClearCart, onCheckout, disabled }) => {
    const { setError } = useError();

    const handleClearCart = async () => {
        try {
            await onClearCart();
        } catch (err) {
            setError(handleApiError(err));
        }
    };

    const handleCheckout = async () => {
        try {
            await onCheckout();
        } catch (err) {
            setError(handleApiError(err));
        }
    };

    return (
        <div className="cart-summary">
            <div className="total-section">
                <span className="total-label">Total:</span>
                <span className="total-amount">{total.toFixed(2)} €</span>
            </div>

            <div className="action-buttons">
                <button
                    onClick={handleClearCart}
                    className="clear-cart-button"
                    disabled={disabled}
                >
                    Vider le panier
                </button>
                <button
                    onClick={handleCheckout}
                    className="checkout-button"
                    disabled={disabled}
                >
                    Commander
                </button>
            </div>
        </div>
    );
};

export default CartSummary;
