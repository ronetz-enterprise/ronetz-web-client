import { routeurColumns } from "./routeurColumns";
import { type Routeur } from "@/shared/types";
import { DataTable } from "@/modules/site/components/data-table";

interface RouteurPageProps {
    routeurs: Routeur[];
}

export function RouteurPage({ routeurs }: RouteurPageProps) {
    return (
        <DataTable columns={routeurColumns} data={routeurs} />
    );
}
