/**
 * The shell's server-side auth (BFF). Everything the app wires up comes from
 * here; the folders behind it are implementation details:
 *
 *   handlers/  one file per /api/auth area (sign-in, session, oauth, banner)
 *              plus the /api/core pass-through
 *   session/   httpOnly session cookies, token refresh, the session proxy
 *   core.ts    trusted server-to-server client for timmbr-core
 *   http.ts    JSON envelope, error pass-through, CSRF check
 *   env.ts / constants.ts / types.ts
 *   __tests__/ tests, mirroring the folders above (+ shared test-helpers)
 *
 * Server-only: never import this from a Client Component. `src/proxy.ts`
 * imports `./session/proxy` directly to keep the per-request bundle small.
 */
export { authHandlers, corePassthrough } from "./handlers";
export { FALLBACK_AUTH_BANNER } from "./handlers/banner";
export { createSessionProxy, type SessionProxyOptions } from "./session/proxy";
