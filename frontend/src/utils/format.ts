const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export function formatDate(value?: string | null): string {
  return value ? dateFormatter.format(new Date(value)) : "—";
}

export function formatDateTime(value?: string | null): string {
  return value ? dateTimeFormatter.format(new Date(value)) : "—";
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency.trim() }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

/** ISO timestamp → value for <input type="datetime-local"> in the browser's time zone. */
export function toDateTimeLocal(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

/** <input type="datetime-local"> value → ISO timestamp with offset (UTC). */
export function fromDateTimeLocal(value: string): string {
  return new Date(value).toISOString();
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
