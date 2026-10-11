"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Grid,
  Icon,
  PageHeader,
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  Stack,
  Text,
  toast,
} from "@timmbr/ui";
import { MapPin, Plus, Trash2 } from "@timmbr/icons";
import { isApiError } from "@timmbr/utils";
import { AddressCard, addressSummary } from "@/components/AddressCard";
import {
  AddressForm,
  toAddressInput,
  type AddressFormValues,
} from "@/components/AddressForm";
import { addressApi } from "@/lib/api/browser";
import { strings } from "@/app/strings";
import type { Address } from "@/lib/api/types";

/** timmbr-core allows at most 10 saved addresses per user. */
export const MAX_ADDRESSES = 10;

const t = strings.addresses;

const errorMessage = (error: unknown) =>
  isApiError(error) && error.message ? error.message : strings.errors.generic;

type Editing = { mode: "add" } | { mode: "edit"; address: Address } | null;

/** Saved addresses with add / edit / delete / set-default. */
export function AddressList({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<Address | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const atLimit = addresses.length >= MAX_ADDRESSES;

  const save = async (values: AddressFormValues) => {
    const input = toAddressInput(values);
    try {
      if (editing?.mode === "edit") {
        await addressApi.update(editing.address.id, input);
        // Default is its own endpoint (core ignores isDefault on update).
        if (values.isDefault && !editing.address.isDefault)
          await addressApi.setDefault(editing.address.id);
        toast.success(t.updated);
      } else {
        await addressApi.create({ ...input, isDefault: values.isDefault });
        toast.success(t.created);
      }
      setEditing(null);
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  /** Throws on failure so ConfirmDialog stays open. */
  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await addressApi.remove(deleting.id);
      toast.success(t.deleted);
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
      throw error;
    }
  };

  const makeDefault = async (address: Address) => {
    setBusyId(address.id);
    try {
      await addressApi.setDefault(address.id);
      toast.success(t.defaultChanged);
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const addButton = (
    <Button
      variant="primary"
      leftIcon={<Plus />}
      onClick={() => setEditing({ mode: "add" })}
      disabled={atLimit}
    >
      {t.add}
    </Button>
  );

  return (
    <Stack gap={6}>
      <PageHeader
        as="h2"
        title={t.title}
        description={t.description}
        actions={addresses.length > 0 ? addButton : undefined}
      />

      {atLimit && (
        <Text variant="body-2" foreground="muted" role="status">
          {t.limitReached(MAX_ADDRESSES)}
        </Text>
      )}

      {addresses.length === 0 ? (
        <EmptyState
          variant="bordered"
          fullWidth
          icon={
            <Icon size="lg" foreground="primary">
              <MapPin />
            </Icon>
          }
          title={t.empty.title}
          description={t.empty.description}
          action={addButton}
        />
      ) : (
        <Grid cols={{ md: 2 }} gap={4}>
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              busy={busyId === address.id}
              onEdit={() => setEditing({ mode: "edit", address })}
              onDelete={() => setDeleting(address)}
              onSetDefault={() => makeDefault(address)}
            />
          ))}
        </Grid>
      )}

      {/* Phones: a bottom sheet with Save / Cancel pinned above the keyboard. */}
      <ResponsiveDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <ResponsiveDialogContent size="lg">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              {editing?.mode === "edit" ? t.form.editTitle : t.form.addTitle}
            </ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          {editing && (
            <AddressForm
              key={editing.mode === "edit" ? editing.address.id : "new"}
              address={editing.mode === "edit" ? editing.address : undefined}
              // The first address becomes the default anyway; an existing default stays one.
              showDefaultOption={
                editing.mode === "edit"
                  ? !editing.address.isDefault
                  : addresses.length > 0
              }
              onSubmit={save}
              onCancel={() => setEditing(null)}
            >
              {({ fields, actions }) => (
                <>
                  <ResponsiveDialogBody>{fields}</ResponsiveDialogBody>
                  <ResponsiveDialogFooter>{actions}</ResponsiveDialogFooter>
                </>
              )}
            </AddressForm>
          )}
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        tone="destructive"
        icon={<Trash2 />}
        title={t.confirmDelete.title}
        description={
          deleting?.isDefault && addresses.length > 1
            ? `${t.confirmDelete.description} ${t.confirmDelete.newDefault}`
            : t.confirmDelete.description
        }
        confirmLabel={t.confirmDelete.confirm}
        confirmIcon={<Trash2 />}
        cancelLabel={t.confirmDelete.cancel}
        onConfirm={confirmDelete}
      >
        {deleting && (
          <Card variant="inset" padding="sm">
            <Text variant="body-2-semibold">
              {deleting.fname} {deleting.lname}
            </Text>
            <Text variant="body-2">{addressSummary(deleting)}</Text>
          </Card>
        )}
      </ConfirmDialog>
    </Stack>
  );
}
