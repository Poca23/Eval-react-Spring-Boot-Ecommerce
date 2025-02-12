// src/components/cart/CartItem.tsx
import React from 'react';
import { CartItem as CartItemType } from '../../types';
import { useProducts } from '../../hooks/useProducts';
import { useState, useEffect } from 'react';

interface Props {
    item: CartItemType;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

const CartItem: React.FC<Props> = ({ item, onUpdateQuantity, onRemove }) => {
    const { checkStock } = useProducts();
    const [stockWarning, setStockWarning] = useState(false);

    useEffect(() => {
        const validateStock = async () => {
            const isAvailable = await checkStock(item.product.id, item.quantity);
            setStockWarning(!isAvailable);
        };
        validateStock();
    }, [item.quantity, item.product.id, checkStock]);

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
                        onChange={(e) => {
                            const newQuantity = Number(e.target.value);
                            if (newQuantity <= item.product.stock) {
                                onUpdateQuantity(item.product.id, newQuantity);
                            }
                        }}
                        className={`w-20 border rounded px-2 py-1 ${
                            stockWarning ? 'border-red-500' : ''
                        }`}
                        title="Quantity"
                        placeholder="Enter quantity"
                    />
                    <button
                        onClick={() => onRemove(item.product.id)}
                        className="text-red-500 hover:text-red-700"
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
            
            {item.quantity > item.product.stock && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded">
                    La quantité a été ajustée au stock disponible
                </div>
            )}
        </div>
    );
};

export default CartItem;
