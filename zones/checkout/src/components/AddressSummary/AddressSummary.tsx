"use client";

import { useState } from "react";
import {
  Button,
  EmptyState,
  Icon,
  Inline,
  RadioCard,
  RadioGroup,
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  Stack,
  Text,
} from "@timmbr/ui";
import { MapPin } from "@timmbr/icons";
import { strings } from "@/app/strings";
import { addressName, addressText } from "@/lib/checkout";
import type { Address } from "@/lib/api/types";

const t = strings.address;

export function addressLabel(label: string) {
  return t.labels[label.toLowerCase()] ?? label;
}

export interface AddressSummaryProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Locks the choice while a payment is in progress. */
  disabled?: boolean;
}

/** "Deliver To: Name Home" with the address, a Change picker, and an empty state when there are none. */
export function AddressSummary({
  addresses,
  selectedId,
  onSelect,
  disabled,
}: AddressSummaryProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const selected = addresses.find((address) => address.id === selectedId);

  if (!selected) {
    return (
      <div>
        <EmptyState
          icon={<MapPin />}
          title={t.missingTitle}
          description={t.missingDescription}
          action={
            <Button asChild>
              {/* Plain link: the account zone owns addresses. */}
              <a href={t.addNewHref}>{t.addNew}</a>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <Stack gap={3}>
        <Inline justify="between" align="center" wrap={false}>
          <Text variant="body-2" weight="bold">
            {t.deliverTo} {addressName(selected)}{" "}
            <Text
              as="span"
              variant="body-2"
              foreground="primary"
              weight="medium"
            >
              {addressLabel(selected.label)}
            </Text>
          </Text>
          {addresses.length > 0 && (
            <Button
              variant="link"
              size="sm"
              disabled={disabled}
              onClick={() => {
                setDraft(selected.id);
                setOpen(true);
              }}
            >
              {t.change}
            </Button>
          )}
        </Inline>
        <Text variant="body-3" foreground="muted">
          {addressText(selected)}
        </Text>
        <Text variant="body-3" weight="semibold">
          {t.mobile(selected.phone)}
        </Text>
      </Stack>

      <ResponsiveDialog open={open} onOpenChange={setOpen}>
        <ResponsiveDialogContent size="md">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>{t.pickerTitle}</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <ResponsiveDialogBody>
            <RadioGroup
              aria-label={t.pickerTitle}
              value={draft ?? selected.id}
              onValueChange={setDraft}
            >
              {addresses.map((address) => (
                <RadioCard
                  key={address.id}
                  variant="card"
                  value={address.id}
                  icon={
                    <Icon size="md">
                      <MapPin />
                    </Icon>
                  }
                  label={`${addressName(address)} · ${addressLabel(address.label)}`}
                  description={addressText(address)}
                />
              ))}
            </RadioGroup>
          </ResponsiveDialogBody>
          <ResponsiveDialogFooter>
            <Button variant="outline" asChild>
              <a href={t.addNewHref}>{t.addNew}</a>
            </Button>
            <Button
              onClick={() => {
                if (draft) onSelect(draft);
                setOpen(false);
              }}
            >
              {t.pickerDone}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </div>
  );
}
