/* import api from '@/api/axiosConfig'; */
import type { Forfait } from '@/shared/types';

const MOCK_FORFAITS: Forfait[] = [
  { id: '1', nom: 'Pass 1 Heure', prix: 200, duree: 40, volume: 'Illimité', siteId: '1', maxDevices: 4, isActive: true },
  { id: '2', nom: 'Pass Journée', prix: 500, duree: 24, volume: '2 ', siteId: '1', maxDevices: 2, isActive: true },
  { id: '3', nom: 'Mega Semaine', prix: 2000, duree: 7, volume: '10 ', siteId: '1', maxDevices: 4, isActive: true },
  { id: '4', nom: 'Express Douala', prix: 300, duree: 2, volume: '500 ', siteId: '2', maxDevices: 3, isActive: true },
  { id: '5', nom: 'Express Douala', prix: 300, duree: 2, volume: '500 ', siteId: '2', maxDevices: 3, isActive: true },


];

export const forfaitApi = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: MOCK_FORFAITS };
  },
  getBySite: async (siteId: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { data: MOCK_FORFAITS.filter(f => f.siteId === siteId) };
  },
  create: async (_data: any) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: { ..._data, id: Math.random().toString() } };
  },
  delete: async (_id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: null };
  }
};
