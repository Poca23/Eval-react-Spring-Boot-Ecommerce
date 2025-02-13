// src/services/stockService.ts
import { api } from "./api";

interface StockItem {
  product_id: number;
  quantity: number;
}

export const stockService = {
  /**
   * Vérifie si un produit a suffisamment de stock
   */
  checkStock: async (
    product_id: number,
    quantity: number
  ): Promise<boolean> => {
    try {
      return await api.checkProductStock(product_id, quantity);
    } catch (error) {
      console.error("Erreur de vérification du stock:", error);
      return false;
    }
  },

  /**
   * Met à jour le stock d'un produit
   */
  updateStock: async (
    product_id: number,
    newStock: number
  ): Promise<boolean> => {
    try {
      await api.updateProductStock(product_id, newStock);
      return true;
    } catch (error) {
      console.error("Erreur de mise à jour du stock:", error);
      return false;
    }
  },

  /**
   * Vérifie les stocks pour plusieurs produits en même temps
   */
  checkMultipleStocks: async (items: StockItem[]): Promise<boolean> => {
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
