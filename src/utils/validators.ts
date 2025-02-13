// src/utils/validators.ts
import { OrderRequest, Product, CartItem, Order, OrderItem } from "../types";
import { ERROR_MESSAGES } from "./errorMessages";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL);
    }
    return true;
  },

  quantity: (quantity: number, stock: number): boolean => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_QUANTITY);
    }
    if (quantity > stock) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.INSUFFICIENT_STOCK);
    }
    return true;
  },

  price: (price: number): boolean => {
    if (!Number.isFinite(price) || price <= 0) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_PRICE);
    }
    return true;
  },

  stock: (stock: number): boolean => {
    if (!Number.isInteger(stock) || stock < 0) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_STOCK);
    }
    return true;
  },

  product: (product: Product): boolean => {
    if (!product.id || product.id <= 0) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_PRODUCT_ID);
    }
    if (!product.name.trim()) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_PRODUCT_NAME);
    }
    validators.price(product.price);
    validators.stock(product.stock);
    // Validation de l'URL de l'image
    if (product.image_url && !validators.url(product.image_url)) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_IMAGE_URL);
    }
    return true;
  },

  cartItem: (item: CartItem): boolean => {
    validators.product(item.product);
    validators.quantity(item.quantity, item.product.stock);
    return true;
  },

  orderRequest: (request: OrderRequest): boolean => {
    validators.email(request.email);

    if (!request.items?.length) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.EMPTY_ORDER);
    }

    request.items.forEach((item) => {
      if (item.product_id <= 0) {
        throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_PRODUCT_ID);
      }
      validators.quantity(item.quantity, Infinity);
    });

    if (request.totalAmount !== undefined) {
      validators.price(request.totalAmount);
    }

    return true;
  },

  order: (order: Order): boolean => {
    validators.email(order.email);
    // Validation du status
    if (!["PENDING", "CONFIRMED", "CANCELLED"].includes(order.status)) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_ORDER_STATUS);
    }
    // Validation de la date
    if (!validators.date(order.date)) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_DATE);
    }
    return true;
  },

  orderItem: (item: OrderItem): boolean => {
    if (item.order_id <= 0) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_ORDER_ID);
    }
    if (item.product_id <= 0) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_PRODUCT_ID);
    }
    validators.quantity(item.quantity, Infinity);
    return true;
  },

  cart: (items: CartItem[]): boolean => {
    if (!items.length) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.EMPTY_CART);
    }
    items.forEach((item) => validators.cartItem(item));
    return true;
  },

  // Nouvelles méthodes utilitaires
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  date: (date: string): boolean => {
    const timestamp = Date.parse(date);
    return !isNaN(timestamp);
  },

  required: (value: string | number): boolean => {
    if (typeof value === "string" && !value.trim()) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD);
    }
    if (value === undefined || value === null) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD);
    }
    return true;
  },

  numberInRange: (value: number, min: number, max: number): boolean => {
    if (value < min || value > max) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.NUMBER_OUT_OF_RANGE);
    }
    return true;
  },
};
