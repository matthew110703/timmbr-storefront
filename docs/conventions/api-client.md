# Centralized API Client & Data Fetching Guidelines

All network requests from **`timmbr-storefront`** applications to the **`timmbr-core`** backend service must follow the centralized, strongly-typed `ApiClient` pattern.

---

## 1. Golden Rule

> **Never execute raw `fetch()` calls inside UI components or route pages.**

All backend communication must go through typed domain service modules (e.g., catalog, cart, checkout, profile) that delegate to a centralized `ApiClient` instance.

---

## 2. Architecture & Capabilities

The `ApiClient` provides:

1. **Centralized Base URL**: Reads `NEXT_PUBLIC_API_URL` through validated runtime schema (`env.ts`).
2. **Automatic Auth Injection**: Dynamically attaches `Authorization: Bearer <token>` headers via session helpers.
3. **Normalized Error Handling**: Non-2xx HTTP responses throw a strongly-typed `ApiError` containing `statusCode`, `message`, and backend validation `details`.
4. **Seamless Response Unwrapping**: Automatically detects and extracts `data` payloads wrapped by `timmbr-core`'s `TransformInterceptor` (`{ success: true, data: T }`).
5. **Standardized Verbs**: Convenience methods for `api.get()`, `api.post()`, `api.put()`, `api.patch()`, and `api.delete()`.

---

## 3. Directory Structure: Global vs Modular APIs

To keep zone applications organized, API services are structured into:

- **Global Infrastructure**: Shared client definitions, base HTTP helpers, and route constants.
- **Modular Feature APIs**: Every domain feature maintains its own service functions (e.g. `productsApi`, `cartApi`).

```text
src/
├── lib/
│   └── api/
│       ├── client.ts              # ApiClient class definition and singleton
│       ├── routes.ts              # Global static endpoints dictionary matching timmbr-core (API_ROUTES)
│       └── index.ts
└── app/
    └── (features)/
        └── api/
            └── products.ts        # productsApi implementation
```

---

## 4. Error Handling Pattern

Network errors and HTTP failure responses are converted into `ApiError`:

```typescript
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
```
