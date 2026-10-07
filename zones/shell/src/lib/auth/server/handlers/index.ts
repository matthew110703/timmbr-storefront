import type { AuthRouteName } from "@timmbr/auth/contract";
import type { Handler } from "../http";
import { bannerHandler } from "./banner";
import { oauthCallback, oauthStart } from "./oauth";
import { logout, session } from "./session";
import { login, otpSend, otpVerify, passwordSet } from "./sign-in";

/**
 * One handler per `/api/auth/*` route. Keyed by the route names in
 * AUTH_ROUTES (@timmbr/auth/contract): a route without a handler, or a handler
 * without a route, fails the type check.
 */
export const authHandlers = {
  otpSend,
  otpVerify,
  login,
  passwordSet,
  logout,
  session,
  oauthStart,
  oauthCallback,
  banner: bannerHandler,
} satisfies Record<AuthRouteName, Handler>;

export { corePassthrough } from "./core-passthrough";
