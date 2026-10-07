"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Center, EmptyState } from "@timmbr/ui";
import { AlertCircle, CheckCircle } from "@timmbr/icons";
import {
  broadcastAuth,
  DEFAULT_AUTH_MESSAGES,
  OAUTH_CHANNEL_NAME,
  OAUTH_RESULT_MESSAGE,
  type OAuthResultMessage,
  type OAuthResultStatus,
} from "@timmbr/auth";

/** How long the popup shows its success state before closing itself. */
const AUTO_CLOSE_DELAY_MS = 1500;

/**
 * Landing page for the OAuth popup. The BFF (/api/auth/oauth/callback) lands
 * here after exchanging the provider code and setting the session cookies.
 * This page reports the result to the opener window and closes itself. It
 * never sees a token.
 */
export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <OAuthCallbackContent />
    </Suspense>
  );
}

function OAuthCallbackContent() {
  const searchParams = useSearchParams();
  const status: OAuthResultStatus =
    searchParams.get("status") === "success" ? "success" : "error";
  const copy = DEFAULT_AUTH_MESSAGES.oauthCallback;

  useEffect(() => {
    const message: OAuthResultMessage = { type: OAUTH_RESULT_MESSAGE, status };

    // Primary: direct message to the opener (strictly targeted at our origin).
    const opener = window.opener as Window | null;
    if (opener && !opener.closed) {
      opener.postMessage(message, window.location.origin);
    }

    // Fallback: same-origin channel, in case the provider severed `opener`.
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(OAUTH_CHANNEL_NAME);
      channel.postMessage(message);
      channel.close();
    }

    if (status !== "success") return;

    // Every open storefront tab (including the opener, even if its modal was
    // closed mid-flow) re-reads who is signed in.
    broadcastAuth({ type: "LOGIN" });

    const timer = setTimeout(() => {
      window.close();
      // Still open (e.g. landed here in a normal tab): go to the store instead.
      if (!window.closed) window.location.replace("/");
    }, AUTO_CLOSE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [status]);

  const isSuccess = status === "success";

  return (
    // Covers the shell header/footer so the popup shows only the result.
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white px-6">
      <Center>
        <div role="status" aria-live="polite">
          <EmptyState
            icon={
              isSuccess ? (
                <CheckCircle className="size-12 text-primary" />
              ) : (
                <AlertCircle className="size-12 text-red-600" />
              )
            }
            title={isSuccess ? copy.successTitle : copy.errorTitle}
            description={isSuccess ? copy.successMessage : copy.errorMessage}
            action={
              isSuccess ? undefined : (
                <Button
                  variant="default"
                  onClick={() => {
                    window.close();
                    if (!window.closed) window.location.replace("/");
                  }}
                >
                  {copy.closeButton}
                </Button>
              )
            }
          />
        </div>
      </Center>
    </div>
  );
}
