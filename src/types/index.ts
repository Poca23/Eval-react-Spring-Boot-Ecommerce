// src/types/index.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderRequest {
  customerEmail: string;
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
}
