import { columns } from "./siteColumns"
import { type Site } from "@/shared/types"
import { DataTable } from "../../../../shared/components/data-table"
export default function SitePage({ sites }: { sites: Site[] }) {

    return (
        <div className="container mx-auto">
            <DataTable columns={columns} data={sites} />
        </div>
    )
}
