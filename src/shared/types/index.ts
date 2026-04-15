export type UserRole = 'ADMIN' | 'ADMIN_WIFI' | 'CLIENT';

export interface UserDetails{
  id:string;
  email:string;
  role:string;
  active:boolean;
  createdAt:Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  statut: 'ACTIF' | 'SUSPENDU' | 'INACTIF';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;

}

export interface Site {
  id: string;
  nom: string;
  adresse: string;
  domaine: string;
  createdAt?: string;
}

export interface Routeur {
  id: string;
  nom: string;
  identifiant: string;
  siteId: string;
  siteNom?: string;
  statut: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  derniereConnexion?: string;
  version: string;
}

export interface Forfait {
  id: string;
  nom: string;
  prix: number;
  duree: number;
  maxDevices: number;
  volume: string;
  isActive: boolean;
  description?: string;
  sites?: string[]; // Site IDs
  siteId?: string; // For backward compatibility/simpler mocks
}


export interface Jeton {
  id: string;
  code: string;
  pin: string;
  dateExpiration: string;
  volumeRestant: string;
  statut: 'ACTIF' | 'EXPIRE' | 'EPUISE';
  siteNom: string;
  siteId?: string;
  forfaitNom?: string;
}


export interface SystemLog {
  id: string;
  date: string;
  niveau: 'INFO' | 'WARNING' | 'ERROR';
  composant: string;
  message: string;
}
