/* import api from '@/api/axiosConfig'; */
import type { SystemLog } from '@/shared/types';

const MOCK_LOGS: SystemLog[] = [
  { id: '1', date: '13/04/2026 18:40', niveau: 'INFO', composant: 'AUTH', message: 'Connexion réussie de superadmin@rik.com' },
  { id: '2', date: '13/04/2026 18:42', niveau: 'WARNING', composant: 'ROUTER', message: 'Latency spike detected on MT-001 (Hotel Splendide)' },
  { id: '3', date: '13/04/2026 18:45', niveau: 'ERROR', composant: 'PAYMENT', message: 'Transaction failure for user ID 402 (Insufficient funds simulation)' },
  { id: '4', date: '13/04/2026 18:48', niveau: 'INFO', composant: 'SYSTEM', message: 'Configuration backup completed for 12 sites' },
  { id: '5', date: '13/04/2026 18:50', niveau: 'INFO', composant: 'CLIENT', message: 'Nouveau forfait "Mega Semaine" acheté par Alice Ngo' },
];

export const logApi = {
  getLogs: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: MOCK_LOGS };
  }
};
