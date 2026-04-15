import { type ColumnDef } from "@tanstack/react-table";
import { type User, type UserDetails } from "@/shared/types";
import { MoreVertical, ShieldCheck, CheckCircle2, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";

export const getUsersColumns = (onDelete?: (id: string) => void): ColumnDef<UserDetails>[] => [
  {
    accessorKey: "email",
    header: "Email",
    
  },
 
  {
    accessorKey: "role",
    header: "Role",
   
  },
  {
    accessorKey: "active",
    header: "Statut",
     cell: ({ row }) => {
      const active = row.original.active;
      return  active?'actif':'bloque';
    },
    
   
  },
  {
    accessorKey: "createdAt",
    header: "Date de creation",
    cell:({row})=>{
      return new Date(row.original.createdAt).toLocaleDateString();
    },
  },

  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="text-right">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete?.(id)}
            className="h-10 w-10 rounded-xl text-slate-400 hover:text-slate-900"
          >
            <MoreVertical size={18} />
          </Button>
        </div>
      );
    },
  },
];
