import { type ColumnDef } from "@tanstack/react-table";
import { type Routeur } from "../types";
import { Button } from "@/components/ui/button";
import { Download, Edit, Trash2, Power, RefreshCw, Network } from "lucide-react";
import { StatusBadge, type StatusBadgeTone } from "@/shared/components/StatusBadge";

const statutTone: Record<Routeur["status"], StatusBadgeTone> = {
    ACTIVE: "success",
    PROVISIONED: "warning",
    OFFLINE: "danger",
    DECOMMISSIONED: "neutral",
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
                    <StatusBadge tone={statutTone[statut]}>
                        {statutLabel[statut]}
                    </StatusBadge>
                );
            },
        },
        {
            accessorKey: "lastHeartbeatAt",
            header: "Dernière connexion",
            cell: ({ row }) => {
                const val = row.getValue<string | null>("lastHeartbeatAt");
                if (!val) return <span className="text-muted-foreground">—</span>;
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
                                className="h-9 w-9 text-amber-400 hover:text-primary hover:bg-primary/10 rounded-xl"
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
                                className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
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
                                className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl"
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
                                className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
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
                                className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
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
                                className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
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
