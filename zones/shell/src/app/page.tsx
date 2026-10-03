import * as React from "react";
import { Stack } from "@timmbr/ui";
import { resolveLandingSections } from "./page.helper";

export default async function ShellPage() {
  const renderedSections = await resolveLandingSections();

  return (
    <Stack gap={8} className="w-full pb-16">
      {renderedSections}
    </Stack>
  );
}
