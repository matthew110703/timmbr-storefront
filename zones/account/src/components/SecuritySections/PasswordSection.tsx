"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Badge,
  Button,
  Input,
  FormField,
  Inline,
  OtpInput,
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogForm,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  Stack,
  Text,
  toast,
} from "@timmbr/ui";
import { KeyRound, MessageSquareText } from "@timmbr/icons";
import {
  authApi,
  authErrorMessage,
  broadcastAuth,
  clearSession,
  setSignedIn,
} from "@timmbr/auth";
import { isApiError } from "@timmbr/utils";
import { strings } from "@/app/strings";
import type { UserProfile } from "@/lib/api/types";
import { isPlaceholderEmail } from "@/lib/user";
import { SettingsRow, SettingsSection } from "./SettingsSection";
import {
  createPasswordSchema,
  passwordSchema,
  type CreatePasswordValues,
  type PasswordValues,
} from "./validationSchema";

const s = strings.security.password;

/** Where the one-time code goes: the mobile number, else a real email. */
export function codeDestination(
  user: Pick<UserProfile, "email" | "phone">,
): string {
  return user.phone ?? (isPlaceholderEmail(user.email) ? "" : user.email);
}

type CodeRequest =
  | { ok: true; destination: string; resendIn: number }
  | { ok: false; error: string; resendIn?: number };

/**
 * Sends a one-time code. During the cooldown (e.g. right after signing in
 * with a code, which is already used up) nothing is sent: the caller shows the
 * wait and enables "Resend code" when it ends.
 */
async function requestCode(identifier: string): Promise<CodeRequest> {
  try {
    const sent = await authApi.sendOtp(identifier);
    return {
      ok: true,
      destination: sent.destination,
      resendIn: sent.resendAvailableIn,
    };
  } catch (error) {
    const resendIn =
      isApiError(error) && error.code === "OTP_COOLDOWN"
        ? (error.retryAfter ?? 60)
        : undefined;
    return { ok: false, error: authErrorMessage(error), resendIn };
  }
}

/** Cancel / submit, pinned to the bottom of the sheet on phones. */
function FormActions({
  submitLabel,
  busy,
  disabled = false,
  onCancel,
}: {
  submitLabel: string;
  busy: boolean;
  disabled?: boolean;
  onCancel: () => void;
}) {
  return (
    <ResponsiveDialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={busy}
      >
        {s.cancel}
      </Button>
      <Button
        type="submit"
        variant="primary"
        loading={busy}
        disabled={disabled}
      >
        {submitLabel}
      </Button>
    </ResponsiveDialogFooter>
  );
}

// ─── Create (no password yet): code + new password on one form ───────────────

function CreatePasswordForm({
  identifier,
  onDone,
  onCancel,
}: {
  identifier: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [destination, setDestination] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [resendAt, setResendAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreatePasswordValues>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: { code: "", newPassword: "", confirmPassword: "" },
  });

  const applySent = (result: CodeRequest) => {
    setSending(false);
    if (result.ok) {
      setDestination(result.destination);
      setSendError(null);
      setResendAt(Date.now() + result.resendIn * 1000);
    } else {
      setSendError(result.error);
      if (result.resendIn) setResendAt(Date.now() + result.resendIn * 1000);
    }
  };

  // Sent only when the user asks (Send code / Resend code).
  const send = () => {
    setSending(true);
    setSendError(null);
    void requestCode(identifier).then(applySent);
  };

  const waiting = resendAt > now;
  useEffect(() => {
    if (!waiting) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [waiting]);

  const create = async ({ code, newPassword }: CreatePasswordValues) => {
    try {
      const verified = await authApi.verifyOtp(identifier, code, "reset");
      if (!verified.passwordSetupToken)
        throw new Error("No password setup token");
      const result = await authApi.setPassword(
        verified.passwordSetupToken,
        newPassword,
      );
      setSignedIn(result.user);
      toast.success(s.created);
      onDone();
    } catch (error) {
      const message = authErrorMessage(error);
      if (isApiError(error) && error.code?.startsWith("OTP_"))
        setError("code", { message });
      else setError("root", { message });
    }
  };

  return (
    <ResponsiveDialogForm onSubmit={handleSubmit(create)} noValidate>
      <ResponsiveDialogBody>
        <Stack gap={5}>
          <Text variant="body-2" foreground="muted" role="status">
            {destination ? s.sentTo(destination) : s.willSendTo(identifier)}
          </Text>
          {sendError && <Alert variant="destructive">{sendError}</Alert>}

          {destination ? (
            <Stack gap={2}>
              <FormField
                label={s.code}
                id="create-password-code"
                error={errors.code?.message}
              >
                <Controller
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <OtpInput
                      id="create-password-code"
                      length={6}
                      value={field.value}
                      onChange={field.onChange}
                      error={Boolean(errors.code)}
                      autoFocus
                    />
                  )}
                />
              </FormField>
              <Inline>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={send}
                  disabled={waiting || sending}
                >
                  {waiting
                    ? s.resendIn(Math.ceil((resendAt - now) / 1000))
                    : s.resend}
                </Button>
              </Inline>
            </Stack>
          ) : (
            <Inline>
              <Button
                type="button"
                variant="outline"
                leftIcon={<MessageSquareText />}
                loading={sending}
                loadingText={s.sending}
                disabled={waiting}
                onClick={send}
              >
                {waiting
                  ? s.resendIn(Math.ceil((resendAt - now) / 1000))
                  : s.sendCode}
              </Button>
            </Inline>
          )}

          <Input
            type="password"
            label={s.new}
            autoComplete="new-password"
            showPasswordToggle
            helperText={errors.newPassword ? undefined : s.hint}
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <Input
            type="password"
            label={s.confirm}
            autoComplete="new-password"
            showPasswordToggle
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {errors.root?.message && (
            <Alert variant="destructive">{errors.root.message}</Alert>
          )}
        </Stack>
      </ResponsiveDialogBody>
      <FormActions
        submitLabel={s.submitCreate}
        busy={isSubmitting}
        disabled={!destination}
        onCancel={onCancel}
      />
    </ResponsiveDialogForm>
  );
}

