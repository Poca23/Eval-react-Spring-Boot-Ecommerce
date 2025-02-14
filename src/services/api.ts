import { API_URL } from "../config/api.config";

// Interfaces
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  description: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
}

export interface OrderRequest {
  email: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export interface Order {
  items: any;
  id: number;
  email: string;
  date: string;
  status: string;
}

// Fonction utilitaire pour gérer les erreurs de réponse
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message || getDefaultErrorMessage(response.status);
    throw new Error(errorMessage);
  }
  return response.json();
};

// Messages d'erreur par défaut selon le code HTTP
const getDefaultErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return "Requête invalide";
    case 401:
      return "Non autorisé";
    case 403:
      return "Accès refusé";
    case 404:
      return "Ressource non trouvée";
    case 500:
      return "Erreur serveur";
    default:
      return "Une erreur est survenue";
  }
};

// API methods
export const api = {
  getOrders: async (emailFilter?: string): Promise<Order[]> => {
    try {
      const response = await fetch(
        `${API_URL}/orders${emailFilter ? `?email=${emailFilter}` : ""}`
      );
      return handleResponse(response);
    } catch (error) {
      throw new Error("Impossible de récupérer les commandes");
    }
  },

  async getProduct(id: number): Promise<Product> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      return handleResponse(response);
    } catch (error) {
      throw new Error(`Impossible de récupérer le produit #${id}`);
    }
  },

  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products`);
      return handleResponse(response);
    } catch (error) {
      throw new Error("Impossible de récupérer la liste des produits");
    }
  },

  createOrder: async (orderRequest: OrderRequest): Promise<Order> => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderRequest),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error("Impossible de créer la commande");
    }
  },

  updateProductStock: async (
    productId: number,
    newStock: number
  ): Promise<Product> => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: newStock }),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(
        `Impossible de mettre à jour le stock du produit #${productId}`
      );
    }
  },

  checkProductStock: async (
    productId: number,
    quantity: number
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_URL}/products/${productId}/stock?quantity=${quantity}`
      );
      return handleResponse(response);
    } catch (error) {
      throw new Error("Impossible de vérifier le stock");
    }
  },
};
