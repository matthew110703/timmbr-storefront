import {
  Container,
  Stack,
  Inline,
  Grid,
  Heading,
  Text,
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@timmbr/ui";
import { Sparkles, ArrowRight, CheckCircle, Package } from "@timmbr/icons";
import { strings } from "./strings";

export default function ProductHomePage() {
  return (
    <Container maxWidth="xl" padded className="py-12">
      <Stack gap={16}>
        {/* ========================================================= */}
        {/* 1. Hero Section                                           */}
        {/* ========================================================= */}
        <Stack gap={6} align="center" className="text-center py-10 md:py-16">
          <Badge variant="brand" dot size="md">
            {strings.hero.badge}
          </Badge>

          <Heading
            level={1}
            font="display"
            foreground="default"
            className="max-w-4xl"
          >
            {strings.hero.headline}{" "}
            <span className="text-primary italic font-serif">
              {strings.hero.headlineAccent}
            </span>
          </Heading>

          <Text
            variant="body-1"
            foreground="muted"
            className="max-w-2xl text-center text-lg leading-relaxed"
          >
            {strings.hero.subhead}
          </Text>

          <Inline gap={4} justify="center" className="pt-4">
            <Button variant="default" size="lg" asChild>
              <a href="/home#featured">
                <span>{strings.hero.primaryCta}</span>
                <ArrowRight className="size-4 ml-1" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/home#craft">
                <span>{strings.hero.secondaryCta}</span>
              </a>
            </Button>
          </Inline>
        </Stack>

        {/* ========================================================= */}
        {/* 2. Value Propositions Bar                                 */}
        {/* ========================================================= */}
        <div id="craft">
          <Grid
            cols={4}
            gap={4}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            <Card variant="outline" padding="md">
              <Stack gap={2}>
                <Inline gap={2} align="center">
                  <CheckCircle className="size-4 text-primary shrink-0" />
                  <Text variant="subtitle-1" weight="semibold">
                    {strings.valueProps.sustainability.title}
                  </Text>
                </Inline>
                <Text variant="body-3" foreground="muted">
                  {strings.valueProps.sustainability.description}
                </Text>
              </Stack>
            </Card>

            <Card variant="outline" padding="md">
              <Stack gap={2}>
                <Inline gap={2} align="center">
                  <CheckCircle className="size-4 text-primary shrink-0" />
                  <Text variant="subtitle-1" weight="semibold">
                    {strings.valueProps.joinery.title}
                  </Text>
                </Inline>
                <Text variant="body-3" foreground="muted">
                  {strings.valueProps.joinery.description}
                </Text>
              </Stack>
            </Card>

            <Card variant="outline" padding="md">
              <Stack gap={2}>
                <Inline gap={2} align="center">
                  <CheckCircle className="size-4 text-primary shrink-0" />
                  <Text variant="subtitle-1" weight="semibold">
                    {strings.valueProps.finishes.title}
                  </Text>
                </Inline>
                <Text variant="body-3" foreground="muted">
                  {strings.valueProps.finishes.description}
                </Text>
              </Stack>
            </Card>

            <Card variant="outline" padding="md">
              <Stack gap={2}>
                <Inline gap={2} align="center">
                  <CheckCircle className="size-4 text-primary shrink-0" />
                  <Text variant="subtitle-1" weight="semibold">
                    {strings.valueProps.warranty.title}
                  </Text>
                </Inline>
                <Text variant="body-3" foreground="muted">
                  {strings.valueProps.warranty.description}
                </Text>
              </Stack>
            </Card>
          </Grid>
        </div>

        {/* ========================================================= */}
        {/* 3. Curated Room Categories                                */}
        {/* ========================================================= */}
        <Stack gap={8} id="categories">
          <Stack gap={2} align="center" className="text-center">
            <Text
              variant="body-3"
              weight="semibold"
              className="uppercase tracking-widest text-primary"
            >
              {strings.featuredCategories.eyebrow}
            </Text>
            <Heading level={2} font="display">
              {strings.featuredCategories.title}
            </Heading>
            <Text
              variant="body-2"
              foreground="muted"
              className="max-w-xl text-center"
            >
              {strings.featuredCategories.description}
            </Text>
          </Stack>

          <Grid
            cols={4}
            gap={6}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {strings.featuredCategories.categories.map((cat) => (
              <Card
                key={cat.id}
                variant="interactive"
                padding="lg"
                className="h-full flex flex-col justify-between"
              >
                <CardHeader>
                  <Inline justify="between" align="center">
                    <Badge variant="subtle" size="sm">
                      {cat.tag}
                    </Badge>
                    <Text variant="body-3" foreground="muted">
                      {cat.itemCount}
                    </Text>
                  </Inline>
                  <CardTitle className="pt-3">{cat.name}</CardTitle>
                  <CardDescription>{cat.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between"
                    asChild
                  >
                    <a href={`/home#${cat.id}`}>
                      <span>Explore</span>
                      <ArrowRight className="size-3.5" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Stack>

        {/* ========================================================= */}
        {/* 4. Signature Edition Products                             */}
        {/* ========================================================= */}
        <Stack gap={8} id="featured">
          <Inline justify="between" align="end" className="flex-wrap gap-4">
            <Stack gap={2}>
              <Text
                variant="body-3"
                weight="semibold"
                className="uppercase tracking-widest text-primary"
              >
                {strings.featuredProducts.eyebrow}
              </Text>
              <Heading level={2} font="display">
                {strings.featuredProducts.title}
              </Heading>
              <Text variant="body-2" foreground="muted">
                {strings.featuredProducts.description}
              </Text>
            </Stack>
            <Button variant="outline" size="md" asChild>
              <a href="/home#categories">
                <span>{strings.featuredProducts.viewAll}</span>
                <ArrowRight className="size-4 ml-1" />
              </a>
            </Button>
          </Inline>

          <Grid cols={3} gap={6} className="grid-cols-1 md:grid-cols-3">
            {strings.featuredProducts.products.map((product) => (
              <Card
                key={product.id}
                variant="interactive"
                padding="lg"
                className="flex flex-col justify-between"
              >
                <CardHeader>
                  <Inline justify="between" align="center">
                    <Badge variant={product.badgeVariant} size="sm">
                      {product.tag}
                    </Badge>
                    <Inline gap={1} align="center">
                      <Package className="size-3.5 text-neutral-400" />
                      <Text variant="body-3" foreground="muted">
                        {product.wood}
                      </Text>
                    </Inline>
                  </Inline>
                  <CardTitle className="pt-3">{product.name}</CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Text variant="subtitle-1" weight="bold" foreground="default">
                    {product.price}
                  </Text>
                </CardContent>
                <CardFooter className="pt-4 border-t border-grey-100">
                  <Button variant="default" size="sm" className="w-full">
                    <span>View Silhouette</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Stack>

        {/* ========================================================= */}
        {/* 5. Multi-Zone Architecture Indicator                      */}
        {/* ========================================================= */}
        <Card
          variant="subtle"
          padding="md"
          className="bg-primary/5 border border-primary/20"
        >
          <Inline justify="between" align="center" className="flex-wrap gap-3">
            <Inline gap={3} align="center">
              <span
                className="text-primary inline-flex shrink-0"
                aria-hidden="true"
              >
                <Sparkles className="size-5" />
              </span>
              <div>
                <Text variant="subtitle-1" weight="semibold">
                  {strings.zoneBadge.zoneName}
                </Text>
                <Text variant="body-3" foreground="muted">
                  {strings.zoneBadge.isolatedRuntime}
                </Text>
              </div>
            </Inline>
            <Badge variant="primary" size="md">
              {strings.zoneBadge.portLabel}
            </Badge>
          </Inline>
        </Card>
      </Stack>
    </Container>
  );
}
