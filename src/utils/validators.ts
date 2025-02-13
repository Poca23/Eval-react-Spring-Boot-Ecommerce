// src/utils/validators.ts
import { OrderRequest, Product, CartItem } from "../types";
import '../../styles/index.css';


export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  quantity: (quantity: number, stock: number): boolean => {
    return quantity > 0 && Number.isInteger(quantity) && quantity <= stock;
  },

  price: (price: number): boolean => {
    return price > 0 && Number.isFinite(price);
  },

  stock: (stock: number): boolean => {
    return stock >= 0 && Number.isInteger(stock);
  },

  product: (product: Product): boolean => {
    return (
      product.id > 0 &&
      product.name.trim().length > 0 &&
      validators.price(product.price) &&
      validators.stock(product.stock)
    );
  },

  cartItem: (item: CartItem, availableStock: number): boolean => {
    return (
      validators.product(item.product) &&
      validators.quantity(item.quantity, availableStock)
    );
  },

  orderRequest: (request: OrderRequest): boolean => {
    return (
      validators.email(request.customerEmail) &&
      request.items.length > 0 &&
      request.items.every(
        (item) =>
          item.productId > 0 &&
          validators.quantity(item.quantity, Infinity) &&
          validators.price(item.price)
      ) &&
      validators.price(request.totalAmount)
    );
  },

  // Validation spécifique pour le panier
  cart: (items: CartItem[]): boolean => {
    return items.every(
      (item) =>
        validators.product(item.product) &&
        validators.quantity(item.quantity, item.product.stock)
    );
  },

  // Validation du montant total
  totalAmount: (items: CartItem[]): boolean => {
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    return validators.price(total);
  },

  // Helpers pour la validation des champs requis
  required: (value: string | number): boolean => {
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    return value !== undefined && value !== null;
  },

  // Validation des limites numériques
  numberInRange: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  },
};
