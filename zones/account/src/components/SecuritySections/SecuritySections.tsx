"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  ConfirmDialog,
  PageHeader,
  Stack,
  toast,
} from "@timmbr/ui";
import {
  GoogleIcon,
  KeyRound,
  LogOut,
  MessageSquareText,
  MonitorSmartphone,
} from "@timmbr/icons";
import { authErrorMessage, signOutEverywhere } from "@timmbr/auth";
import { strings } from "@/app/strings";
import type { UserProfile } from "@/lib/api/types";
import { PasswordSection } from "./PasswordSection";
import { ProfileSection } from "./ProfileSection";
import { SettingsRow, SettingsSection } from "./SettingsSection";

const s = strings.security;

function MethodsSection({ user }: { user: UserProfile }) {
  const m = s.methods;
  const google = user.linkedProviders.includes("GOOGLE");
  const status = (on: boolean, onText: string, offText: string) => (
    <Badge variant={on ? "success" : "subtle"} size="sm">
      {on ? onText : offText}
    </Badge>
  );

  return (
    <SettingsSection title={m.title} description={m.description}>
      <SettingsRow
        icon={KeyRound}
        label={m.password}
        description={m.passwordDescription}
        action={status(user.hasPassword, m.connected, m.notSet)}
      />
      <SettingsRow
        icon={MessageSquareText}
        label={m.code}
        description={m.codeDescription}
        action={status(true, m.available, m.available)}
      />
      <SettingsRow
        icon={GoogleIcon}
        label={m.google}
        description={m.googleDescription}
        action={status(google, m.connected, m.notConnected)}
      />
    </SettingsSection>
  );
}

function SessionsSection() {
  const [confirming, setConfirming] = useState(false);
  const x = s.sessions;

  /** Signs out everywhere and leaves /account/* (throws on failure: the dialog stays open). */
  const logOutEverywhere = async () => {
    try {
      await signOutEverywhere();
    } catch (error) {
      toast.error(authErrorMessage(error));
      throw error;
    }
  };

  return (
    <SettingsSection title={x.title} description={x.description}>
      <SettingsRow
        icon={MonitorSmartphone}
        label={x.label}
        description={x.labelDescription}
        actionPlacement="below"
        action={
          <Button
            size="sm"
            variant="destructive-outline"
            leftIcon={<LogOut />}
            onClick={() => setConfirming(true)}
          >
            {x.action}
          </Button>
        }
      />
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        tone="destructive"
        icon={<LogOut />}
        title={x.confirmTitle}
        description={x.confirmDescription}
        confirmLabel={x.confirm}
        cancelLabel={x.cancel}
        onConfirm={logOutEverywhere}
      />
    </SettingsSection>
  );
}

/** "Login & security": personal details, password, sign-in methods and devices. */
export function SecuritySections({ user }: { user: UserProfile }) {
  return (
    <Stack gap={6}>
      <PageHeader as="h2" title={s.title} description={s.description} />
      <ProfileSection user={user} />
      <PasswordSection user={user} />
      <MethodsSection user={user} />
      <SessionsSection />
    </Stack>
  );
}
