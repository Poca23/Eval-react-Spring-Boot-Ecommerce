export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  image_url: string;
}

export type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

export interface Order {
  id: number;
  userId: number; // Changed from user_id
  status: OrderStatus;
  date: string;
  email: string;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
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
  totalAmount?: number;
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
}

export interface OrderListProps {
  orders: Order[];
  onOrderSelect?: (order: Order) => void;
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

export interface OrderConfirmation {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  userId: string;
  orderDate?: string;
  status?: OrderStatus;
  totalAmount?: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}
export interface PaymentDetails {
  method: PaymentMethod;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  paypalEmail?: string;
  billingAddress?: ShippingAddress;
}

export type PaymentMethod = "card" | "paypal" | "bank_transfer";

export type ErrorMessage = string | null;

export type ErrorSeverity = "error" | "warning" | "success" | "info";

export interface ErrorContextType {
  error: ErrorMessage;
  severity: ErrorSeverity;
  setError: (message: ErrorMessage, severity?: ErrorSeverity) => void;
  clearError: () => void;
  handleError: (error: unknown, defaultMessage?: string) => void;
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  token?: string;
}

export type UserRole = "USER" | "ADMIN";

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateUser?: (userData: Partial<User>) => Promise<void>;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  validation?: ValidationError[];
  status: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: number) => Promise<boolean>;
  updateQuantity: (productId: number, newQuantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  total: number;
  getTotal: () => number;
  getItemCount: () => number;
  confirmOrder: (
    shippingAddress: ShippingAddress,
    paymentDetails: PaymentDetails
  ) => Promise<boolean>;
  isProcessingOrder: boolean;
  orderConfirmed: boolean;
}

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface ProductFilters {
  apply: (products: Product[], options: FilterOptions) => Product[];
  reset: () => void;
}
