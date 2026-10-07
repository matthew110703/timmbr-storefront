import { Container, Heading, Text } from "@timmbr/ui";
import { requireUser } from "@/lib/session";
import { LogoutButton } from "./LogoutButton";
import { strings } from "./strings";

export default async function AccountPage() {
  // Verified by timmbr-core; redirects to the shell's sign-in (and back) otherwise.
  const user = await requireUser("/account");

  return (
    <Container maxWidth="xl" padded className="py-24">
      <div className="flex flex-col gap-6">
        <div>
          <Heading level={1}>{strings.account.greeting(user.name)}</Heading>
          <Text variant="body-1" foreground="muted" className="mt-2">
            {user.email}
          </Text>
        </div>
        <div>
          <LogoutButton />
        </div>
      </div>
    </Container>
  );
}
