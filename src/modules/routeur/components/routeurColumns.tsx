import { type ColumnDef } from "@tanstack/react-table";
import { type Routeur } from "@/shared/types";

const statutStyle: Record<Routeur["statut"], string> = {
    ONLINE: "bg-emerald-100 text-emerald-700",
    OFFLINE: "bg-red-100 text-red-600",
    MAINTENANCE: "bg-amber-100 text-amber-700",
};

const statutLabel: Record<Routeur["statut"], string> = {
    ONLINE: "En ligne",
    OFFLINE: "Hors ligne",
    MAINTENANCE: "Maintenance",
};

export const routeurColumns: ColumnDef<Routeur>[] = [
    {
        accessorKey: "nom",
        header: "Nom",
    },
    {
        accessorKey: "identifiant",
        header: "Identifiant",
    },
    {
        accessorKey: "siteNom",
        header: "Site",
    },
    {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => {
            const statut = row.getValue<Routeur["statut"]>("statut");
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statutStyle[statut]}`}>
                    {statutLabel[statut]}
                </span>
            );
        },
    },
    {
        accessorKey: "version",
        header: "Version",
    },
    {
        accessorKey: "derniereConnexion",
        header: "Dernière connexion",
        cell: ({ row }) => {
            const val = row.getValue<string>("derniereConnexion");
            if (!val) return <span className="text-slate-400">—</span>;
            return new Date(val).toLocaleString("fr-FR");
        },
    },
];
