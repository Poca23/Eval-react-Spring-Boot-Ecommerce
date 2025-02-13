// src/services/stockService.ts
import { api } from "./api";

export const stockService = {
  /**
   * Vérifie si un produit a suffisamment de stock
   */
  checkStock: async (productId: number, quantity: number): Promise<boolean> => {
    try {
      return await api.checkProductStock(productId, quantity);
    } catch (error) {
      console.error("Erreur de vérification du stock:", error);
      return false;
    }
  },

  /**
   * Met à jour le stock d'un produit
   */
  updateStock: async (
    productId: number,
    newStock: number
  ): Promise<boolean> => {
    try {
      await api.updateProductStock(productId, newStock);
      return true;
    } catch (error) {
      console.error("Erreur de mise à jour du stock:", error);
      return false;
    }
  },

  /**
   * Vérifie les stocks pour plusieurs produits en même temps
   */
  checkMultipleStocks: async (
    items: { product_id: number; quantity: number }[]
  ): Promise<boolean> => {
    try {
      for (const item of items) {
        const isAvailable = await stockService.checkStock(
          item.product_id,
          item.quantity
        );
        if (!isAvailable) return false;
      }
      return true;
    } catch (error) {
      console.error("Erreur de vérification multiple des stocks:", error);
      return false;
    }
  },
};
