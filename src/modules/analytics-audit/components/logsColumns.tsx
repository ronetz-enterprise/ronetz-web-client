import { type ColumnDef } from "@tanstack/react-table";
import { type SystemLog } from "../types";
import { StatusBadge, type StatusBadgeTone } from "@/shared/components/StatusBadge";

const levelTone = (level: string): StatusBadgeTone => {
  switch (level) {
    case 'ERROR': return 'danger';
    case 'WARNING': return 'warning';
    default: return 'neutral';
  }
};

export const logsColumns: ColumnDef<SystemLog>[] = [
  {
    accessorKey: "timestamp",
    header: "Date & Heure",
    cell: ({ row }) => {
      const ts = row.getValue<string>("timestamp");
      return (
        <span className="text-muted-foreground whitespace-nowrap">
          {new Date(ts).toLocaleString("fr-FR")}
        </span>
      );
    },
  },
  {
    accessorKey: "level",
    header: "Niveau",
    cell: ({ row }) => {
      const niveau = row.getValue<string>("level");
      return (
        <StatusBadge tone={levelTone(niveau)} className="uppercase tracking-widest text-[10px] font-semibold">
          {niveau}
        </StatusBadge>
      );
    },
  },
  {
    accessorKey: "component",
    header: "Composant",
    cell: ({ row }) => {
      return (
        <span className="font-bold text-foreground bg-muted px-2 py-1 rounded-md">
          {row.getValue<string>("component")}
        </span>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground truncate max-w-xl inline-block align-bottom">
          {row.getValue<string>("message")}
        </span>
      );
    },
  },
];
