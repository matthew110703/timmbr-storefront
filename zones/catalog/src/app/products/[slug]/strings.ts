export const strings = {
  metadata: {
    title: (product: string) => `${product} | timmbr`,
  },
  breadcrumb: "Breadcrumb",
  home: "Home",
  productId: (sku: string) => `Product ID: ${sku}`,
  by: "by",
  taxNote: "MRP incl. of all taxes",
  discount: (percent: number) => `${percent}% Off`,
  clearance: "Clearance sale",
  stock: {
    low: (n: number) => `Please hurry! Only ${n} left in stock`,
    out: "Out of stock",
    outHint:
      "This option is sold out. Pick another option, or check back soon.",
  },
  picker: {
    outOfStock: "Out of stock",
    unavailable: "Unavailable",
  },
  quantity: {
    group: "Quantity",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
  },
  addToCart: "Add to cart",
  adding: "Adding…",
  soldOut: "Sold out",
  goToCart: "Go to cart",
  inCart: (n: number) => `${n} in your cart`,
  addMore: "Add more",
  added: {
    title: "Added to cart",
    description: (title: string, quantity: number) =>
      quantity > 1 ? `${quantity} × ${title}` : title,
    viewCart: "View cart",
  },
  errors: {
    outOfStock: (available: number) =>
      available > 0
        ? `Only ${available} left. Lower the quantity to add it.`
        : "This option just sold out. Pick another option.",
    limit: (max: number) => `You can add up to ${max} of this item.`,
    unavailable: "This item can't be added right now.",
    generic: "Couldn't add to cart. Please try again.",
  },
  wishlist: {
    add: "Save to wishlist",
    remove: "Remove from wishlist",
    added: "Saved to your wishlist",
    removed: "Removed from your wishlist",
    failed: "Couldn't update your wishlist. Please try again.",
  },
  delivery: {
    fast: { lead: "Fast delivery: ships within", value: "24–48 hours" },
    standard: { lead: "Ships within", value: "5–7 days" },
  },
  /** Used when the CMS "pdp-trust" section is missing or unreachable. */
  trust: {
    items: [
      { icon: "shipping", label: "Free shipping*" },
      { icon: "warranty", label: "60 months warranty*" },
      { icon: "installation", label: "Free installation*" },
      { icon: "emi", label: "No-cost EMI" },
    ],
    note: "*On orders above ₹10,000. Warranty covers manufacturing defects.",
  },
  sections: {
    description: "Description",
    specifications: "Specifications",
    care: "Care & warranty",
    careBody: [
      "Dust with a soft, dry cloth; wipe spills straight away.",
      "Keep out of direct sunlight and away from heat sources to protect the finish.",
      "Solid wood breathes: small changes with the seasons are natural, not defects.",
    ],
  },
  similar: "You may also like",
  recentlyViewed: "Recently viewed",
  gallery: {
    gallery: "Product images",
    previous: "Previous image",
    next: "Next image",
    close: "Close",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
  },
  mobileBar: "Buy",
  card: {
    options: "1+ Options",
    outOfStock: "Out of stock",
  },
} as const;
