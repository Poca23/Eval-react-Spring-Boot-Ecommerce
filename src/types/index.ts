// src/types/index.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  image_url: string;
}

export interface Order {
  id: number;
  email: string;
  date: string; // TIMESTAMP from DB
  status: string;
  items?: OrderItem[]; // Optional pour les cas où on ne charge pas les items
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  product?: Product; // Optional pour les cas où on veut les détails du produit
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderRequest {
  email: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
  totalAmount?: number; // Optional, peut être calculé côté serveur
}

// Ajoutons aussi l'interface pour les props de OrderList
export interface OrderListProps {
  orders: Order[];
}

export interface OrderDisplay extends Omit<Order, "items"> {
  items: OrderItemDisplay[];
}

export interface OrderItemDisplay extends OrderItem {
  name: string;
  price: number;
}

export interface StockItem {
  product_id: number;
  quantity: number;
}

export type ErrorMessage = string | null;

export type ErrorSeverity = "error" | "warning" | "success" | "info";

export interface ErrorContextType {
  error: ErrorMessage;
  severity: ErrorSeverity;
  setError: (message: ErrorMessage, severity?: ErrorSeverity) => void;
  clearError: () => void;
}
