import React from 'react';
import { useLogs } from '@/modules/analytics-audit/hooks/useLogs';
import { LogTable } from '@/modules/analytics-audit/components/LogTable';
import { RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LogListPage: React.FC = () => {
  const { logs, loading, error, refresh } = useLogs();

  const exportLogs = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "ronet-audit.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Audit Système</h1>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" onClick={refresh}>
             <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser
           </Button>
           <Button variant="outline" size="sm" onClick={exportLogs} disabled={loading || !logs.length}><Download className="size-4" />Exporter</Button>

        </div>
      </div>

      <LogTable logs={logs} loading={loading} error={error} onRetry={refresh} />
    </div>
  );
};

export default LogListPage;
