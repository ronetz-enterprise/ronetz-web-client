/* import api from '@/api/axiosConfig'; */
import type { Routeur } from '@/shared/types';

const MOCK_ROUTEURS: Routeur[] = [
  { id: '1', nom: 'MikroTik RB4011', identifiant: 'MT-001', siteId: '1', siteNom: 'Hôtel Splendide', statut: 'ONLINE', version: 'v7.12.1' },
  { id: '2', nom: 'MikroTik hAP ac2', identifiant: 'MT-002', siteId: '1', siteNom: 'Hôtel Splendide', statut: 'OFFLINE', version: 'v6.49.10' },
  { id: '3', nom: 'CCR2004-16G-2S+', identifiant: 'MT-003', siteId: '2', siteNom: 'Café de la Poste', statut: 'ONLINE', version: 'v7.14.2' },
];

export const routeurApi = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return { data: MOCK_ROUTEURS };
  },
  create: async (_data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: { ..._data, id: Math.random().toString() } };
  },
  delete: async (_id: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { data: null };
  },
  downloadConfig: async (_id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { data: new Blob(['# Mock MikroTik Config\n/ip address add address=192.168.88.1/24 interface=bridge'], { type: 'text/plain' }) };
  }
};
