import {
  Home,
  MapPin,
  Router,
  Settings,
  ShoppingBag,
  Users,
  History,
  Ticket,
  Flag,
  Wallet,
  BarChart2,
  WalletCards,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: string[];
}

export const navigationConfig: NavItem[] = [
  // SUPER_ADMIN only
  {
    title: 'Utilisateurs',
    href: '/admin/users',
    icon: Users,
    roles: ['SUPER_ADMIN'],
  },
  {
    title: 'Logs Système',
    href: '/admin/logs',
    icon: History,
    roles: ['SUPER_ADMIN'],
  },
  {
    title: 'Countries',
    href: '/admin/countries',
    icon: Flag,
    roles: ['SUPER_ADMIN'],
  },
  {
    title: 'Méthodes de paiement',
    href: '/admin/payment-methods',
    icon: Wallet,
    roles: ['SUPER_ADMIN'],
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
  {
    title: 'Statistiques',
    href: '/stats',
    icon: BarChart2,
    roles: ['ADMIN_WIFI'],
  },
  {
    title: 'Portefeuille',
    href: '/wallet',
    icon: WalletCards,
    roles: ['ADMIN_WIFI'],
  },
  // CLIENT
  {
    title: 'Accueil',
    href: '/home',
    icon: Home,
    roles: ['CLIENT'],
  },
  {
    title: 'Acheter un forfait',
    href: '/acheter',
    icon: ShoppingBag,
    roles: ['CLIENT'],
  },
  {
    title: 'Mes Souscriptions',
    href: '/souscriptions',
    icon: Ticket,
    roles: ['CLIENT'],
  },
];
