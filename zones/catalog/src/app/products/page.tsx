import type { Metadata } from "next";
import { Container, Center, Heading } from "@timmbr/ui";
import { strings } from "./strings";

export const metadata: Metadata = {
  title: strings.metadata.title,
  description: strings.metadata.description,
};

export default function ProductsPage() {
  return (
    <Container maxWidth="xl" padded className="py-24">
      <Center>
        <Heading level={1} font="display">
          {strings.title}
        </Heading>
      </Center>
    </Container>
  );
}
