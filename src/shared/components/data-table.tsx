import * as React from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
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
    Search, Check, Plus, X,
} from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
     * Click-to-sort headers, powered by TanStack's getSortedRowModel.
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
    error?: string | null
    onRetry?: () => void
    emptyAction?: React.ReactNode
    filters?: { columnId: string; label: string; options: { label: string; value: string | boolean }[] }[]
    className?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    enableSorting = true,
    enableGlobalFilter = true,
    globalFilterPlaceholder = "Rechercher...",
    enablePagination = true,
    pageSize = 10,
    enableRowSelection = false,
    onRowSelectionChange,
    getRowId,
    onRowClick,
    isRowActive,
    loading = false,
    skeletonRowCount = 5,
    emptyMessage = "Aucune donnée disponible.",
    error, onRetry, emptyAction, filters = [],
    className,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
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
        state: { sorting, globalFilter, rowSelection, columnFilters },
        onColumnFiltersChange: setColumnFilters,
        enableSorting,
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        enableRowSelection,
        getCoreRowModel: getCoreRowModel(),
        // Only wired up when the matching prop is on — otherwise the state
        // above stays inert (nothing renders the UI that could change it).
        getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
        getFilteredRowModel: getFilteredRowModel(),
        defaultColumn: {
            cell: ({ getValue, column }) => {
                const value = getValue()
                const text = value == null || value === "" ? "—" : String(value)
                return <span title={text} className={cn("block max-w-64 truncate", /(^id$|Id$|code|Ip|prefix)/i.test(column.id) && "font-mono text-xs")}>{text}</span>
            },
        },
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

    const total = table.getFilteredRowModel().rows.length
    const { pageIndex, pageSize: currentPageSize } = table.getState().pagination
    const hasFilters = Boolean(globalFilter || columnFilters.length)
    const resetFilters = () => { setGlobalFilter(""); setColumnFilters([]); table.setPageIndex(0) }
    const ignoreRowClick = (target: EventTarget) => target instanceof Element && Boolean(target.closest("button, a, input, select, [role=checkbox], [role=menuitem]"))

    return (
        <section className={cn("min-w-0 w-full bg-card text-card-foreground", className)} aria-label="Tableau de données" aria-busy={loading}>
            <div data-slot="table-toolbar" className="flex flex-wrap items-center gap-2 px-6 py-4">
                {enableGlobalFilter && <div className="relative w-full sm:w-[232px]">
                    <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input aria-label={globalFilterPlaceholder} value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder={globalFilterPlaceholder} className="h-8 rounded-full py-0 pl-9 pr-8 text-[13px]" />
                    {globalFilter && <button type="button" aria-label="Effacer la recherche" onClick={() => setGlobalFilter("")} className="absolute right-1 top-0 flex size-8 items-center justify-center rounded-md text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"><X className="size-3.5" /></button>}
                </div>}
                {columnFilters.map((filter) => {
                    const definition = filters.find((item) => item.columnId === filter.id)
                    const label = definition?.options.find((option) => option.value === filter.value)?.label ?? String(filter.value)
                    return <span key={filter.id} className="inline-flex h-8 items-center gap-2 rounded-full bg-foreground/[0.07] py-1 pl-3 pr-2 text-[13px] text-foreground" title={`${definition?.label ?? filter.id} : ${label}`}>
                        <Check aria-hidden className="size-3.5" />
                        {label}
                        <button type="button" onClick={() => table.getColumn(filter.id)?.setFilterValue(undefined)} aria-label={`Retirer le filtre ${definition?.label} : ${label}`} className="group/remove -my-1 -mr-1 flex size-7 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-ring">
                            <span className="flex size-[18px] items-center justify-center rounded-full bg-foreground/50 text-card transition-colors group-hover/remove:bg-foreground/65"><X aria-hidden className="size-3" /></span>
                        </button>
                    </span>
                })}
                {filters.length > 0 && <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="h-8 rounded-full px-3 text-[13px] font-normal text-muted-foreground"><Plus className="size-3.5" />Ajouter un filtre</Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {filters.map((filter) => <React.Fragment key={filter.columnId}>
                            <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
                            {filter.options.map((option) => <DropdownMenuItem key={String(option.value)} onClick={() => table.getColumn(filter.columnId)?.setFilterValue(option.value)}>
                                <Check className={cn("size-3.5", table.getColumn(filter.columnId)?.getFilterValue() !== option.value && "invisible")} />{option.label}
                            </DropdownMenuItem>)}
                        </React.Fragment>)}
                    </DropdownMenuContent>
                </DropdownMenu>}
                <span role="status" className="text-[13px] text-muted-foreground">{loading ? "Chargement…" : error ? "Chargement impossible" : `${total} résultat${total > 1 ? "s" : ""}`}</span>
            </div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((group) => <TableRow key={group.id} className="hover:bg-transparent bg-muted">
                        {group.headers.map((header) => {
                            const direction = header.column.getIsSorted()
                            return <TableHead key={header.id} aria-sort={enableSorting && header.column.getCanSort() ? direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none" : undefined}>
                                {header.isPlaceholder ? null : enableSorting && header.column.getCanSort() ? <button type="button" onClick={header.column.getToggleSortingHandler()} className="group/sort inline-flex min-h-8 items-center gap-1 rounded-sm text-left focus-visible:outline-2 focus-visible:outline-ring">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {direction === "asc" ? <ArrowUp className="size-3" /> : direction === "desc" ? <ArrowDown className="size-3" /> : <ChevronsUpDown className="size-3 opacity-0 group-hover/sort:opacity-50 group-focus-visible/sort:opacity-50" />}
                                </button> : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                        })}
                    </TableRow>)}
                </TableHeader>
                <TableBody>
                    {loading ? Array.from({ length: skeletonRowCount }, (_, index) => <TableRow key={index} className="hover:bg-transparent">
                        {tableColumns.map((_, column) => <TableCell key={column}><Skeleton className={cn("h-4 max-w-full", SKELETON_CELL_WIDTHS[column % SKELETON_CELL_WIDTHS.length])} /></TableCell>)}
                    </TableRow>) : error ? <TableRow><TableCell colSpan={tableColumns.length} className="h-32 text-center"><p role="alert" className="text-sm text-destructive">{error}</p>{onRetry && <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>Réessayer</Button>}</TableCell></TableRow> : table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => <TableRow
                        key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}
                        tabIndex={onRowClick ? 0 : undefined}
                        onClick={onRowClick ? (event) => { if (!ignoreRowClick(event.target)) onRowClick(row.original) } : undefined}
                        onKeyDown={onRowClick ? (event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onRowClick(row.original) } } : undefined}
                        className={cn(onRowClick && "cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring", isRowActive?.(row.original) && "bg-accent")}
                    >{row.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>) : <TableRow><TableCell colSpan={tableColumns.length} className="h-36 text-center text-muted-foreground">
                        <p>{hasFilters ? "Aucun résultat ne correspond à votre recherche ou à vos filtres." : emptyMessage}</p>
                        {hasFilters ? <Button variant="outline" size="sm" className="mt-3" onClick={resetFilters}>Réinitialiser les filtres</Button> : emptyAction && <div className="mt-3">{emptyAction}</div>}
                    </TableCell></TableRow>}
                </TableBody>
            </Table>
            {enablePagination && !loading && !error && <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-xs text-muted-foreground">
                <div aria-live="polite">{total ? pageIndex * currentPageSize + 1 : 0}–{Math.min((pageIndex + 1) * currentPageSize, total)} sur {total} résultats{enableRowSelection && ` · ${table.getFilteredSelectedRowModel().rows.length} sélectionnée(s)`}</div>
                <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-2">Lignes par page
                        <select aria-label="Lignes par page" value={currentPageSize} onChange={(event) => table.setPageSize(Number(event.target.value))} className="h-8 rounded-md border bg-card px-2 text-foreground focus-visible:outline-2 focus-visible:outline-ring">
                            {[...new Set([pageSize, 10, 20, 50])].sort((a, b) => a - b).map((size) => <option key={size} value={size}>{size}</option>)}
                        </select>
                    </label>
                    <Button variant="ghost" size="icon-sm" className="hidden sm:inline-flex" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()} aria-label="Première page"><ChevronsLeft /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Page précédente"><ChevronLeft /></Button>
                    <span className="font-mono">{pageIndex + 1} / {Math.max(table.getPageCount(), 1)}</span>
                    <Button variant="ghost" size="icon-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Page suivante"><ChevronRight /></Button>
                    <Button variant="ghost" size="icon-sm" className="hidden sm:inline-flex" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()} aria-label="Dernière page"><ChevronsRight /></Button>
                </div>
            </div>}
        </section>
    )
}
