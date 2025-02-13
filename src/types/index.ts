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
  date: string;  // Pour le TIMESTAMP
  status: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
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
}
