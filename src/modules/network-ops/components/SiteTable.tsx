import { columns } from "./siteColumns"
import { type Site } from "../types"
import { DataTable } from "@/shared/components/data-table"
export default function SitePage({ sites }: { sites: Site[] }) {

    return (
        <div className=" w-full ">
            <DataTable columns={columns} data={sites} />
        </div>
    )
}
