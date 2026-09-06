import { getRouteurColumns, type RouteurActions } from "./routeurColumns";
import { type Routeur } from "../types";
import { DataTable } from "@/shared/components/data-table";

interface RouteurPageProps extends RouteurActions {
    routeurs: Routeur[];
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
    emptyAction?: React.ReactNode;
}

export function RouteurPage({ routeurs, loading, error, onRetry, emptyAction, ...actions }: RouteurPageProps) {
    const columns = getRouteurColumns(actions);
    return (
        <DataTable
            columns={columns}
            data={routeurs}
            loading={loading} error={error} onRetry={onRetry} emptyAction={emptyAction}
            emptyMessage="Aucun routeur n’a encore été ajouté."
            filters={[{ columnId: "status", label: "Statut", options: [{ label: "Actif", value: "ACTIVE" }, { label: "Provisionné", value: "PROVISIONED" }, { label: "Hors ligne", value: "OFFLINE" }, { label: "Déclassé", value: "DECOMMISSIONED" }] }]}
            enableSorting
            enableGlobalFilter
            globalFilterPlaceholder="Rechercher un routeur..."
            enablePagination
            pageSize={10}
        />
    );
}
