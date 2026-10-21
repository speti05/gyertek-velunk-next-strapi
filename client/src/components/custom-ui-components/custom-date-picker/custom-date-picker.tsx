"use client";

import React, { useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/hu";
import "dayjs/locale/en-gb";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { huHU, enUS } from "@mui/x-date-pickers/locales";
import { useLocale } from "@/context/locale-context";
import type { Locale } from "@/i18n/config";

// The dayjs locale follows INTL_LOCALE (en -> en-GB), so the field reads day before
// month in both languages, just like the dates formatted elsewhere on the site.
// `toolbarFormat` is the picked date in the mobile dialog's header: MUI's default
// ("D MMMM" -> "3 October") suits English, but Hungarian puts the month first
// ("október 3."), so it is overridden there.
const PICKER_LOCALE: Record<
  Locale,
  {
    adapterLocale: string;
    localeText: typeof huHU.components.MuiLocalizationProvider.defaultProps.localeText;
    toolbarFormat?: string;
  }
> = {
  hu: {
    adapterLocale: "hu",
    localeText: huHU.components.MuiLocalizationProvider.defaultProps.localeText,
    toolbarFormat: "MMMM D.",
  },
  en: {
    adapterLocale: "en-gb",
    localeText: enUS.components.MuiLocalizationProvider.defaultProps.localeText,
  },
};

// The stored value stays ISO (YYYY-MM-DD), the same language-neutral string the
// former native date input produced
const ISO_FORMAT = "YYYY-MM-DD";

// MUI only checks `pointer: fine` by default, so a narrow window driven by a mouse (or a
// phone that reports a fine pointer) still got the desktop popover. The mobile dialog
// is used below the `phone` breakpoint of sass/base/_mixins.scss (900px) as well as on
// any touch device; the desktop popover needs both a fine pointer and a wider screen.
const DESKTOP_MODE_MEDIA_QUERY = "@media (pointer: fine) and (min-width: 56.3125em)";

const toDayjs =(value: string | undefined): Dayjs | null => (value ? dayjs(value) : null);
const toIso = (date: Dayjs | null): string => (date?.isValid() ? date.format(ISO_FORMAT) : "");

type CustomDatePickerProps = {
  label: string;
  /** ISO date (YYYY-MM-DD), or an empty string when nothing is picked */
  value: string;
  /** Receives an ISO date, or an empty string while the field is empty or incomplete */
  onChange: (value: string) => void;
  error?: string | boolean;
  required?: boolean;
  disabled?: boolean;
  /** ISO date; earlier days cannot be picked */
  minDate?: string;
  /** ISO date; later days cannot be picked */
  maxDate?: string;
  name?: string;
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  minDate,
  maxDate,
  name,
}) => {
  const locale = useLocale();
  const { adapterLocale, localeText, toolbarFormat } = PICKER_LOCALE[locale];

  // A half-typed date is invalid, so the parent only ever sees "" for it. Feeding that
  // "" straight back would wipe the sections being typed, so the picker keeps its own
  // draft and only takes the prop over when the parent actually changed it.
  const [draft, setDraft] = useState<Dayjs | null>(() => toDayjs(value));
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== toIso(draft)) setDraft(toDayjs(value));
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={adapterLocale}
      localeText={localeText}
    >
      <DatePicker
        label={label}
        value={draft}
        onChange={(next) => {
          setDraft(next);
          onChange(toIso(next));
        }}
        desktopModeMediaQuery={DESKTOP_MODE_MEDIA_QUERY}
        disabled={disabled}
        minDate={toDayjs(minDate) ?? undefined}
        maxDate={toDayjs(maxDate) ?? undefined}
        slotProps={{
          toolbar: { toolbarFormat },
          textField: {
            name,
            required,
            fullWidth: true,
            error: !!error,
            // a helper line is always rendered so the field keeps the same height as
            // CustomTextInput with or without an error
            helperText: typeof error === "string" && error ? error : " ",
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
