/**
 * timmbr-core response shapes used by the checkout zone (data inside the `{ success, data }`
 * envelope). Mirrors core's DTOs; keep in sync. Prices in the cart are Decimal strings.
 */

export interface CartLine {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  currency: string;
  thumbnail: string | null;
  attributes?: Record<string, string>;
  /** False when the variant was withdrawn or is out of stock. */
  isAvailable: boolean;
  availableQuantity: number;
}

/** GET /cart */
export interface Cart {
  id: string | null;
  items: CartLine[];
  subtotal: string;
  grandTotal: string;
  currency: string;
}

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
  label: string;
  isDefault: boolean;
}

/** GET /orders/:id (the part the confirmation page shows) */
export interface Order {
  id: string;
  status: string;
  grandTotal: number;
  currency: string;
  placedAt: string | null;
  items: { id: string; name: string; quantity: number }[];
}

/** One wishlist entry, as the Saved for later list needs it (GET /wishlist). */
export interface SavedItem {
  variantId: string;
  productId: string;
  product: { title: string; slug: string };
  variant: { price: number; currency: string; compareAtPrice: number | null };
  thumbnail: string | null;
  isAvailable: boolean;
}

/** GET /wishlist */
export interface Wishlist {
  items: SavedItem[];
}
