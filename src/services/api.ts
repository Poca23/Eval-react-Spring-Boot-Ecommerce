import { API_URL } from "../config/api.config";

export const api = {
  getOrders: async (emailFilter?: string): Promise<Order[]> => {
    const response = await fetch(
      `${API_URL}/orders${emailFilter ? `?email=${emailFilter}` : ""}`
    );
    return response.json();
  },

  // Ajout de la méthode pour récupérer un produit spécifique
  async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Product not found");
    }
    return response.json();
  },

  async getAllProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  },

  createOrder: async (orderRequest: OrderRequest): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderRequest),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors de la création de la commande"
      );
    }

    return response.json();
  },

  updateProductStock: async (
    productId: number,
    newStock: number
  ): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${productId}/stock`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stock: newStock }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors de la mise à jour du stock"
      );
    }

    return response.json();
  },

  checkProductStock: async (
    productId: number,
    quantity: number
  ): Promise<boolean> => {
    const response = await fetch(
      `${API_URL}/products/${productId}/check-stock?quantity=${quantity}`
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la vérification du stock");
    }

    return response.json();
  },
};

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface OrderRequest {
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
}

export interface Order {
  id: number;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}
