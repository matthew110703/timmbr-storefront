import { Button, EmptyState } from "@timmbr/ui";
import { ShoppingBag } from "@timmbr/icons";
import { strings } from "@/app/strings";

const t = strings.empty;

/**
 * Nothing to pay for: send the shopper back to the store (another zone, so a plain link).
 * Centred on the page, like the order confirmation.
 */
export function EmptyCheckout() {
  return (
    <div className="flex justify-center py-8 lg:py-16">
      <EmptyState
        size="lg"
        className="w-full"
        icon={<ShoppingBag />}
        title={t.title}
        description={t.description}
        action={
          <Button asChild>
            <a href={t.ctaHref}>{t.cta}</a>
          </Button>
        }
      />
    </div>
  );
}
