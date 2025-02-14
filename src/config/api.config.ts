export interface ApiHeaders {
  [key: string]: string | undefined;
  "Content-Type": string;
  Accept: string;
  Authorization?: string;
}

export const API_CONFIG = {
  BASE_URL: "http://localhost:8080",
  FRONTEND_URL: "http://localhost:3000",
  ENDPOINTS: {
    PRODUCTS: "/api/products",
    ORDERS: "/api/orders",
    STOCK: "/api/stock",
    AUTH: "/api/auth",
  },
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  } as ApiHeaders,
};
