 import api from '@/api/axiosConfig'; 
import type { User, UserDetails } from '@/shared/types';

const MOCK_USERS: User[] = [
  { id: '1', nom: 'Kamga', prenom: 'Joel', email: 'joel@rik.com', role: 'ADMIN', telephone: '+237 677 00 11 22', statut: 'ACTIF' },
  { id: '2', nom: 'Tchakoute', prenom: 'Marie', email: 'marie@site.com', role: 'ADMIN_WIFI', telephone: '+237 699 33 44 55', statut: 'ACTIF' },
  { id: '3', nom: 'Ngo', prenom: 'Alice', email: 'alice@client.com', role: 'CLIENT', telephone: '+237 655 66 77 88', statut: 'ACTIF' },
  { id: '4', nom: 'Etonde', prenom: 'Paul', email: 'paul@blocked.com', role: 'CLIENT', telephone: '+237 611 22 33 44', statut: 'INACTIF' },
];

export const userApi = {
  getAll: async (): Promise<UserDetails[]> => {
  const response = await api.get<UserDetails[]>("/api/users");
  return response.data;
},
  delete: async (_id: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { data: null };
  }
};
