import React from 'react';
import { useLogs } from '../hooks/useLogs';
import { LogTable } from '../components/LogTable';
import { RefreshCw, Search, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LogListPage: React.FC = () => {
  const { logs, loading, refresh } = useLogs();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Audit Système</h1>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" onClick={refresh}>
             <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser
           </Button>
           <Button>
             <Download className="mr-2 h-5 w-5" /> Exporter
           </Button>
        </div>
      </div>

      <div className="px-5">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex flex-wrap gap-4 items-center justify-between">
             <div className="relative flex-1 min-w-[250px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input type="text" placeholder="Filtrer par message..." className="pl-9" />
             </div>
             <Button variant="ghost" size="sm" className="text-muted-foreground font-medium">
               <Calendar size={16} className="mr-2" /> Toutes les dates
             </Button>
          </div>

          <LogTable logs={logs} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default LogListPage;
