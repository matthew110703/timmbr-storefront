export const strings = {
  metadata: {
    title: "timmbr | Checkout",
    description: "Review your order and pay securely.",
  },
  appName: "Checkout",
  branding: {
    logoAlt: "timmbr - Solid Wood Furniture",
    miniLogoAlt: "timmbr leaf icon",
  },
  header: {
    secure: "Secure checkout",
    actions: {
      account: {
        href: "/account",
        /** Signed-in menu (desktop); "Log out" is added by @timmbr/auth. */
        menu: [
          { id: "orders", label: "My orders", href: "/account/orders" },
          { id: "account", label: "Your account", href: "/account/security" },
        ],
      },
    },
  },
  loading: {
    message: "Loading...",
  },
  notFound: {
    title: "Page Not Found",
    description: "The requested checkout page does not exist.",
    ctaHome: "Return to Home",
  },
  error: {
    title: "Something went wrong",
    description: "An unexpected error occurred in the checkout zone.",
    retry: "Try Again",
  },
  empty: {
    title: "Your cart is empty",
    description: "Add something you love and come back to check out.",
    cta: "Continue shopping",
    ctaHref: "/products",
  },
  steps: {
    cart: {
      title: "Cart",
      countLabel: (count: number) =>
        `${count} ${count === 1 ? "item" : "items"} in your cart`,
      summary: (count: number, total: string) =>
        `${count} ${count === 1 ? "item" : "items"} · ${total}`,
    },
    delivery: {
      title: "Delivery",
      missing: "Add a delivery address",
      summary: (name: string, place: string) => `${name} · ${place}`,
    },
    pay: {
      title: "Payment",
      summary: (method: string) => `Pay with ${method}`,
    },
    next: {
      delivery: "Continue to delivery",
      pay: "Continue to payment",
    },
    edit: "Edit",
  },
  cart: {
    quantityGroup: (name: string) => `Quantity of ${name}`,
    quantity: {
      decrease: "Decrease quantity",
      increase: "Increase quantity",
    },
    removeAria: (name: string) => `Remove ${name} from your cart`,
    remove: "Remove",
    saveForLater: "Save for later",
    saveForLaterAria: (name: string) => `Save ${name} for later`,
    savedToast: "Saved for later",
    unavailable: "No longer available",
    unavailableNotice:
      "Some items can no longer be bought. Remove them or save them for later to continue.",
    onlyLeft: (count: number) => `Only ${count} left`,
    updateFailed: "We could not update your cart. Please try again.",
    outOfStock: (available: number) =>
      available > 0
        ? `Only ${available} available.`
        : "This item is out of stock.",
    quantityLimit: (max: number) => `You can buy at most ${max} of this item.`,
  },
  saved: {
    title: (count: number) => `Saved for later (${count})`,
    moveToCart: "Move to cart",
    moveToCartAria: (name: string) => `Move ${name} to your cart`,
    soldOut: "Out of stock",
    movedToast: "Moved to your cart",
  },
  payment: {
    title: "Pay with",
    chips: {
      upi: "UPI",
      card: "Card",
      netbanking: "Net banking",
      emi: "EMI",
    },
    lastUsed: "Last used",
    note: "You will finish in the secure Razorpay window, where every other method is also available.",
  },
  address: {
    deliverTo: "Deliver To:",
    change: "Change",
    mobile: (phone: string) => `Mobile: ${phone}`,
    pickerTitle: "Choose delivery address",
    pickerDone: "Deliver here",
    addNew: "Add a new address",
    addNewHref: "/account/addresses",
    missingTitle: "Add a delivery address",
    missingDescription: "We need an address to deliver your order.",
    labels: { home: "Home", work: "Work", other: "Other" } as Record<
      string,
      string
    >,
  },
  summary: {
    title: "Order Summary",
    details: "Price details",
    items: (count: number) => `Items (${count})`,
    delivery: "Delivery",
    free: "FREE",
    discount: "Discount",
    tax: (amount: string) => `Includes ${amount} GST`,
    total: "Total Amount",
    quoteFailed: "We could not price your order. Please try again.",
    quoteLoading: "Updating total...",
  },
  pay: {
    button: (amount: string) => `Pay ${amount}`,
    working: "Opening payment...",
    done: "Payment received...",
    verifying: "Confirming payment...",
    retry: "Try again",
    needAddress: "Add a delivery address to pay.",
    secure: "Payments are processed securely by Razorpay.",
    overLimit: (limit: string) =>
      `Orders above ${limit} can't be paid online. Please reduce your cart or split your order.`,
  },
  paymentFailed: {
    title: "Payment not completed",
  },
} as const;

export type CheckoutStrings = typeof strings;
