import { Container, Center, EmptyState, LinkButton } from "@timmbr/ui";
import { Package } from "@timmbr/icons";
import { strings } from "./strings";

export default function NotFound() {
  return (
    <Container maxWidth="md" padded className="py-24">
      <Center>
        <EmptyState
          icon={<Package className="size-12 text-primary" />}
          title={strings.notFound.title}
          description={strings.notFound.description}
          action={
            <LinkButton href="/auth" variant="default">
              {strings.notFound.ctaHome}
            </LinkButton>
          }
        />
      </Center>
    </Container>
  );
}
