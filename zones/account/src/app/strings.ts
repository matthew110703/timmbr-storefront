export const strings = {
  metadata: {
    title: "timmbr | Your account",
    description: "Orders, wishlist, addresses and sign-in settings",
  },
  appName: "Account",
  branding: {
    logoAlt: "timmbr - Solid Wood Furniture",
    miniLogoAlt: "timmbr leaf icon",
  },
  header: {
    search: {
      placeholder:
        "Search solid wood furniture, collections, artisanal pieces...",
      popularTitle: "Popular Searches",
      popularTags: [
        { label: "Dining Tables", href: "/products?category=dining-room" },
        { label: "Teak Chairs", href: "/products?category=living-room" },
        { label: "Solid Wood Beds", href: "/products?category=bedroom" },
        { label: "Outdoor Loungers", href: "/products?category=outdoor" },
        { label: "Artisan Benches", href: "/products?category=collections" },
      ],
    },
    navItems: [
      {
        id: "living-room",
        label: "Living Room",
        href: "/products?category=living-room",
      },
      {
        id: "dining-room",
        label: "Dining Room",
        href: "/products?category=dining-room",
      },
      { id: "bedroom", label: "Bedroom", href: "/products?category=bedroom" },
      { id: "outdoor", label: "Outdoor", href: "/products?category=outdoor" },
      {
        id: "collections",
        label: "Collections",
        href: "/products?category=collections",
      },
    ],
    actions: {
      // Profile labels (LOGIN / first name) come from @timmbr/auth.
      account: {
        href: "/account",
        /** Signed-in menu (desktop); "Log out" is added by @timmbr/auth. */
        menu: [
          { id: "orders", label: "My orders", href: "/account/orders" },
          { id: "account", label: "Your account", href: "/account/security" },
        ],
      },
      wishlist: {
        label: "WISH LIST",
        ariaLabel: "Wishlist",
        href: "/account/wishlist",
      },
      cart: { label: "CART", ariaLabel: "Shopping Cart", href: "/checkout" },
    },
  },

  account: {
    title: "Your account",
    summary: (name: string, contact: string) =>
      contact ? `${name} · ${contact}` : name,
    navLabel: "Account",
    nav: {
      overview: "Overview",
      orders: "My orders",
      wishlist: "Wishlist",
      addresses: "Addresses",
      security: "Login & security",
    },
    logout: "Log out",
    /** Back link on section pages (phones). */
    back: "Account",
    backLabel: "Back to your account",
    overview: {
      title: "Overview",
      sectionsLabel: "Account sections",
      orders: (total: number, pending: number) =>
        total === 0
          ? "No orders yet"
          : `${total} ${total === 1 ? "order" : "orders"}${pending ? ` · ${pending} awaiting payment` : ""}`,
      wishlist: (count: number) =>
        count === 0
          ? "Nothing saved yet"
          : `${count} saved ${count === 1 ? "piece" : "pieces"}`,
      addresses: (count: number, defaultCity?: string) =>
        count === 0
          ? "No saved addresses"
          : `${count} saved${defaultCity ? ` · default in ${defaultCity}` : ""}`,
      security: (hasPassword: boolean, google: boolean) =>
        [
          hasPassword ? "Password set" : "No password yet",
          google ? "Google connected" : null,
        ]
          .filter(Boolean)
          .join(" · "),
    },
  },

  orders: {
    title: "My orders",
    description: "Track, review and find past orders.",
    filtersLabel: "Filter orders",
    filtersScroll: {
      previous: "Show earlier filters",
      next: "Show more filters",
    },
    filters: {
      all: "All",
      pending: "Awaiting payment",
      active: "In progress",
      delivered: "Delivered",
      closed: "Cancelled & returned",
    },
    number: (short: string) => `Order #${short}`,
    placedOn: (date: string) => `Placed ${date}`,
    itemCount: (n: number) => `${n} ${n === 1 ? "item" : "items"}`,
    moreItems: (n: number) => `+ ${n} more`,
    labels: {
      total: "Total",
      shipTo: "Ship to",
      payment: "Payment",
    },
    quantity: (qty: number, unitPrice: string) => `Qty ${qty} × ${unitPrice}`,
    viewDetails: "View details",
    expiresAt: (time: string) => `Awaiting payment · expires ${time}`,
    empty: {
      title: "No orders here yet",
      all: "When you place an order, it will show up here.",
      filtered: "No orders match this filter.",
      cta: "Browse products",
    },
    pagination: {
      label: "Order pages",
      previous: "Previous",
      next: "Next",
      page: (page: number, total: number) => `Page ${page} of ${total}`,
    },
    detail: {
      back: "All orders",
      progress: "Order progress",
      items: "Items",
      summary: "Order summary",
      subtotal: "Subtotal",
      shipping: "Shipping",
      discount: "Discount",
      taxIncluded: (amount: string) => `Includes ${amount} GST`,
      total: "Total",
      free: "Free",
      shippingAddress: "Shipping address",
      paymentStatus: "Payment",
      noPayment: "Not started",
    },
    status: {
      PENDING: "Awaiting payment",
      CONFIRMED: "Confirmed",
      PROCESSING: "Processing",
      SHIPPED: "Shipped",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
      RETURNED: "Returned",
    },
    paymentStatus: {
      PENDING: "Pending",
      PROCESSING: "Processing",
      PAID: "Paid",
      FAILED: "Failed",
      CANCELLED: "Cancelled",
      REFUNDED: "Refunded",
      PARTIALLY_REFUNDED: "Partially refunded",
    },
    tracker: {
      placed: "Placed",
      confirmed: "Confirmed",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      returned: "Returned",
    },
  },

  wishlist: {
    title: "Wishlist",
    description: "Pieces you've saved for later.",
    moveToCart: "Move to cart",
    remove: "Remove",
    removeFrom: (title: string) => `Remove ${title} from your wishlist`,
    unavailable: "Out of stock",
    removed: "Removed from your wishlist",
    moved: "Moved to your cart",
    empty: {
      title: "Your wishlist is empty",
      description: "Tap the heart on any product to save it here.",
      cta: "Browse products",
    },
  },

  addresses: {
    title: "Addresses",
    description: "Where your orders are delivered.",
    add: "Add address",
    edit: "Edit",
    delete: "Delete",
    setDefault: "Set as default",
    default: "Default",
    limitReached: (max: number) =>
      `You can save up to ${max} addresses. Delete one to add another.`,
    labels: { home: "Home", work: "Work", other: "Other" },
    created: "Address added",
    updated: "Address updated",
    deleted: "Address deleted",
    defaultChanged: "Default address updated",
    confirmDelete: {
      title: "Delete this address?",
      description:
        "It will be removed from your saved addresses. This can't be undone.",
      newDefault: "Another address will become your default.",
      confirm: "Delete address",
      cancel: "Cancel",
    },
    actionsFor: (label: string) => `Actions for ${label} address`,
    empty: {
      title: "No saved addresses",
      description: "Add an address to check out faster.",
    },
    form: {
      addTitle: "Add a new address",
      editTitle: "Edit address",
      firstName: "First name",
      lastName: "Last name",
      phone: "Mobile number",
      phoneHint: "10-digit Indian mobile number",
      line1: "Address line 1",
      line1Hint: "House / flat number, building, street",
      line2: "Address line 2 (optional)",
      city: "City",
      state: "State",
      statePlaceholder: "Select a state",
      postalCode: "PIN code",
      label: "Save as",
      makeDefault: "Make this my default address",
      location: {
        title: "Delivery location",
        optional: "Optional",
        hint: "Pin your location so our delivery partner can find you. We can also fill in the address for you.",
        use: "Use my current location",
        locating: "Finding your location…",
        pinned: "Location pinned",
        remove: "Remove pin",
        filled:
          "We filled in the address from your location. Please check it before saving.",
        denied:
          "Location access is blocked. Allow it in your browser settings, or enter the address below.",
        unavailable:
          "We couldn't get your location. Try again, or enter the address below.",
        unsupported:
          "Your browser can't share your location. Enter the address below.",
        lookupFailed:
          "Location pinned, but we couldn't look up the address. Please enter it below.",
      },
      sections: {
        contact: "Contact",
        address: "Address",
      },
      save: "Save address",
      cancel: "Cancel",
      errors: {
        firstName: "Enter a first name (at least 2 letters).",
        lastName: "Enter a last name (at least 2 letters).",
        phone: "Enter a valid 10-digit mobile number starting with 6–9.",
        line1: "Enter the address.",
        city: "Enter the city.",
        state: "Select a state.",
        postalCode: "Enter a valid 6-digit PIN code.",
        tooLong: (max: number) => `Use at most ${max} characters.`,
      },
    },
  },

  security: {
    title: "Login & security",
    description: "Your details, how you sign in, and where you're signed in.",
    profile: {
      title: "Personal details",
      description: "Your name appears on orders and in the header.",
      name: "Name",
      email: "Email",
      phone: "Mobile number",
      notAdded: "Not added",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
      saved: "Name updated",
      nameError: "Enter a name between 3 and 64 characters.",
    },
    password: {
      title: "Password",
      label: "Password",
      setDescription:
        "Changing your password signs you out on every other device.",
      none: "You don't have a password yet. You sign in with a one-time code.",
      noneGoogle:
        "You don't have a password yet. You sign in with Google or a one-time code.",
      statusSet: "Set",
      statusNone: "Not set",
      current: "Current password",
      new: "New password",
      confirm: "Confirm new password",
      hint: "At least 8 characters, with an uppercase letter, a number and a symbol.",
      change: "Change password",
      changeTitle: "Change your password",
      save: "Update password",
      cancel: "Cancel",
      changed: "Password updated. Other devices have been signed out.",
      mismatch: "Passwords don't match.",
      weak: "Use at least 8 characters with an uppercase letter, a number and a symbol.",
      required: "Enter your current password.",
      create: "Create a password",
      createTitle: "Create a password",
      willSendTo: (destination: string) =>
        `To confirm it's you, we'll send a 6-digit code to ${destination}.`,
      sendCode: "Send code",
      sending: "Sending…",
      sentTo: (destination: string) =>
        `We sent a 6-digit code to ${destination}. Enter it below with your new password.`,
      code: "Verification code",
      codeError: "Enter the 6-digit code.",
      resend: "Resend code",
      resendIn: (seconds: number) => `Resend code in ${seconds}s`,
      submitCreate: "Create password",
      created: "Password created. You can now sign in with it.",
    },
    methods: {
      title: "Sign-in methods",
      description: "Ways you can sign in to your account.",
      password: "Password",
      passwordDescription: "Your email or mobile number with your password",
      code: "One-time code",
      codeDescription: "A code sent to your email or mobile number",
      google: "Google",
      googleDescription: "Continue with your Google account",
      connected: "Connected",
      notConnected: "Not connected",
      notSet: "Not set",
      available: "Available",
    },
    sessions: {
      title: "Signed-in devices",
      description:
        "Signed in somewhere you don't recognise? Sign out everywhere.",
      label: "All devices",
      labelDescription: "Signs you out on every device, including this one.",
      action: "Log out of all devices",
      confirmTitle: "Log out of all devices?",
      confirmDescription:
        "You'll need to sign in again everywhere, including here.",
      confirm: "Log out everywhere",
      cancel: "Cancel",
    },
  },

  errors: {
    generic: "Something went wrong. Please try again.",
  },
  loading: {
    message: "Loading...",
  },
  notFound: {
    title: "Page Not Found",
    description: "The requested account page does not exist.",
    ctaHome: "Return to Home",
  },
  error: {
    title: "Something went wrong",
    description: "An unexpected error occurred in the account zone.",
    retry: "Try Again",
  },
} as const;

export type AccountStrings = typeof strings;
