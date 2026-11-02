export type AppMode = 'responsible' | 'protected';

export interface User {
  id: string | number;
  email: string;
  name: string;
}

export interface Device {
  id: string;
  alias: string;
  model: string;
  os: string;
  linked: boolean;
  protected: boolean;
  lastSeen: string | null;
}

export interface AlertItem {
  id: string | number;
  event_type?: string;
  title?: string;
  message?: string;
  detail?: Record<string, unknown>;
  alias_name?: string;
  alert_time?: string;
  url?: string | null;
  creation_time?: string;
  event_time?: string;
  is_read?: boolean;
  read?: boolean;
}

export interface RuleSnapshot {
  domains: string[];
  version: number;
  checksum: number;
  syncedAt: string | null;
}

export interface QueuedEvent {
  id: string;
  device_uuid: string;
  event_type: 'blocked_access' | 'uninstall_attempt' | 'app_install_attempt' | 'os_permission_change' | 'lotba' | 'custom' | 'score_exceeded';
  url?: string | null;
  detail: Record<string, unknown>;
  is_sensitive: boolean;
  event_time: string;
}

export interface ApiError {
  error?: string;
  message?: string;
}
