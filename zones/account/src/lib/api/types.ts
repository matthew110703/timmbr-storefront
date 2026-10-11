/**
 * timmbr-core response shapes used by the account zone (data inside the
 * `{ success, data }` envelope). Mirrors core's DTOs; keep in sync.
 */

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

/** GET /user/me */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  emailVerified: boolean;
  hasPassword: boolean;
  linkedProviders: string[];
  lastLoginAt: string | null;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string | null;
  variantId: string | null;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  thumbnail: string | null;
}

export interface Payment {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  provider: string;
  createdAt: string;
}

/** The address as it was when the order was placed (snapshot). */
export interface OrderAddress {
  firstName?: string;
  lastName?: string;
  phone?: string;
  line1?: string;
  line2?: string | null;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  grandTotal: number;
  currency: string;
  shippingAddress: OrderAddress | null;
  placedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  items: OrderItem[];
  payments?: Payment[];
}

export type AddressType = "SHIPPING" | "BILLING" | "BOTH";

/** GET /addresses */
export interface Address {
  id: string;
  fname: string;
  lname: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type: AddressType;
  label: string;
  isDefault: boolean;
  latitude: number | null;
  longitude: number | null;
}

/** POST /addresses, PUT /addresses/:id */
export interface AddressInput {
  fname: string;
  lname: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  label: string;
  isDefault?: boolean;
  /** Optional pin from "Use my current location"; null clears it. */
  latitude?: number | null;
  longitude?: number | null;
}

/** GET /geo/reverse: address fields for a point (empty strings when unknown). */
export interface ReverseGeocode {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  formatted: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  variantId: string;
  product: { id: string; title: string; slug: string; status: string };
  variant: {
    id: string;
    price: number;
    compareAtPrice: number | null;
    currency: string;
    availability: { status: string; quantity: number };
  };
  thumbnail: string | null;
  isAvailable: boolean;
  addedAt: string;
}

/** GET /wishlist */
export interface Wishlist {
  id: string;
  items: WishlistItem[];
  itemCount: number;
}
