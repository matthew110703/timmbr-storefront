import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  Icon,
  Inline,
  Stack,
  Text,
} from "@timmbr/ui";
import { MapPin, Pencil, Trash2 } from "@timmbr/icons";
import { strings } from "@/app/strings";
import type { Address } from "@/lib/api/types";

const t = strings.addresses;

interface AddressCardProps {
  address: Address;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  /** Disables the actions while a change to this address is in flight. */
  busy?: boolean;
}

export function addressLabelText(label: string) {
  const known = t.labels as Record<string, string>;
  return known[label.toLowerCase()] ?? label;
}

/** One line for confirmations: "12 Temple Street, Chennai 600001". */
export function addressSummary(address: Address) {
  return `${address.line1}, ${address.city} ${address.postalCode}`;
}

interface AddressAction {
  id: "edit" | "delete" | "setDefault";
  label: string;
  onClick: () => void;
  variant: React.ComponentProps<typeof Button>["variant"];
  icon?: React.ReactNode;
  /** Pushes the action to the end of the footer. */
  end?: boolean;
}

/** The footer actions for an address: only the handlers given, and "Set as default" only when it isn't. */
function addressActions(
  address: Address,
  {
    onEdit,
    onDelete,
    onSetDefault,
  }: Pick<AddressCardProps, "onEdit" | "onDelete" | "onSetDefault">,
): AddressAction[] {
  const actions: AddressAction[] = [];
  if (onEdit)
    actions.push({
      id: "edit",
      label: t.edit,
      onClick: onEdit,
      variant: "ghost",
      icon: <Pencil />,
    });
  if (onDelete)
    actions.push({
      id: "delete",
      label: t.delete,
      onClick: onDelete,
      variant: "destructive-ghost",
      icon: <Trash2 />,
    });
  if (onSetDefault && !address.isDefault)
    actions.push({
      id: "setDefault",
      label: t.setDefault,
      onClick: onSetDefault,
      variant: "link",
      end: true,
    });
  return actions;
}

/** A saved address: label, default badge, name, lines and phone, plus its actions. */
export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  busy = false,
}: AddressCardProps) {
  const label = addressLabelText(address.label);
  const actions = addressActions(address, { onEdit, onDelete, onSetDefault });

  return (
    <Card
      asChild
      sectioned
      padding="sm"
      selected={address.isDefault}
      className="h-full"
    >
      <article aria-label={`${label}: ${addressSummary(address)}`}>
        <CardContent>
          <Inline gap={2} wrap={false}>
            <Text as="span" variant="overline" foreground="muted">
              {label}
            </Text>
            {address.isDefault && (
              <Badge variant="primary" size="sm">
                {t.default}
              </Badge>
            )}
            {address.latitude !== null && (
              <Icon
                size="sm"
                foreground="muted"
                aria-label={t.form.location.pinned}
                className="ms-auto"
              >
                <MapPin />
              </Icon>
            )}
          </Inline>
          <Text asChild variant="body-2" italic={false}>
            <address>
              <Stack gap={1}>
                <Stack gap={0.5}>
                  <Text as="span" variant="body-2-semibold">
                    {address.fname} {address.lname}
                  </Text>
                  <span>{address.line1}</span>
                  {address.line2 && <span>{address.line2}</span>}
                  <span>
                    {address.city}, {address.state} {address.postalCode}
                  </span>
                </Stack>
                <Text as="span" variant="body-2" foreground="muted">
                  {address.phone}
                </Text>
              </Stack>
            </address>
          </Text>
        </CardContent>

        {actions.length > 0 && (
          <CardFooter
            justify="start"
            role="group"
            aria-label={t.actionsFor(label)}
          >
            {actions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                size="sm"
                leftIcon={action.icon}
                onClick={action.onClick}
                disabled={busy}
                className={action.end ? "ms-auto" : undefined}
              >
                {action.label}
              </Button>
            ))}
          </CardFooter>
        )}
      </article>
    </Card>
  );
}
