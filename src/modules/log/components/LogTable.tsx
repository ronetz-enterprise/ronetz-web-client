import React from 'react';
import type { SystemLog } from '@/shared/types';
import { DataTable } from '@/modules/site/components/data-table';
import { logsColumns } from './logsColumns';

interface LogTableProps {
  logs: SystemLog[];
  loading: boolean;
}

export const LogTable: React.FC<LogTableProps> = ({ logs, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-12 bg-slate-50 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="font-mono text-xs">
      <DataTable columns={logsColumns} data={logs} />
    </div>
  );
};
