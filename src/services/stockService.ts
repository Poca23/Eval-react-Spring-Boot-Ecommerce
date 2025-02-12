// src/services/stockService.ts
import { api } from './api';

export const stockService = {
  /**
   * Vérifie si un produit a suffisamment de stock
   */
  checkStock: async (productId: number, quantity: number): Promise<boolean> => {
    try {
      const response = await fetch(`${api.baseUrl}/products/${productId}/check-stock?quantity=${quantity}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la vérification du stock');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur de vérification du stock:', error);
      return false;
    }
  },

  /**
   * Met à jour le stock d'un produit
   */
  updateStock: async (productId: number, newStock: number): Promise<boolean> => {
    try {
      const response = await fetch(`${api.baseUrl}/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: newStock }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du stock');
      }
      
      return true;
    } catch (error) {
      console.error('Erreur de mise à jour du stock:', error);
      return false;
    }
  },

  /**
   * Vérifie les stocks pour plusieurs produits en même temps
   */
  checkMultipleStocks: async (items: { productId: number; quantity: number }[]): Promise<boolean> => {
    try {
      for (const item of items) {
        const isAvailable = await stockService.checkStock(item.productId, item.quantity);
        if (!isAvailable) return false;
      }
      return true;
    } catch (error) {
      console.error('Erreur de vérification multiple des stocks:', error);
      return false;
    }
  }
};
