"use client";

import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Fieldset,
  FormActions,
  Grid,
  Input,
  RadioGroup,
  ResponsiveDialogForm,
  Select,
  Stack,
} from "@timmbr/ui";
import { strings } from "@/app/strings";
import type { Address, ReverseGeocode } from "@/lib/api/types";
import { INDIAN_STATES } from "./indianStates";
import { LocationPin } from "./LocationPin";
import { LOCATION_FIELDS, locationFill } from "./location";
import {
  ADDRESS_LABELS,
  addressSchema,
  toFormValues,
  type AddressFormInput,
  type AddressFormValues,
} from "./validationSchema";

const f = strings.addresses.form;
const STATE_OPTIONS = INDIAN_STATES.map((state) => ({
  value: state,
  label: state,
}));
const LABEL_OPTIONS = ADDRESS_LABELS.map((value) => ({
  value,
  label: strings.addresses.labels[value],
}));

interface AddressFormProps {
  /** Editing an existing address; omitted when adding. */
  address?: Address;
  /** Hide "make default" (e.g. it already is, or it's the first address). */
  showDefaultOption?: boolean;
  onSubmit: (values: AddressFormValues) => Promise<void>;
  onCancel: () => void;
  /**
   * Places the fields and the Save / Cancel buttons, e.g. into a dialog body
   * and a pinned footer. Both stay inside the <form>. Default: stacked.
   */
  children?: (parts: {
    fields: React.ReactNode;
    actions: React.ReactNode;
  }) => React.ReactNode;
}

export function AddressForm({
  address,
  showDefaultOption = true,
  onSubmit,
  onCancel,
  children,
}: AddressFormProps) {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isDirty, isSubmitting, isSubmitted },
  } = useForm<AddressFormInput, unknown, AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: toFormValues(address),
  });
  const [latitude, longitude] = useWatch({
    control,
    name: ["latitude", "longitude"],
  });

  const pin = (lat: number, lon: number, found: ReverseGeocode | null) => {
    setValue("latitude", lat, { shouldDirty: true });
    setValue("longitude", lon, { shouldDirty: true });
    if (!found) return;
    const current = getValues();
    const fill = locationFill(found, {
      line1: current.line1,
      line2: current.line2,
      city: current.city,
      state: current.state,
      postalCode: current.postalCode,
    });
    for (const field of LOCATION_FIELDS) {
      const value = fill[field];
      if (value)
        setValue(field, value, {
          shouldDirty: true,
          shouldValidate: isSubmitted,
        });
    }
  };

  const clearPin = () => {
    setValue("latitude", null, { shouldDirty: true });
    setValue("longitude", null, { shouldDirty: true });
  };

  const fields = (
    <Stack gap={6}>
      <Fieldset legend={f.sections.contact}>
        <Grid cols={{ sm: 2 }} gap={4}>
          <Input
            label={f.firstName}
            autoComplete="given-name"
            error={errors.fname?.message}
            {...register("fname")}
          />
          <Input
            label={f.lastName}
            autoComplete="family-name"
            error={errors.lname?.message}
            {...register("lname")}
          />
        </Grid>
        <Input
          label={f.phone}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          leftAdornment="+91"
          helperText={errors.phone ? undefined : f.phoneHint}
          error={errors.phone?.message}
          {...register("phone")}
        />
      </Fieldset>

      <Fieldset legend={f.sections.address}>
        <LocationPin
          latitude={latitude ?? null}
          longitude={longitude ?? null}
          onPin={pin}
          onClear={clearPin}
        />
        <Input
          label={f.line1}
          autoComplete="address-line1"
          helperText={errors.line1 ? undefined : f.line1Hint}
          error={errors.line1?.message}
          {...register("line1")}
        />
        <Input
          label={f.line2}
          autoComplete="address-line2"
          error={errors.line2?.message}
          {...register("line2")}
        />
        <Grid cols={{ sm: 2 }} gap={4}>
          <Input
            label={f.city}
            autoComplete="address-level2"
            error={errors.city?.message}
            {...register("city")}
          />
          <Input
            label={f.postalCode}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            error={errors.postalCode?.message}
            {...register("postalCode")}
          />
        </Grid>
        <Controller
          control={control}
          name="state"
          render={({ field }) => (
            <Select
              label={f.state}
              placeholder={f.statePlaceholder}
              options={STATE_OPTIONS}
              value={field.value ?? ""}
              onValueChange={field.onChange}
              error={errors.state?.message}
              name={field.name}
            />
          )}
        />
      </Fieldset>

      <Stack gap={4}>
        <Controller
          control={control}
          name="label"
          render={({ field }) => (
            <RadioGroup
              label={f.label}
              options={LABEL_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
              orientation="horizontal"
              name={field.name}
            />
          )}
        />
        {showDefaultOption && (
          <Controller
            control={control}
            name="isDefault"
            render={({ field }) => (
              <Checkbox
                label={f.makeDefault}
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            )}
          />
        )}
      </Stack>
    </Stack>
  );

  // Editing: nothing to save until a field changes (no request without changes).
  const unchanged = Boolean(address) && !isDirty;

  const actions = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {f.cancel}
      </Button>
      <Button
        type="submit"
        variant="primary"
        loading={isSubmitting}
        disabled={unchanged}
      >
        {f.save}
      </Button>
    </>
  );

  return (
    // The form wraps the dialog body and its pinned footer (or the fields and actions on a page).
    <ResponsiveDialogForm onSubmit={handleSubmit(onSubmit)} noValidate>
      {children ? (
        children({ fields, actions })
      ) : (
        <Stack gap={6}>
          {fields}
          <FormActions divider>{actions}</FormActions>
        </Stack>
      )}
    </ResponsiveDialogForm>
  );
}
