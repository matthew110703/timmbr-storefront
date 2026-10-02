import { Container, Center, Heading } from "@timmbr/ui";
import { strings } from "./strings";

export default function AccountPage() {
  return (
    <Container maxWidth="xl" padded className="py-24">
      <Center>
        <Heading level={1} font="display">
          {strings.appName}
        </Heading>
      </Center>
    </Container>
  );
}
