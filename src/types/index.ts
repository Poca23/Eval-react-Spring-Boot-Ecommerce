export interface Product {
    stock: number;
    imageUrl: string | undefined;
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
  }
  
  export interface Order {
    id: number;
    items: CartItem[];
    total: number;
    date: string;
  }
  