import { Product, Order, OrderRequest } from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export const api = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return response.json();
  },

  getOrders: async (emailFilter?: string): Promise<Order[]> => {
    const url = emailFilter
      ? `${API_URL}/orders/search?email=${encodeURIComponent(emailFilter)}`
      : `${API_URL}/orders`;
    const response = await fetch(url);
    return response.json();
  },

  createOrder: async (orderData: OrderRequest): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    return response.json();
  },

  checkProductStock: async (
    productId: number,
    quantity: number
  ): Promise<boolean> => {
    const response = await fetch(
      `${API_URL}/products/${productId}/check-stock?quantity=${quantity}`
    );
    return response.json();
  },

  updateProductStock: async (
    productId: number,
    quantity: number
  ): Promise<void> => {
    await fetch(`${API_URL}/products/${productId}/stock`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
  },
};

// Pour la compatibilité avec les tests
export const fetchProducts = api.getAllProducts;
