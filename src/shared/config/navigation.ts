import {
  LayoutDashboard,
  MapPin,
  Router,
  Settings,
  ShoppingBag,
  HistoryIcon,
  Users,
  History,
  CreditCard,
  Ticket
} from 'lucide-react';
import type { UserRole } from '../types';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  roles: string[];
}

export const navigationConfig: NavItem[] = [
  // Common (Profile) - actually it's usually in a special place, but we'll include it or keep it separate

  // ADMIN-only
  {
    title: 'Utilisateurs',
    href: '/admin/users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    title: 'Logs Système',
    href: '/admin/logs',
    icon: History,
    roles: ['ADMIN'],
  },

  // ADMIN_WIFI
  {
    title: 'Sites',
    href: '/sites',
    icon: MapPin,
    roles: ['ADMIN_WIFI'],
  },
  {
    title: 'Routeurs',
    href: '/routeurs',
    icon: Router,
    roles: ['ADMIN_WIFI'],
  },
  {
    title: 'Forfaits',
    href: '/forfaits',
    icon: Settings,
    roles: ['ADMIN_WIFI'],
  },

  // CLIENT
  {
    title: 'Acheter un forfait',
    href: '/acheter',
    icon: ShoppingBag,
    roles: ['CLIENT'],
  },
  {
    title: 'Mes Jetons',
    href: '/jetons',
    icon: Ticket,
    roles: ['CLIENT'],
  },
];
