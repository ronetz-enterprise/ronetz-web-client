import { type ColumnDef } from "@tanstack/react-table";
import { type PaymentMethod } from "../types";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<PaymentMethod>[] = [
    {
        accessorKey: "name",
        header: "Nom",
    },
    {
        accessorKey: "code",
        header: "Code",
    },
    {
        accessorKey: "countryIds",
        header: "Pays",
        cell: ({ row }) => (
            <div className="flex gap-1 flex-wrap">
                {row.original.countryIds.length} pays
            </div>
        )
    },
    {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.active ? "default" : "destructive"}>
                {row.original.active ? "Actif" : "Inactif"}
            </Badge>
        )
    },
    {
        accessorKey: "id",
        header: "ID",
    }
];
