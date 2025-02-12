// src/hooks/useCart.ts
import { useProducts } from './useProducts';

export function useCart() {
  // ... code existant
  const { checkStock } = useProducts();
  const [stockError, setStockError] = useState<string | null>(null);

  const addToCart = async (product: Product, quantity: number = 1) => {
    setStockError(null);
    
    // Vérifier le stock avant d'ajouter au panier
    const isStockAvailable = await checkStock(product.id, quantity);
    if (!isStockAvailable) {
      setStockError(`Stock insuffisant pour ${product.name}`);
      return false;
    }

    // ... reste du code existant pour addToCart
    return true;
  };

  return {
    // ... retours existants
    stockError,
  };
}
