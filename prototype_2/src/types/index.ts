export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  featured?: boolean;
  ratings?: number;
  numReviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  _id: string;
  user: string;
  orderItems: CartItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
}