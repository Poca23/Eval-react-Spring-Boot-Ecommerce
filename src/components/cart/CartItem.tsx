// src/components/cart/CartItem.tsx
import React from 'react';
import { CartItem as CartItemType } from '../../types';

interface Props {
    item: CartItemType;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

const CartItem: React.FC<Props> = ({ item, onUpdateQuantity, onRemove }) => {
    return (
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
                </div>
            </div>
            
            <div className="flex items-center space-x-4">
                <input
                    type="number"
                    min="1"
                    max={item.product.stock}
                    value={item.quantity}
                    onChange={(e) => onUpdateQuantity(item.product.id, Number(e.target.value))}
                    className="w-20 border rounded px-2 py-1"
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
    );
};

export default CartItem;
