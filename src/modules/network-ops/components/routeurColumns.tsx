import { type ColumnDef } from "@tanstack/react-table";
import { type Routeur } from "../types";
import { Button } from "@/components/ui/button";
import { Download, Edit, Trash2, Power, RefreshCw, Network, MoreHorizontal } from "lucide-react";
import { StatusBadge, type StatusBadgeTone } from "@/shared/components/StatusBadge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
            enableSorting: false,
            cell: ({ row }) => {
                const r = row.original;
                const isDecommissioned = r.status === "DECOMMISSIONED";
                return (
                    <div className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
                                    aria-label="Menu actions"
                                >
                                    <MoreHorizontal size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                {r.status === "PROVISIONED" && (
                                    <DropdownMenuItem onClick={() => actions.onActivate?.(r.id)}>
                                        <Power className="mr-2 h-4 w-4" />
                                        Activer
                                    </DropdownMenuItem>
                                )}

                                {r.status === "ACTIVE" && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            if (window.confirm("Régénérer les secrets VPN et RADIUS ? Les connexions actives seront interrompues.")) {
                                                actions.onRotateSecrets?.(r.id);
                                            }
                                        }}
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Rotation des secrets
                                    </DropdownMenuItem>
                                )}

                                {!isDecommissioned && (
                                    <DropdownMenuItem onClick={() => actions.onDownloadConfig(r.id, r.name)}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Télécharger la config
                                    </DropdownMenuItem>
                                )}

                                {r.vpnPublicKey && (
                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(r.vpnPublicKey!)}>
                                        <Network className="mr-2 h-4 w-4" />
                                        Copier la clé publique VPN
                                    </DropdownMenuItem>
                                )}

                                {!isDecommissioned && actions.onEdit && (
                                    <DropdownMenuItem onClick={() => actions.onEdit?.(r)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Modifier
                                    </DropdownMenuItem>
                                )}

                                {!isDecommissioned && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (window.confirm("Supprimer définitivement ce routeur ?")) {
                                                    actions.onDelete(r.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Supprimer
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];
}