// ─── Change (has a password) ─────────────────────────────────────────────────

function ChangePasswordForm({
  onDone,
  onCancel,
}: {
  onDone: () => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const change = async ({ currentPassword, newPassword }: PasswordValues) => {
    try {
      const result = await authApi.changePassword(currentPassword, newPassword);
      if (!result?.user) {
        // Changed, but this device couldn't be signed back in: sign in again.
        clearSession();
        broadcastAuth({ type: "LOGOUT" });
        // "/" is the shell (another zone): full navigation.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign("/");
        return;
      }
      setSignedIn(result.user);
      toast.success(s.changed);
      onDone();
    } catch (error) {
      const message = authErrorMessage(error);
      if (isApiError(error) && error.code === "INVALID_CREDENTIALS")
        setError("currentPassword", { message });
      else setError("root", { message });
    }
  };

  return (
    <ResponsiveDialogForm onSubmit={handleSubmit(change)} noValidate>
      <ResponsiveDialogBody>
        <Stack gap={5}>
          <Input
            type="password"
            label={s.current}
            autoComplete="current-password"
            showPasswordToggle
            autoFocus
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <Input
            type="password"
            label={s.new}
            autoComplete="new-password"
            showPasswordToggle
            helperText={errors.newPassword ? undefined : s.hint}
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <Input
            type="password"
            label={s.confirm}
            autoComplete="new-password"
            showPasswordToggle
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          {errors.root?.message && (
            <Alert variant="destructive">{errors.root.message}</Alert>
          )}
        </Stack>
      </ResponsiveDialogBody>
      <FormActions
        submitLabel={s.save}
        busy={isSubmitting}
        onCancel={onCancel}
      />
    </ResponsiveDialogForm>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function PasswordSection({ user }: { user: UserProfile }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const identifier = codeDestination(user);
  const creating = !user.hasPassword;

  const done = () => {
    setOpen(false);
    router.refresh();
  };

  const description = user.hasPassword
    ? s.setDescription
    : user.linkedProviders.includes("GOOGLE")
      ? s.noneGoogle
      : s.none;

  return (
    <SettingsSection title={s.title} description={description}>
      <SettingsRow
        icon={KeyRound}
        label={s.label}
        action={
          <Button
            size="sm"
            variant={creating ? "primary" : "outline"}
            onClick={() => setOpen(true)}
            disabled={creating && !identifier}
          >
            {creating ? s.create : s.change}
          </Button>
        }
      >
        <Badge variant={user.hasPassword ? "success" : "subtle"} size="sm">
          {user.hasPassword ? s.statusSet : s.statusNone}
        </Badge>
      </SettingsRow>

      {/* Phones: a bottom sheet with the buttons pinned above the keyboard. */}
      <ResponsiveDialog open={open} onOpenChange={setOpen}>
        <ResponsiveDialogContent size="sm">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              {creating ? s.createTitle : s.changeTitle}
            </ResponsiveDialogTitle>
            {!creating && (
              <ResponsiveDialogDescription>
                {s.setDescription}
              </ResponsiveDialogDescription>
            )}
          </ResponsiveDialogHeader>
          {/* Mounted only while open: each opening starts fresh (and sends a new code). */}
          {open &&
            (creating ? (
              <CreatePasswordForm
                identifier={identifier}
                onDone={done}
                onCancel={() => setOpen(false)}
              />
            ) : (
              <ChangePasswordForm
                onDone={done}
                onCancel={() => setOpen(false)}
              />
            ))}
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </SettingsSection>
  );
}
