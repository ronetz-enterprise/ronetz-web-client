import { type ColumnDef } from "@tanstack/react-table";
import { type Routeur } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Download, Edit, Trash2, Power, RefreshCw, Network } from "lucide-react";

const statutStyle: Record<Routeur["status"], string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    PROVISIONED: "bg-amber-100 text-amber-700",
    OFFLINE: "bg-red-100 text-red-600",
    DECOMMISSIONED: "bg-slate-100 text-slate-500",
};

const statutLabel: Record<Routeur["status"], string> = {
    ACTIVE: "Actif",
    PROVISIONED: "Provisionné",
    OFFLINE: "Hors ligne",
    DECOMMISSIONED: "Déclassé",
};

export interface RouteurActions {
    onDownloadConfig: (id: string, name: string) => void;
    onDelete: (id: string) => void;
    onEdit?: (routeur: Routeur) => void;
    onActivate?: (id: string) => void;
    onRotateSecrets?: (id: string) => void;
}

export function getRouteurColumns(actions: RouteurActions): ColumnDef<Routeur>[] {
    return [
        {
            accessorKey: "name",
            header: "Nom",
        },
        {
            accessorKey: "siteId",
            header: "Site ID",
        },
        {
            accessorKey: "status",
            header: "Statut",
            cell: ({ row }) => {
                const statut = row.getValue<Routeur["status"]>("status");
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statutStyle[statut]}`}>
                        {statutLabel[statut]}
                    </span>
                );
            },
        },
        {
            accessorKey: "lastHeartbeatAt",
            header: "Dernière connexion",
            cell: ({ row }) => {
                const val = row.getValue<string | null>("lastHeartbeatAt");
                if (!val) return <span className="text-slate-400">—</span>;
                return new Date(val).toLocaleString("fr-FR");
            },
        },
        {
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const r = row.original;
                const isDecommissioned = r.status === "DECOMMISSIONED";
                return (
                    <div className="flex items-center justify-end gap-1">
                        {r.status === "PROVISIONED" && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => actions.onActivate?.(r.id)}
                                title="Activer"
                                className="h-9 w-9 text-amber-500 hover:text-green-600 hover:bg-green-50 rounded-xl"
                            >
                                <Power size={16} />
                            </Button>
                        )}

                        {r.status === "ACTIVE" && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    if (window.confirm("Régénérer les secrets VPN et RADIUS ? Les connexions actives seront interrompues.")) {
                                        actions.onRotateSecrets?.(r.id);
                                    }
                                }}
                                title="Rotation des secrets"
                                className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl"
                            >
                                <RefreshCw size={16} />
                            </Button>
                        )}

                        {!isDecommissioned && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => actions.onDownloadConfig(r.id, r.name)}
                                title="Télécharger la config"
                                className="h-9 w-9 text-slate-400 hover:text-primary rounded-xl hover:bg-slate-50"
                            >
                                <Download size={16} />
                            </Button>
                        )}

                        {r.vpnPublicKey && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigator.clipboard.writeText(r.vpnPublicKey!)}
                                title="Copier la clé publique VPN"
                                className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-xl"
                            >
                                <Network size={16} />
                            </Button>
                        )}

                        {!isDecommissioned && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => actions.onEdit?.(r)}
                                title="Modifier"
                                className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-xl"
                            >
                                <Edit size={16} />
                            </Button>
                        )}

                        {!isDecommissioned && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => actions.onDelete(r.id)}
                                title="Supprimer"
                                className="h-9 w-9 text-slate-400 hover:text-red-500 rounded-xl"
                            >
                                <Trash2 size={16} />
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];
}
