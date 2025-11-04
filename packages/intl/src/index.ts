// pqDate intl: local formatting with Intl
import { assertValid } from '@pqdate/core';

export type PqLocale = 'es-ES'|'en-US';
export type LocalFormatOptions = {
  locale?: PqLocale;
  dateStyle?: 'short'|'medium'|'long';
  timeStyle?: 'short'|'medium'|'long';
};

export function formatLocal(d: Date, opts: LocalFormatOptions = {}): string {
  assertValid(d);
  const { locale = 'en-US', dateStyle = 'medium', timeStyle } = opts;
  const fmt = new Intl.DateTimeFormat(locale, {
    dateStyle: dateStyle,
    ...(timeStyle ? { timeStyle } : {})
  });
  return fmt.format(d);
}

