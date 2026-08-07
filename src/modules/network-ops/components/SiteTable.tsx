import { columns } from "./siteColumns"
import { type Site } from "../types"
import { DataTable } from "@/shared/components/data-table"
export default function SitePage({ sites, loading }: { sites: Site[]; loading?: boolean }) {

    return (
        <div className=" w-full ">
            <DataTable
                columns={columns}
                data={sites}
                loading={loading}
                enableSorting
                enableGlobalFilter
                globalFilterPlaceholder="Rechercher un site..."
                enablePagination
                pageSize={10}
            />
        </div>
    )
}
