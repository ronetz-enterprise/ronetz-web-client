import { getRouteurColumns, type RouteurActions } from "./routeurColumns";
import { type Routeur } from "../types";
import { DataTable } from "@/shared/components/data-table";

interface RouteurPageProps extends RouteurActions {
    routeurs: Routeur[];
    loading?: boolean;
}

export function RouteurPage({ routeurs, loading, ...actions }: RouteurPageProps) {
    const columns = getRouteurColumns(actions);
    return (
        <DataTable
            columns={columns}
            data={routeurs}
            loading={loading}
            enableSorting
            enableGlobalFilter
            globalFilterPlaceholder="Rechercher un routeur..."
            enablePagination
            pageSize={10}
        />
    );
}
