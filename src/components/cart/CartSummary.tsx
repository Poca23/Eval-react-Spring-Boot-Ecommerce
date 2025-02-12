// src/components/cart/CartSummary.tsx
import React from 'react';

interface Props {
    total: number;
    onClearCart: () => void;
    onCheckout: () => void;
}

const CartSummary: React.FC<Props> = ({ total, onClearCart, onCheckout }) => {
    return (
        <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Total:</span>
                <span className="text-xl">{total} €</span>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={onClearCart}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Vider le panier
                </button>
                <button
                    onClick={onCheckout}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Commander
                </button>
            </div>
        </div>
    );
};

export default CartSummary;
