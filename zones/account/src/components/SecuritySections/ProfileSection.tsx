"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Inline, Input, Stack, Text, toast } from "@timmbr/ui";
import { Mail, Pencil, Smartphone, User } from "@timmbr/icons";
import { broadcastAuth, loadSession } from "@timmbr/auth";
import { isApiError } from "@timmbr/utils";
import { userApi } from "@/lib/api/browser";
import { strings } from "@/app/strings";
import type { UserProfile } from "@/lib/api/types";
import { isPlaceholderEmail } from "@/lib/user";
import { SettingsRow, SettingsSection } from "./SettingsSection";
import { nameSchema, type NameValues } from "./validationSchema";

const p = strings.security.profile;

const notAdded = (
  <Text as="span" variant="body-2" foreground="muted">
    {p.notAdded}
  </Text>
);

/** Name (editable in place), email and mobile number. */
export function ProfileSection({ user }: { user: UserProfile }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: user.name },
  });

  const save = async ({ name }: NameValues) => {
    try {
      await userApi.updateName(name);
      toast.success(p.saved);
      setEditing(false);
      // Header greeting: this tab, then every other open tab.
      await loadSession();
      broadcastAuth({ type: "LOGIN" });
      router.refresh();
    } catch (error) {
      toast.error(
        isApiError(error) && error.message
          ? error.message
          : strings.errors.generic,
      );
    }
  };

  const cancel = () => {
    reset({ name: user.name });
    setEditing(false);
  };

  return (
    <SettingsSection title={p.title} description={p.description}>
      <SettingsRow
        icon={User}
        label={p.name}
        action={
          !editing && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Pencil />}
              onClick={() => setEditing(true)}
            >
              {p.edit}
            </Button>
          )
        }
      >
        {editing ? (
          <Stack asChild direction={{ sm: "row" }} gap={3}>
            <form onSubmit={handleSubmit(save)} noValidate>
              <Input
                aria-label={p.name}
                autoComplete="name"
                autoFocus
                error={errors.name?.message}
                containerClassName="sm:min-w-64"
                {...register("name")}
              />
              <Inline gap={2} wrap={false} align="start">
                <Button type="submit" variant="primary" loading={isSubmitting}>
                  {p.save}
                </Button>
                <Button type="button" variant="ghost" onClick={cancel}>
                  {p.cancel}
                </Button>
              </Inline>
            </form>
          </Stack>
        ) : (
          user.name
        )}
      </SettingsRow>
      <SettingsRow icon={Mail} label={p.email}>
        {isPlaceholderEmail(user.email) ? (
          notAdded
        ) : (
          <Text as="span" variant="body-2" className="break-all">
            {user.email}
          </Text>
        )}
      </SettingsRow>
      <SettingsRow icon={Smartphone} label={p.phone}>
        {user.phone ?? notAdded}
      </SettingsRow>
    </SettingsSection>
  );
}
