import { Container, Center, EmptyState, Button } from "@timmbr/ui";
import { Package } from "@timmbr/icons";

export default function NotFound() {
  return (
    <Container maxWidth="md" padded className="py-24">
      <Center>
        <EmptyState
          icon={<Package className="size-12 text-primary" />}
          title="Sanctuary Not Found"
          description="The page or collection you are looking for does not exist in this zone."
          action={
            <Button variant="default" asChild>
              <a href="/home">Return to Home</a>
            </Button>
          }
        />
      </Center>
    </Container>
  );
}
