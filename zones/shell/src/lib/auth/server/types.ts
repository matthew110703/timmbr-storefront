import type { SessionUser } from "@timmbr/auth/contract";

// Browser-facing shapes are the shared contract (also used by @timmbr/auth's
// client), so the handlers can't drift from what zones read.
export type {
  SessionResponse,
  SessionUser,
  SignInResult,
} from "@timmbr/auth/contract";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/** timmbr-core's sign-in result in trusted (BFF) mode: tokens in the body. */
export interface CoreSession extends TokenPair, SessionUser {
  emailVerified: boolean;
  isNewUser?: boolean;
  hasPassword?: boolean;
  passwordSetupToken?: string;
}
