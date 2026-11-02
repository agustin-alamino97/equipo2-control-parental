export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPassword(value: string): boolean {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
}

export function normalizeDomain(value: string): string | null {
  const input = value.trim().toLowerCase();
  if (!input || /\s/.test(input) || /^(?!https?:\/\/)[a-z][a-z\d+.-]*:\/\//.test(input)) return null;
  const withoutScheme = input.replace(/^https?:\/\//, '');
  if (/[/?#@]/.test(withoutScheme.replace(/\/$/, ''))) return null;
  const domain = withoutScheme.replace(/\/$/, '').replace(/^www\./, '').replace(/:\d+$/, '');
  if (
    domain.length > 253
    || !domain.includes('.')
    || !domain.split('.').every((label) => (
      label.length > 0
      && label.length <= 63
      && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
    ))
  ) {
    return null;
  }
  return domain;
}
