import { useId } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  DataList,
  DataListAction,
  DataListItem,
  DataListLabel,
  DataListValue,
  Icon,
} from "@timmbr/ui";

/** A settings card: title and description, then rows separated by full-width lines. */
export function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const headingId = useId();
  return (
    <Card asChild sectioned padding="default">
      <section aria-labelledby={headingId}>
        <CardHeader divider>
          <CardTitle id={headingId}>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <DataList divided inset="default">
          {children}
        </DataList>
      </section>
    </Card>
  );
}

/**
 * One setting: label (with icon and description) | value | action. The label
 * column has a fixed width so values and actions line up across sections;
 * small screens stack them.
 */
export function SettingsRow({
  icon,
  label,
  description,
  children,
  action,
  actionPlacement,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  /** Phones: next to the label (default) or under it, for wide buttons. */
  actionPlacement?: "end" | "below";
}) {
  return (
    <DataListItem align="center">
      <DataListLabel
        tone="strong"
        minWidth="14rem"
        icon={icon ? <Icon icon={icon} size="sm" /> : undefined}
        description={description}
      >
        {label}
      </DataListLabel>
      {children !== undefined && <DataListValue>{children}</DataListValue>}
      {action && (
        <DataListAction placement={actionPlacement}>{action}</DataListAction>
      )}
    </DataListItem>
  );
}
