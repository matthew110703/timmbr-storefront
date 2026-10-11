"use client";

import { useState } from "react";
import { Alert, Button, Card, Icon, Inline, Stack, Text } from "@timmbr/ui";
import { LocateFixed, MapPin } from "@timmbr/icons";
import { isApiError } from "@timmbr/utils";
import { geoApi } from "@/lib/api/browser";
import { strings } from "@/app/strings";
import type { ReverseGeocode } from "@/lib/api/types";

const t = strings.addresses.form.location;

type Notice = {
  tone: "success" | "warning" | "destructive";
  text: string;
} | null;

interface LocationPinProps {
  latitude: number | null;
  longitude: number | null;
  /** A point was found; `address` is null when the lookup failed (the pin still counts). */
  onPin: (
    latitude: number,
    longitude: number,
    address: ReverseGeocode | null,
  ) => void;
  onClear: () => void;
}

function currentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10_000,
      maximumAge: 60_000,
    }),
  );
}

/**
 * Optional "Use my current location": pins the browser's position on the
 * address and offers the looked-up address to fill empty fields.
 */
export function LocationPin({
  latitude,
  longitude,
  onPin,
  onClear,
}: LocationPinProps) {
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const pinned = latitude !== null && longitude !== null;

  const locate = async () => {
    if (!("geolocation" in navigator)) {
      setNotice({ tone: "warning", text: t.unsupported });
      return;
    }
    setLocating(true);
    setNotice(null);
    try {
      let position: GeolocationPosition;
      try {
        position = await currentPosition();
      } catch (error) {
        const denied = (error as GeolocationPositionError).code === 1;
        setNotice({ tone: "warning", text: denied ? t.denied : t.unavailable });
        return;
      }

      const lat = Number(position.coords.latitude.toFixed(6));
      const lon = Number(position.coords.longitude.toFixed(6));
      try {
        onPin(lat, lon, await geoApi.reverse(lat, lon));
        setNotice({ tone: "success", text: t.filled });
      } catch (error) {
        if (isApiError(error) && error.code === "LOCATION_OUTSIDE_INDIA") {
          // We can't deliver there: don't keep the pin.
          setNotice({ tone: "destructive", text: error.message });
          return;
        }
        onPin(lat, lon, null);
        setNotice({ tone: "warning", text: t.lookupFailed });
      }
    } finally {
      setLocating(false);
    }
  };

  return (
    <Card variant="inset" padding="sm" data-testid="location-pin">
      <Stack gap={3}>
        <Stack gap={1}>
          <Text variant="body-2-semibold">
            {t.title}{" "}
            <Text as="span" variant="body-2" foreground="muted">
              · {t.optional}
            </Text>
          </Text>
          <Text variant="body-3" foreground="muted">
            {t.hint}
          </Text>
        </Stack>

        {pinned ? (
          <Inline rowGap={1} colGap={3} role="status">
            <Inline asChild gap={1.5} wrap={false}>
              <Text as="span" variant="body-2-medium" foreground="success">
                <Icon size="sm">
                  <MapPin />
                </Icon>
                {t.pinned}
              </Text>
            </Inline>
            <Text as="span" variant="body-3" foreground="muted" tabular>
              {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </Text>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => {
                onClear();
                setNotice(null);
              }}
            >
              {t.remove}
            </Button>
          </Inline>
        ) : (
          <Inline>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<LocateFixed />}
              loading={locating}
              loadingText={t.locating}
              onClick={locate}
            >
              {t.use}
            </Button>
          </Inline>
        )}

        {notice && (
          <Alert variant={notice.tone} size="sm">
            {notice.text}
          </Alert>
        )}
      </Stack>
    </Card>
  );
}
