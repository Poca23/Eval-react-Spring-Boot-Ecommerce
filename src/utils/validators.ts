// src/utils/validators.ts
import { OrderRequest, Product, CartItem } from "../types";
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
    return true;
  },

  cartItem: (item: CartItem, availableStock: number): boolean => {
    validators.product(item.product);
    validators.quantity(item.quantity, availableStock);
    return true;
  },

  orderRequest: (request: OrderRequest): boolean => {
    validators.email(request.customerEmail);

    if (!request.items.length) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.EMPTY_ORDER);
    }

    request.items.forEach((item) => {
      if (item.productId <= 0) {
        throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_PRODUCT_ID);
      }
      validators.quantity(item.quantity, Infinity);
      validators.price(item.price);
    });

    validators.price(request.totalAmount);
    return true;
  },

  cart: (items: CartItem[]): boolean => {
    items.forEach((item) => {
      validators.cartItem(item, item.product.stock);
    });
    return true;
  },

  totalAmount: (items: CartItem[]): boolean => {
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    return validators.price(total);
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
