import { Container, Center, Stack, Spinner, Text } from "@timmbr/ui";

export default function Loading() {
  return (
    <Container maxWidth="xl" padded className="py-24">
      <Center>
        <Stack gap={4} align="center">
          <Spinner size="lg" />
          <Text variant="body-2" foreground="muted">
            Crafting sanctuary...
          </Text>
        </Stack>
      </Center>
    </Container>
  );
}
