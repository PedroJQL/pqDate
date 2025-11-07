type Duration = Partial<{
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}>;
type PqErrorCode = 'E_PARSE_INVALID' | 'E_RANGE' | 'E_ARG_INVALID';
declare class PqDateError extends Error {
    code: PqErrorCode;
    constructor(code: PqErrorCode, message: string);
}
declare function assertValid(d: Date): void;
declare function parseISO(input: string): Date;
declare function formatISO(d: Date): string;
declare function add(d: Date, dur: Duration): Date;
declare function sub(d: Date, dur: Duration): Date;
declare function startOf(d: Date, unit: 'day' | 'month' | 'year'): Date;
declare function endOf(d: Date, unit: 'day' | 'month' | 'year'): Date;
declare function isBefore(a: Date, b: Date): boolean;
declare function isAfter(a: Date, b: Date): boolean;
declare function isSame(a: Date, b: Date, unit: 'day' | 'month' | 'year'): boolean;
declare function differenceInDays(a: Date, b: Date): number;
declare function isWithinInterval(d: Date, itv: {
    start: Date;
    end: Date;
}): boolean;
declare function toLocal(dUTC: Date): Date;

type PqLocale = 'es-ES' | 'en-US';
type LocalFormatOptions = {
    locale?: PqLocale;
    dateStyle?: 'short' | 'medium' | 'long';
    timeStyle?: 'short' | 'medium' | 'long';
};
declare function formatLocal(d: Date, opts?: LocalFormatOptions): string;

declare function lastBusinessDayOfMonth(d: Date): Date;

export { type Duration, type LocalFormatOptions, PqDateError, type PqErrorCode, type PqLocale, add, assertValid, differenceInDays, endOf, formatISO, formatLocal, isAfter, isBefore, isSame, isWithinInterval, lastBusinessDayOfMonth, parseISO, startOf, sub, toLocal };
