import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];
type MCIconsName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type IconConfig =
  | { set: 'ion'; name: IoniconsName }
  | { set: 'mc'; name: MCIconsName };

export const ICONS = {
  home: { set: 'ion', name: 'home-outline' },
  homeActive: { set: 'ion', name: 'home' },
  protection: { set: 'ion', name: 'shield-outline' },
  protectionActive: { set: 'ion', name: 'shield' },
  profile: { set: 'ion', name: 'person-outline' },
  profileActive: { set: 'ion', name: 'person' },
  shieldCheck: { set: 'ion', name: 'shield-checkmark-outline' },
  shieldCheckFilled: { set: 'ion', name: 'shield-checkmark' },
  login: { set: 'ion', name: 'log-in-outline' },
  register: { set: 'ion', name: 'create-outline' },
  search: { set: 'ion', name: 'search-outline' },
  back: { set: 'ion', name: 'arrow-back' },
  next: { set: 'ion', name: 'chevron-forward' },
  ban: { set: 'ion', name: 'ban-outline' },
  eye: { set: 'ion', name: 'eye-outline' },
  settings: { set: 'ion', name: 'settings-outline' },
  list: { set: 'ion', name: 'list-outline' },
  globe: { set: 'ion', name: 'globe-outline' },
  removeCircle: { set: 'ion', name: 'remove-circle-outline' },
  link: { set: 'ion', name: 'link-outline' },
  phone: { set: 'ion', name: 'phone-portrait-outline' },
  tablet: { set: 'ion', name: 'tablet-portrait-outline' },
  laptop: { set: 'ion', name: 'laptop-outline' },
  mail: { set: 'ion', name: 'mail-outline' },
  checkCircle: { set: 'ion', name: 'checkmark-circle' },
  warning: { set: 'ion', name: 'warning-outline' },
  lock: { set: 'ion', name: 'lock-closed-outline' },
  square: { set: 'ion', name: 'square-outline' },
  checkbox: { set: 'ion', name: 'checkbox' },
  child: { set: 'mc', name: 'account-child' },
  logoGooglePlaystore: { set: 'mc', name: 'google-play' as MCIconsName }, //Logo tienda PlayStore Google
} as const satisfies Record<string, IconConfig>;

export type IconKey = keyof typeof ICONS;