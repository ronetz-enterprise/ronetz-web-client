/* import api from '@/api/axiosConfig'; */
import type { Jeton } from '@/shared/types';

const MOCK_JETONS: Jeton[] = [
  { id: '1', code: 'RIK-24A8', pin: '1234', siteId: '1', siteNom: 'Hôtel Splendide', forfaitNom: 'Pass Journée', dateExpiration: '24/04/2026', volumeRestant: '1.2 Go', statut: 'ACTIF' },
  { id: '2', code: 'RIK-9901', pin: '8877', siteId: '1', siteNom: 'Hôtel Splendide', forfaitNom: 'Pass 1 Heure', dateExpiration: '12/04/2026', volumeRestant: '0 Mo', statut: 'EXPIRE' },
];

export const souscriptionApi = {
  create: async (_forfaitId: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { 
      data: { 
        success: true, 
        jeton: { 
          id: Math.random().toString(),
          code: 'SIM-' + Math.random().toString(36).substring(7).toUpperCase(),
          pin: Math.floor(1000 + Math.random() * 9000).toString(),
          siteNom: 'Site Simulation',
          forfaitNom: 'Forfait Simulation',
          dateExpiration: '30/12/2026',
          volumeRestant: 'Illimité',
          statut: 'ACTIF'
        } 
      } 
    };
  },
  getActifs: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { data: MOCK_JETONS.filter(j => j.statut === 'ACTIF') };
  },
  getHistorique: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: MOCK_JETONS };
  }
};
