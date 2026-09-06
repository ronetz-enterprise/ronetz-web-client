import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface KpiCardProps {
  title: string; value: string; subtitle?: string; icon: React.ElementType; loading: boolean
}
export function KpiCard({ title, value, subtitle, icon: Icon, loading }: KpiCardProps) {
  return (
    <Card className="min-h-36 justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle className="text-[12px] font-medium text-muted-foreground">{title}</CardTitle>
        <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-accent text-accent-foreground"><Icon className="h-4 w-4" /></div>
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="mt-1 h-8 w-32 rounded-lg" /> : (
          <>
            <p className="text-[26px] font-semibold leading-none tracking-[-.04em] tabular-nums">{value}</p>
            {subtitle && <p className="mt-2 text-xs leading-5 text-muted-foreground">{subtitle}</p>}
          </>
        )}
      </CardContent>
    </Card>
  )
}