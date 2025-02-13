// src/components/cart/CartItem.tsx
import React, { useState, useEffect } from 'react';
import { CartItem as CartItemType } from '../../types';
import { useStock } from '../../hooks/useStock';
import { useError } from '../../contexts/ErrorContext';
import { handleApiError } from '../../utils/errorHandler';
import '../../styles/index.css'
interface Props {
    item: CartItemType;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

const CartItem: React.FC<Props> = ({ item, onUpdateQuantity, onRemove }) => {
    const { checkProductStock, loading } = useStock();
    const { setError } = useError();
    const [stockWarning, setStockWarning] = useState(false);

    useEffect(() => {
        const validateStock = async () => {
            try {
                const isAvailable = await checkProductStock(item.product.id, item.quantity);
                setStockWarning(!isAvailable);
            } catch (err) {
                setError(handleApiError(err));
            }
        };
        validateStock();
    }, [item.quantity, item.product.id, checkProductStock, setError]);

    const handleQuantityChange = async (newQuantity: number) => {
        try {
            const isAvailable = await checkProductStock(item.product.id, newQuantity);
            if (isAvailable && newQuantity <= item.product.stock) {
                await onUpdateQuantity(item.product.id, newQuantity);
            } else {
                setError('Stock insuffisant pour la quantité demandée');
            }
        } catch (err) {
            setError(handleApiError(err));
        }
    };

    return (
        <div className="cart-item">
            <div className="cart-item-content">
                <div className="item-details">
                    <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="item-image"
                    />
                    <div className="item-info">
                        <h3>{item.product.name}</h3>
                        <p className="item-price">{item.product.price} €</p>
                        <p className="stock-info">
                            Stock disponible: {item.product.stock}
                        </p>
                    </div>
                </div>
                
                <div className="item-actions">
                    <input
                        type="number"
                        min="1"
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(Number(e.target.value))}
                        className={`quantity-input ${stockWarning ? 'warning' : ''}`}
                        disabled={loading}
                    />
                    <button
                        onClick={() => onRemove(item.product.id)}
                        className="remove-button"
                        disabled={loading}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
            
            {stockWarning && (
                <div className="stock-warning">
                    Stock insuffisant pour la quantité demandée
                </div>
            )}
        </div>
    );
};

export default CartItem;
