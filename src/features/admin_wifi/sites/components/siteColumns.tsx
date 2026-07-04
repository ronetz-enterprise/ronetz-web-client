import { type ColumnDef } from "@tanstack/react-table";
import { type Site } from "@/shared/types";

export const columns: ColumnDef<Site>[] = [
    {
        accessorKey: "name",
        header: "Nom",
    },
    {
        accessorKey: "address",
        header: "Localisation",
    },
    {
        accessorKey: "id",
        header: "ID",
    }

];
