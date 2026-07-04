import { type ColumnDef } from "@tanstack/react-table";
import { type Country } from "@/shared/types";
import { MoreHorizontal, Ban, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type CountryTableActions = {
  onToggleBlock: (id: string) => void;
};

export const getCountryColumns = (actions: CountryTableActions): ColumnDef<Country>[] => [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "code",
    header: "Code ISO",
  },
  {
    accessorKey: "defaultCurrency",
    header: "Devise",
  },
  {
    accessorKey: "phonePrefix",
    header: "Préfixe",
  },
  {
    id: "access",
    header: "Accès app",
    cell: ({ row }) => {
      const blocked = Boolean(!row.original.active);
      return (
        <Badge variant={blocked ? "destructive" : "secondary"} className="font-medium">
          {blocked ? "Bloqué" : "Autorisé"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const c = row.original;
      const blocked = Boolean(!c.active);
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-slate-500 hover:text-slate-900">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions pays</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{c.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => actions.onToggleBlock(c.id)}>
                {blocked ? (
                  <>
                    <Globe2 className="mr-2 h-4 w-4" />
                    Débloquer le pays
                  </>
                ) : (
                  <>
                    <Ban className="mr-2 h-4 w-4" />
                    Bloquer le pays
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
