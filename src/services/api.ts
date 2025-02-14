import { API_CONFIG, ApiHeaders } from "../config/api.config";
import {
  Product,
  Order,
  OrderRequest,
  LoginCredentials,
  LoginResponse,
  OrderConfirmation,
} from "../types";

const getHeaders = () => {
  return {
    ...API_CONFIG.headers,
  } as HeadersInit;
};

export const api = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}/login`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(credentials),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  setAuthHeader: (token: string) => {
    const newHeaders: ApiHeaders = {
      ...API_CONFIG.headers,
      Authorization: `Bearer ${token}`,
    };
    API_CONFIG.headers = newHeaders;
  },

  removeAuthHeader: () => {
    const { Authorization, ...restHeaders } = API_CONFIG.headers;
    API_CONFIG.headers = restHeaders as ApiHeaders;
  },

  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`,
        {
          headers: getHeaders(),
        }
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
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`,
        {
          headers: getHeaders(),
        }
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
      const response = await fetch(url, {
        headers: getHeaders(),
      });
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
          headers: getHeaders(),
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

  confirmOrder: async (orderData: OrderConfirmation): Promise<Order> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS}/confirm`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(orderData),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error confirming order:", error);
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
          headers: getHeaders(),
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
          headers: getHeaders(),
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
