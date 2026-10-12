"use client";

import {
  Container,
  Center,
  Stack,
  Heading,
  Text,
  Button,
  Card,
} from "@timmbr/ui";
import { strings } from "./strings";

export default function ErrorBoundary({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container maxWidth="md" padded className="py-24">
      <Center>
        <Card
          variant="outline"
          padding="lg"
          className="max-w-md w-full text-center"
        >
          <Stack gap={4} align="center">
            <Heading level={2} font="display">
              {strings.error.title}
            </Heading>
            <Text variant="body-2" foreground="muted">
              {strings.error.description}
            </Text>
            <Button variant="default" onClick={() => reset()} className="mt-2">
              {strings.error.retry}
            </Button>
          </Stack>
        </Card>
      </Center>
    </Container>
  );
}
