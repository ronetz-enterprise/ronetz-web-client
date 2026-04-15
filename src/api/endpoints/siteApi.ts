/* import api from '@/api/axiosConfig'; */
import type { Site } from '@/shared/types';

const MOCK_SITES: Site[] = [
  { id: '1', nom: 'Hôtel Splendide', adresse: 'Quartier Bastos, Yaoundé', domaine: 'hotelsplendide.rik' },
  { id: '2', nom: 'Café de la Poste', adresse: 'Centre-Ville, Douala', domaine: 'cafeposte.rik' },
  { id: '3', nom: 'Résidence Horizon', adresse: 'Kribi Plage', domaine: 'horizon.rik' },
];

export const siteApi = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { data: MOCK_SITES };
  },
  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: MOCK_SITES.find(s => s.id === id) };
  },
  create: async (data: Partial<Site>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: { ...data, id: Math.random().toString() } };
  },
  update: async (_id: string, data: Partial<Site>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: { ...data, id: _id } };
  },
  delete: async (_id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: null };
  }
};
