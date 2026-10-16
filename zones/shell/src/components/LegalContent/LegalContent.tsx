import * as React from "react";
import { Heading, Text, Stack } from "@timmbr/ui";
import type {
  LegalContentSectionData,
  LegalSectionBlock,
  LegalSubsection,
} from "@/lib/api/types";

export interface LegalContentProps {
  data: LegalContentSectionData;
}

function LegalSubsectionBlock({ sub }: { sub: LegalSubsection }) {
  const headingId = `subsection-${sub.id.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <Stack as="section" gap={2} className="pt-1" aria-labelledby={headingId}>
      <Heading
        id={headingId}
        level={3}
        className="text-base font-semibold text-foreground"
      >
        {sub.id} {sub.heading}
      </Heading>
      {sub.paragraphs?.map((p, i) => (
        <Text
          key={i}
          as="p"
          variant="body-1"
          className="text-sm leading-relaxed text-foreground-muted"
        >
          {p}
        </Text>
      ))}
      {sub.items && sub.items.length > 0 && (
        <ul className="list-disc pl-5 space-y-1">
          {sub.items.map((item, i) => (
            <li key={i}>
              <Text
                as="span"
                variant="body-1"
                className="text-sm leading-relaxed text-foreground-muted"
              >
                {item}
              </Text>
            </li>
          ))}
        </ul>
      )}
      {sub.trailingParagraphs?.map((p, i) => (
        <Text
          key={i}
          as="p"
          variant="body-1"
          className="text-sm leading-relaxed text-foreground-muted"
        >
          {p}
        </Text>
      ))}
    </Stack>
  );
}

function LegalSectionItem({ section }: { section: LegalSectionBlock }) {
  const headingId = `section-${section.id.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <Stack as="section" gap={3} aria-labelledby={headingId}>
      <Heading
        id={headingId}
        level={2}
        className="text-lg font-semibold text-foreground"
      >
        {section.id}. {section.heading}
      </Heading>
      {section.paragraphs?.map((p, i) => (
        <Text
          key={i}
          as="p"
          variant="body-1"
          className="text-sm leading-relaxed text-foreground-muted"
        >
          {p}
        </Text>
      ))}
      {section.items && section.items.length > 0 && (
        <ul className="list-disc pl-5 space-y-1">
          {section.items.map((item, i) => (
            <li key={i}>
              <Text
                as="span"
                variant="body-1"
                className="text-sm leading-relaxed text-foreground-muted"
              >
                {item}
              </Text>
            </li>
          ))}
        </ul>
      )}
      {section.trailingParagraphs?.map((p, i) => (
        <Text
          key={i}
          as="p"
          variant="body-1"
          className="text-sm leading-relaxed text-foreground-muted"
        >
          {p}
        </Text>
      ))}
      {section.subsections && section.subsections.length > 0 && (
        <Stack gap={4} className="pl-1">
          {section.subsections.map((sub) => (
            <LegalSubsectionBlock key={sub.id} sub={sub} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export function LegalContent({ data }: LegalContentProps) {
  const articleId = `legal-${data.title?.toLowerCase().replace(/\s+/g, "-") ?? "document"}`;
  return (
    <Stack
      as="article"
      gap={8}
      aria-label={data.title}
      itemScope
      itemType="https://schema.org/WebPage"
      className="w-full max-w-4xl mx-auto py-8 pb-16"
    >
      {/* Document header */}
      <Stack as="header" gap={3}>
        <Heading
          id={articleId}
          level={1}
          font="display"
          className="text-3xl sm:text-4xl tracking-tight text-foreground"
          itemProp="name"
        >
          {data.title}
        </Heading>
        {(data.effectiveDate || data.lastUpdated) && (
          <Stack gap={1}>
            {data.effectiveDate && (
              <Text
                as="p"
                variant="body-2"
                className="text-sm text-foreground-muted"
              >
                <time itemProp="datePublished" dateTime={data.effectiveDate}>
                  Effective Date: {data.effectiveDate}
                </time>
              </Text>
            )}
            {data.lastUpdated && (
              <Text
                as="p"
                variant="body-2"
                className="text-sm text-foreground-muted"
              >
                <time itemProp="dateModified" dateTime={data.lastUpdated}>
                  Last Updated: {data.lastUpdated}
                </time>
              </Text>
            )}
          </Stack>
        )}
        {data.intro && (
          <Text
            as="p"
            variant="body-1"
            className="text-sm leading-relaxed text-foreground-muted pt-2"
            itemProp="description"
          >
            {data.intro}
          </Text>
        )}
      </Stack>

      {/* Document body */}
      <Stack gap={8}>
        {data.sections.map((section) => (
          <LegalSectionItem key={section.id} section={section} />
        ))}
      </Stack>
    </Stack>
  );
}

export default LegalContent;
