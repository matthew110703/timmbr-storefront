import * as React from "react";
import { Container } from "@timmbr/ui";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Container padded>{children}</Container>;
}
