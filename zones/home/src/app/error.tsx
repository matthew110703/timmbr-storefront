"use client";

import { useEffect } from "react";
import {
  Container,
  Center,
  Stack,
  Heading,
  Text,
  Button,
  Card,
} from "@timmbr/ui";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Home Zone Error:", error);
  }, [error]);

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
              Something went wrong
            </Heading>
            <Text variant="body-2" foreground="muted">
              An unexpected issue occurred while rendering the home page.
            </Text>
            <Button variant="default" onClick={() => reset()} className="mt-2">
              Try Again
            </Button>
          </Stack>
        </Card>
      </Center>
    </Container>
  );
}
