import { API_CONFIG } from "../config/api.config";
import { Product, Order, OrderRequest } from "../types";

export const api = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProduct: async (id: number): Promise<Product> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  getOrders: async (emailFilter?: string): Promise<Order[]> => {
    try {
      const url = emailFilter
        ? `${API_CONFIG.BASE_URL}${
            API_CONFIG.ENDPOINTS.ORDERS
          }/search?email=${encodeURIComponent(emailFilter)}`
        : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  createOrder: async (orderData: OrderRequest): Promise<Order> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  checkProductStock: async (
    productId: number,
    quantity: number
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}/check-stock?quantity=${quantity}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.error(`Stock check failed with status: ${response.status}`);
        return false;
      }
      return await response.json();
    } catch (error) {
      console.error("Error checking stock:", error);
      return false;
    }
  },

  updateProductStock: async (
    productId: number,
    quantity: number
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}/stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ quantity }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  },
};

export const fetchProducts = api.getAllProducts;
