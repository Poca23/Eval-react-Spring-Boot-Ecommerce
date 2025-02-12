// src/components/cart/CartItem.tsx
import React, { useState, useEffect } from 'react';
import { CartItem as CartItemType } from '../../types';
import { useStock } from '../../hooks/useStock';

interface Props {
    item: CartItemType;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

const CartItem: React.FC<Props> = ({ item, onUpdateQuantity, onRemove }) => {
    const { checkProductStock, loading } = useStock();
    const [stockWarning, setStockWarning] = useState(false);

    useEffect(() => {
        const validateStock = async () => {
            const isAvailable = await checkProductStock(item.product.id, item.quantity);
            setStockWarning(!isAvailable);
        };
        validateStock();
    }, [item.quantity, item.product.id, checkProductStock]);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between border p-4 rounded">
                <div className="flex items-center space-x-4">
                    <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-gray-600">{item.product.price} €</p>
                        <p className="text-sm text-gray-500">
                            Stock disponible: {item.product.stock}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-4">
                    <input
                        type="number"
                        min="1"
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={async (e) => {
                            const newQuantity = Number(e.target.value);
                            const isAvailable = await checkProductStock(item.product.id, newQuantity);
                            if (isAvailable && newQuantity <= item.product.stock) {
                                onUpdateQuantity(item.product.id, newQuantity);
                            }
                        }}
                        className={`w-20 border rounded px-2 py-1 ${
                            stockWarning ? 'border-red-500' : ''
                        }`}
                        disabled={loading}
                    />
                    <button
                        onClick={() => onRemove(item.product.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={loading}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
            
            {stockWarning && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    Stock insuffisant pour la quantité demandée
                </div>
            )}
        </div>
    );
};

export default CartItem;
