// pqDate rules: advanced date rules
import { assertValid, endOf, startOf } from '@pqdate/core';

// RF-09 lastBusinessDayOfMonth: Mon-Fri, last weekday of month
export function lastBusinessDayOfMonth(d: Date): Date {
  assertValid(d);
  const monthEnd = endOf(d, 'month');
  // move to date only (UTC 00:00)
  let cur = startOf(monthEnd, 'day');
  // Day of week in local? Use UTC to be consistent with UTC policy
  // getUTCDay(): 0=Sun, 6=Sat
  while (true) {
    const dow = cur.getUTCDay();
    if (dow >= 1 && dow <= 5) return cur;
    // step back one day
    cur = new Date(cur.getTime() - 24 * 3600 * 1000);
  }
}

