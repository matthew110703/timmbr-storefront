"use client";

import { useState } from "react";
import { Button } from "@timmbr/ui";
import { strings } from "./strings";

/** Must match the shell's session channel, so every open tab signs out too. */
const AUTH_CHANNEL_NAME = "timmbr_auth";

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  const logout = async () => {
    setPending(true);
    try {
      // The shell's BFF (same origin) revokes the session and clears cookies.
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      if ("BroadcastChannel" in window) {
        const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
        channel.postMessage({ type: "LOGOUT" });
        channel.close();
      }
      // "/" is the shell (another zone): needs a full navigation, not router.push.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/");
    }
  };

  return (
    <Button variant="outline" onClick={logout} loading={pending}>
      {strings.account.logout}
    </Button>
  );
}
