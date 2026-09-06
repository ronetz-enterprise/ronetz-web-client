import { type ColumnDef } from "@tanstack/react-table";
import { type PaymentMethod } from "../types";
import { StatusBadge } from "@/shared/components/StatusBadge";

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
        header: "Statut",
        cell: ({ row }) => (
            <StatusBadge tone={row.original.active ? "success" : "neutral"}>
                {row.original.active ? "Actif" : "Inactif"}
            </StatusBadge>
        )
    },
    {
        accessorKey: "id",
        header: "ID",
    }
];
