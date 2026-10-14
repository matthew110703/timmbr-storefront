import {
  Award,
  CreditCard,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Check } from "@timmbr/icons";

/** CMS icon keys → icons (unknown keys get a check mark). */
const ICONS: Record<string, LucideIcon> = {
  shipping: Truck,
  warranty: Award,
  installation: Wrench,
  emi: CreditCard,
};

export interface TrustBadgesProps {
  items: { icon?: string; label: string }[];
  note?: string;
}

/** Figma "Trust Badges Section": up to four promises in a row, split by hairlines. */
export function TrustBadges({ items, note }: TrustBadgesProps) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <ul className="grid grid-cols-2 gap-y-2 sm:grid-cols-4 sm:divide-x sm:divide-grey-200">
        {items.slice(0, 4).map((item) => {
          const IconComponent = (item.icon && ICONS[item.icon]) || Check;
          return (
            <li
              key={item.label}
              className="flex flex-col items-center gap-2 px-2 py-3 text-center"
            >
              <IconComponent
                aria-hidden="true"
                className="size-5 text-primary"
              />
              <span className="text-caption font-bold uppercase tracking-wide text-grey-700">
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
      {note && <p className="text-caption text-grey-500">{note}</p>}
    </div>
  );
}
