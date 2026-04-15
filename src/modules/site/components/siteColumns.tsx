import { type ColumnDef } from "@tanstack/react-table";
import { type Site } from "@/shared/types";

export const columns: ColumnDef<Site>[] = [
    {
        accessorKey: "nom",
        header: "Nom",
    },
    {
        accessorKey: "adresse",
        header: "Addresse",
    },
    {
        accessorKey: "createdAt",
        header: "Date de creation",
    }

];