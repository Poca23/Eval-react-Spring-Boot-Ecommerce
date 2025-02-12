// src/components/products/ProductCard.tsx
import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (quantity > 0 && quantity <= product.stock) {
            addToCart(product, quantity);
            setQuantity(1); // Reset après ajout
        }
    };

    return (
        <div className="border rounded-lg p-4 shadow-sm">
            <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-48 object-cover rounded"
            />
            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
            <p className="text-gray-600">{product.price} €</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            
            <div className="mt-2 flex items-center gap-2">
                <label htmlFor={`quantity-${product.id}`} className="sr-only">Quantity</label>
                <input
                    id={`quantity-${product.id}`}
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="Qty"
                    className="w-20 border rounded px-2 py-1"
                />
                <button
                    onClick={handleAddToCart}
                    disabled={quantity > product.stock}
                    className="bg-blue-500 text-white px-4 py-2 rounded 
                             hover:bg-blue-600 disabled:bg-gray-400"
                >
                    Ajouter au panier
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
