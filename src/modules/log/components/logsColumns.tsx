import { type ColumnDef } from "@tanstack/react-table";
import { type SystemLog } from "@/shared/types";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

const getLevelColor = (level: string) => {
  switch(level) {
    case 'ERROR': return 'text-red-500 bg-red-50 border-red-100';
    case 'WARNING': return 'text-orange-500 bg-orange-50 border-orange-100';
    default: return 'text-blue-500 bg-blue-50 border-blue-100';
  }
};

const getLevelIcon = (level: string) => {
  switch(level) {
    case 'ERROR': return <AlertCircle size={12} />;
    case 'WARNING': return <AlertTriangle size={12} />;
    default: return <Info size={12} />;
  }
};

export const logsColumns: ColumnDef<SystemLog>[] = [
  {
    accessorKey: "date",
    header: "Date & Heure",
    cell: ({ row }) => {
      return <span className="text-slate-400 whitespace-nowrap">{row.getValue<string>("date")}</span>;
    },
  },
  {
    accessorKey: "niveau",
    header: "Niveau",
    cell: ({ row }) => {
      const niveau = row.getValue<string>("niveau");
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getLevelColor(niveau)}`}>
          {getLevelIcon(niveau)}
          {niveau}
        </span>
      );
    },
  },
  {
    accessorKey: "composant",
    header: "Composant",
    cell: ({ row }) => {
      return (
        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
          {row.getValue<string>("composant")}
        </span>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      return (
        <span className="text-slate-600 truncate max-w-xl inline-block align-bottom">
          {row.getValue<string>("message")}
        </span>
      );
    },
  },
];
