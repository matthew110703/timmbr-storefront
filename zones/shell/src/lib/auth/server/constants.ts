import { ACCESS_TOKEN_COOKIE } from "@timmbr/utils";

/**
 * Session cookies on the storefront domain. httpOnly: browser JavaScript never
 * sees either token. The access cookie name matches @timmbr/utils'
 * ACCESS_TOKEN_COOKIE, so its server-side API client picks the token up.
 */
export const ACCESS_COOKIE = ACCESS_TOKEN_COOKIE;
export const REFRESH_COOKIE = "timmbr_refresh_token";

// Cookie lifetimes are not configured here: each cookie expires with the JWT
// it holds (its `exp`), so they always follow timmbr-core's
// JWT_ACCESS_EXPIRES_IN / JWT_REFRESH_EXPIRES_IN without duplicating them.

/** Refresh when the access token has less than this left. */
export const REFRESH_BEFORE_EXPIRY_S = 60;

/**
 * OAuth binding nonce (httpOnly, storefront domain). Its sha256 travels with
 * the provider round-trip; only this browser can redeem the resulting code.
 */
export const OAUTH_BIND_COOKIE = "timmbr_oauth_bind";
export const OAUTH_BIND_MAX_AGE_S = 10 * 60;
