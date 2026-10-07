import type { CoreSession, SessionUser, SignInResult } from "../types";
import { ok } from "../http";
import { setSessionCookies } from "../session/cookies";

/** The user as the browser sees it: never tokens or internal fields. */
export const toUser = (
  s: Pick<CoreSession, "id" | "name" | "email" | "role">,
): SessionUser => ({
  id: s.id,
  name: s.name,
  email: s.email,
  role: s.role,
});

function toSignInResult(session: CoreSession): SignInResult {
  return {
    user: toUser(session),
    ...(session.isNewUser !== undefined && { isNewUser: session.isNewUser }),
    ...(session.hasPassword !== undefined && {
      hasPassword: session.hasPassword,
    }),
    ...(session.passwordSetupToken && {
      passwordSetupToken: session.passwordSetupToken,
    }),
  };
}

/** Sign-in response: session cookies set, only the user (and flags) in the body. */
export function signedIn(session: CoreSession) {
  const response = ok(toSignInResult(session));
  setSessionCookies(response.cookies, session);
  return response;
}
