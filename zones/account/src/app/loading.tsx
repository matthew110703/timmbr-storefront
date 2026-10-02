import { Container, Center, Stack, Spinner, Text } from "@timmbr/ui";
import { strings } from "./strings";

export default function Loading() {
  return (
    <Container maxWidth="xl" padded className="py-24">
      <Center>
        <Stack gap={4} align="center">
          <Spinner size="lg" />
          <Text variant="body-2" foreground="muted">
            {strings.loading.message}
          </Text>
        </Stack>
      </Center>
    </Container>
  );
}
