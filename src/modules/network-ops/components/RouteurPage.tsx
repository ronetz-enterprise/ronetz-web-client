import { getRouteurColumns, type RouteurActions } from "./routeurColumns";
import { type Routeur } from "../types";
import { DataTable } from "@/shared/components/data-table";

interface RouteurPageProps extends RouteurActions {
    routeurs: Routeur[];
}

export function RouteurPage({ routeurs, ...actions }: RouteurPageProps) {
    const columns = getRouteurColumns(actions);
    return <DataTable columns={columns} data={routeurs} />;
}
