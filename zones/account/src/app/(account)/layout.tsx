import { PageHeader } from "@timmbr/ui";
import { AccountChrome } from "@/components/AccountChrome";
import { AccountNav } from "@/components/AccountNav";
import { requireUser } from "@/lib/session";
import { strings } from "@/app/strings";
import { primaryContact } from "@/lib/user";

/**
 * Every account page: "Your account" header, side navigation and the page
 * (phones: the overview is the hub, section pages get a back link).
 * The shell already gates /account/* (redirects to sign-in); requireUser is
 * the authoritative check against timmbr-core.
 */
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <AccountChrome
      header={
        <PageHeader
          title={strings.account.title}
          description={strings.account.summary(user.name, primaryContact(user))}
          size="lg"
        />
      }
      nav={<AccountNav />}
    >
      {children}
    </AccountChrome>
  );
}
