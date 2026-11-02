import type { AlertItem } from '../types';

export function alertTitle(alert: AlertItem): string {
  if (alert.title) return alert.title;
  switch (alert.event_type) {
    case 'blocked_access': return 'Acceso bloqueado';
    case 'uninstall_attempt': return 'Intento de desinstalación';
    case 'app_install_attempt': return 'Intento de instalación';
    case 'os_permission_change': return 'Cambio de permisos';
    case 'score_exceeded': return 'Límite de uso excedido';
    default: return alert.event_type ?? 'Alerta de protección';
  }
}

export function alertMessage(alert: AlertItem): string {
  if (alert.message) return alert.message;
  const details = alert.detail ?? {};
  const site = alert.url ?? (typeof details.domain === 'string' ? details.domain : null);
  return [site, alert.alias_name].filter((value): value is string => Boolean(value)).join(' · ')
    || 'Se registró una actividad en un dispositivo vinculado.';
}

export function alertTimestamp(alert: AlertItem): number | null {
  const value = alert.alert_time ?? alert.creation_time ?? alert.event_time;
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function formatAlertDate(value?: string): string {
  if (!value) return 'Fecha no disponible';
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toLocaleString() : 'Fecha no disponible';
}

export function sortAlertsByNewest(alerts: AlertItem[]): AlertItem[] {
  return [...alerts].sort((first, second) => (
    (alertTimestamp(second) ?? 0) - (alertTimestamp(first) ?? 0)
  ));
}
