import {
  Container,
  Stack,
  Inline,
  Heading,
  Text,
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
} from "@timmbr/ui";
import { Sparkles } from "@timmbr/icons";
import { strings } from "./strings";

export default function HomePage() {
  return (
    <Container maxWidth="lg" padded>
      <Stack gap={8}>
        {/* Hero Section */}
        <Stack gap={4} align="center" className="text-center py-8">
          <Badge variant="primary" dot size="md">
            {strings.hero.pill}
          </Badge>

          <Heading level={1} font="display" foreground="default">
            {strings.hero.title}{" "}
            <span className="text-primary">{strings.hero.titleAccent}</span>
          </Heading>

          <Text
            variant="body-1"
            foreground="muted"
            className="max-w-2xl text-center"
          >
            {strings.hero.description}
          </Text>

          <Inline gap={4} justify="center" className="pt-2">
            <Button variant="default" size="lg" asChild>
              <a href="/health" target="_blank">
                {strings.hero.ctaProbe}
              </a>
            </Button>
          </Inline>
        </Stack>

        {/* Ingress Control Plane Card */}
        <div className="max-w-2xl mx-auto w-full">
          <Card variant="interactive" padding="lg">
            <CardHeader>
              <Inline justify="between" align="center">
                <Inline gap={2} align="center">
                  <span
                    className="text-primary inline-flex shrink-0"
                    aria-hidden="true"
                  >
                    <Sparkles className="size-5" />
                  </span>
                  <CardTitle>{strings.controlPlaneCard.name}</CardTitle>
                </Inline>
                <Badge variant="subtle" size="sm">
                  {strings.controlPlaneCard.tag}
                </Badge>
              </Inline>
              <CardDescription>
                {strings.controlPlaneCard.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <DataList orientation="horizontal" divided size="default">
                <DataListItem>
                  <DataListLabel>
                    {strings.controlPlaneCard.portLabel}
                  </DataListLabel>
                  <DataListValue>
                    <Badge variant="primary" size="sm">
                      {strings.controlPlaneCard.portValue}
                    </Badge>
                  </DataListValue>
                </DataListItem>
                <DataListItem>
                  <DataListLabel>
                    {strings.controlPlaneCard.nextAppsLabel}
                  </DataListLabel>
                  <DataListValue>
                    <Text variant="body-2">
                      {strings.controlPlaneCard.nextAppsValue}
                    </Text>
                  </DataListValue>
                </DataListItem>
                <DataListItem>
                  <DataListLabel>
                    {strings.controlPlaneCard.bundlerLabel}
                  </DataListLabel>
                  <DataListValue>
                    <Text variant="body-2" weight="semibold">
                      {strings.controlPlaneCard.bundlerValue}
                    </Text>
                  </DataListValue>
                </DataListItem>
              </DataList>
            </CardContent>
          </Card>
        </div>
      </Stack>
    </Container>
  );
}
