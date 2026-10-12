import type { Metadata } from "next";
import { Container, Center, Heading, Stack, Text } from "@timmbr/ui";
import { strings } from "./strings";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: strings.metadata.title,
};

/** Placeholder until the product detail page is built. */
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <Container maxWidth="xl" padded className="py-24">
      <Center>
        <Stack gap={2} align="center">
          <Heading level={1} font="display">
            {strings.title}
          </Heading>
          <Text variant="body-2" foreground="muted">
            {slug}
          </Text>
        </Stack>
      </Center>
    </Container>
  );
}
