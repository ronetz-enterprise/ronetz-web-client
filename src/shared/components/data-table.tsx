import * as React from "react"
import {
    type ColumnDef,
    type RowSelectionState,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    ArrowDown,
    ArrowUp,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronsUpDown,
    Search,
} from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/shared/lib/utils"

// Fixed pattern (not random) so skeleton cell widths don't jitter on
// re-render while loading stays true — just enough variance to read as
// "text of varying length" instead of a uniform grid of identical bars.
const SKELETON_CELL_WIDTHS = ["w-32", "w-20", "w-24", "w-16", "w-28", "w-14"]

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    /**
     * Click-to-sort headers, powered by TanStack's getSortedRowModel. Off by
     * default so existing tables keep their current look until opted in.
     * Exclude a single column with `enableSorting: false` in its columnDef.
     */
    enableSorting?: boolean
    /** Search input above the table, filtering across every column's text. */
    enableGlobalFilter?: boolean
    globalFilterPlaceholder?: string
    /** Prev/next pagination controls below the table. */
    enablePagination?: boolean
    pageSize?: number
    /** Leading checkbox column; reports selected rows back to the caller. */
    enableRowSelection?: boolean
    onRowSelectionChange?: (selectedRows: TData[]) => void
    /** Forwarded to useReactTable — recommended once selection/pagination combine, so ids stay stable across page/filter changes. */
    getRowId?: (row: TData, index: number) => string
    /** Makes rows clickable — e.g. to open a detail panel or navigate. */
    onRowClick?: (row: TData) => void
    /** Highlights a row as the current one (e.g. open in a detail panel). Independent of enableRowSelection's checkboxes. */
    isRowActive?: (row: TData) => boolean
    /**
     * Shows skeleton rows inside the real table shell (search bar, real
     * column headers, pagination hidden) instead of the caller rolling its
     * own page-level placeholder — so every loading table looks the same
     * shape as what replaces it.
     */
    loading?: boolean
    /** Number of skeleton rows to render while `loading` is true. */
    skeletonRowCount?: number
    emptyMessage?: React.ReactNode
    className?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    enableSorting = false,
    enableGlobalFilter = false,
    globalFilterPlaceholder = "Rechercher...",
    enablePagination = false,
    pageSize = 10,
    enableRowSelection = false,
    onRowSelectionChange,
    getRowId,
    onRowClick,
    isRowActive,
    loading = false,
    skeletonRowCount = 5,
    emptyMessage = "No results.",
    className,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

    // Injects a leading checkbox column when selection is on, so callers
    // don't have to declare it in their own columns array to use the feature.
    const tableColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
        if (!enableRowSelection) return columns
        const selectionColumn: ColumnDef<TData, TValue> = {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
                    aria-label="Tout sélectionner"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(checked) => row.toggleSelected(!!checked)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Sélectionner la ligne"
                />
            ),
            enableSorting: false,
        }
        return [selectionColumn, ...columns]
    }, [columns, enableRowSelection])

    const table = useReactTable({
        data,
        columns: tableColumns,
        getRowId,
        state: { sorting, globalFilter, rowSelection },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        enableRowSelection,
        getCoreRowModel: getCoreRowModel(),
        // Only wired up when the matching prop is on — otherwise the state
        // above stays inert (nothing renders the UI that could change it).
        getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
        getFilteredRowModel: enableGlobalFilter ? getFilteredRowModel() : undefined,
        getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
        initialState: { pagination: { pageSize } },
    })

    // Re-expose selection as plain TData rows so callers don't need to reach
    // into TanStack's Row<TData> wrapper or import its types.
    React.useEffect(() => {
        if (!enableRowSelection || !onRowSelectionChange) return
        onRowSelectionChange(table.getSelectedRowModel().rows.map((row) => row.original))
        // table is stable across renders (same useReactTable instance); only
        // the selection state itself should retrigger this.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection, enableRowSelection])

    return (
        <div className="space-y-3">
        <Card className={cn("gap-0 overflow-hidden rounded-xl", className)}>
            {enableGlobalFilter && (
                <>
                    <div className="px-4 ">
                        <div className="relative w-full py-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                placeholder={globalFilterPlaceholder}
                                className="w-full pl-9 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background" 
                            />
                        </div>
                    </div>
                    {/* Zebra hatch seam between the search bar and the table header. */}
                    <div
                        aria-hidden
                        className="h-2 w-full [background-image:repeating-linear-gradient(135deg,color-mix(in_oklab,var(--border)_100%,transparent)_0_2px,transparent_2px_6px)]"
                    />
                </>
            )}

            <Table>
                <TableHeader className="m-0 bg-muted">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="p-0 m-0 hover:bg-transparent">
                            {headerGroup.headers.map((header) => {
                                const sortDirection = header.column.getIsSorted()
                                return (
                                    <TableHead key={header.id} className="py-2 first:ps-5 last:pe-5 h-fit">
                                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                            <button
                                                type="button"
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="inline-flex items-center gap-1 select-none hover:text-foreground"
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {sortDirection === "asc" ? (
                                                    <ArrowUp className="size-3.5" />
                                                ) : sortDirection === "desc" ? (
                                                    <ArrowDown className="size-3.5" />
                                                ) : (
                                                    <ChevronsUpDown className="size-3.5 opacity-40" />
                                                )}
                                            </button>
                                        ) : (
                                            flexRender(header.column.columnDef.header, header.getContext())
                                        )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {loading ? (
                        Array.from({ length: skeletonRowCount }, (_, rowIndex) => (
                            <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
                                {tableColumns.map((_, colIndex) => (
                                    <TableCell key={colIndex} className="first:ps-5 last:pe-5 py-2.5">
                                        <Skeleton className={cn("h-4", SKELETON_CELL_WIDTHS[colIndex % SKELETON_CELL_WIDTHS.length])} />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                                className={cn(
                                    onRowClick && "cursor-pointer",
                                    isRowActive?.(row.original) && "bg-muted hover:bg-muted"
                                )}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="first:ps-5 last:pe-5 py-1.5">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

        </Card>

            {/* Pagination lives outside the card now — each control is its
                own separate, fully-rounded pill rather than one shared strip.
                Hidden while loading: page count isn't meaningful yet. */}
            {enablePagination && !loading && (
                <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                    <p className="text-sm text-muted-foreground">
                        {enableRowSelection
                            ? `${table.getFilteredSelectedRowModel().rows.length} sur ${table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s)`
                            : `${table.getFilteredRowModel().rows.length} résultat(s)`}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon-sm"
                            className="rounded-full shadow-sm"
                            onClick={() => table.firstPage()}
                            disabled={!table.getCanPreviousPage()}
                            aria-label="Première page"
                        >
                            <ChevronsLeft className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            className="rounded-full shadow-sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            aria-label="Page précédente"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <div className="flex h-9 min-w-16 items-center justify-center rounded-full border bg-card px-4 text-sm font-medium tabular-nums shadow-sm">
                            {table.getState().pagination.pageIndex + 1} / {Math.max(table.getPageCount(), 1)}
                        </div>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            className="rounded-full shadow-sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            aria-label="Page suivante"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            className="rounded-full shadow-sm"
                            onClick={() => table.lastPage()}
                            disabled={!table.getCanNextPage()}
                            aria-label="Dernière page"
                        >
                            <ChevronsRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
