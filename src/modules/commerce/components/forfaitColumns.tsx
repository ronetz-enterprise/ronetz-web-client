import { type ColumnDef } from "@tanstack/react-table";
import { Ban, MoreHorizontal, RotateCcw } from "lucide-react";
import type { Forfait } from "../types";
import { formatAmount, formatData, formatDuration } from "@/shared/lib/format";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ForfaitTableActions = {
    /** Omit to hide the actions column entirely (e.g. non-admin viewers). */
    onToggleActive?: (id: string) => void;
};

const baseForfaitColumns: ColumnDef<Forfait>[] = [
    {
        accessorKey: "name",
        header: "Nom",
        cell: ({ row }) => <span className="font-medium text-foreground">{row.getValue<string>("name")}</span>,
    },
    {
        accessorKey: "price",
        header: "Prix",
        cell: ({ row }) => formatAmount(row.original.price, row.original.currency),
    },
    {
        accessorKey: "dataVolumeMb",
        header: "Volume",
        cell: ({ row }) => formatData(row.getValue<number>("dataVolumeMb")),
    },
    {
        accessorKey: "durationMinutes",
        header: "Durée",
        cell: ({ row }) => formatDuration(row.getValue<number>("durationMinutes")),
    },
    {
        accessorKey: "maxConcurrentDevices",
        header: "Appareils",
    },
    {
        accessorKey: "active",
        header: "Statut",
        cell: ({ row }) => {
            const active = row.getValue<boolean>("active");
            return (
                <StatusBadge tone={active ? "success" : "neutral"}>
                    {active ? "Actif" : "Inactif"}
                </StatusBadge>
            );
        },
    },
];

export function getForfaitColumns(actions: ForfaitTableActions = {}): ColumnDef<Forfait>[] {
    if (!actions.onToggleActive) return baseForfaitColumns;

    const onToggleActive = actions.onToggleActive;

    return [
        ...baseForfaitColumns,
        {
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            enableSorting: false,
            cell: ({ row }) => {
                const forfait = row.original;
                return (
                    // Rows navigate to the detail page on click — keep that click
                    // from firing when the user is only opening this menu.
                    <div className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-2 w-9 rounded-lg text-muted-foreground hover:text-foreground"
                                    aria-label="Menu actions"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                    variant={forfait.active ? "destructive" : "default"}
                                    onClick={() => onToggleActive(forfait.id)}
                                >
                                    {forfait.active ? (
                                        <Ban className="mr-2 h-0 w-4" />
                                    ) : (
                                        <RotateCcw className="mr-2 h-0 w-4" />
                                    )}
                                    {forfait.active ? "Désactiver" : "Réactiver"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];
}
