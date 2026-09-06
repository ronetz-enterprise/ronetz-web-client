import React from 'react';
import type { SystemLog } from '../types';
import { DataTable } from '@/shared/components/data-table';
import { logsColumns } from './logsColumns';

interface LogTableProps {
  logs: SystemLog[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const LogTable: React.FC<LogTableProps> = ({ logs, loading, error, onRetry }) => {
  return <DataTable columns={logsColumns} data={logs} loading={loading} error={error} onRetry={onRetry} emptyMessage="Aucun événement enregistré." filters={[{ columnId: "level", label: "Niveau", options: [...new Set(logs.map((log) => log.level))].map((level) => ({ label: level, value: level })) }]} />;
};
