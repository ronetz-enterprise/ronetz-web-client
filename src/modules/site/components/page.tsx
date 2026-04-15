import { columns } from "./siteColumns"
import { type Site } from "@/shared/types"
import { DataTable } from "./data-table"
function getData(): Site[] {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            nom: "Site 1",
            adresse: "Addresse 1",
            domaine: "Domaine 1",
            createdAt: "Date 1",
        },
        // ...
    ]
}

export default function SitePage() {
    const data = getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}