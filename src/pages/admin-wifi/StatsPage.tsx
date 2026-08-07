import { Banknote, RefreshCw, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatAmount } from "@/shared/lib/format";
import { useDashboardStats } from "@/modules/commerce/hooks/useDashboardStats";
import { KpiCard } from "@/shared/components/KpiCard";
import { StatusBadge } from "@/shared/components/StatusBadge";

const salesChartConfig = {
  count: { label: "Ventes", color: "var(--chart-1)" },
  revenue: { label: "Revenu", color: "var(--chart-2)" },
} satisfies ChartConfig;

// Fixed pattern (not random) so the bars don't jitter on re-render while
// loading stays true — just enough variance to read as "a bar chart" rather
// than a blank rectangle.
const CHART_SKELETON_HEIGHTS = [55, 85, 40, 70, 95, 60];

export default function StatsPage() {
  const { stats, loading, refresh } = useDashboardStats();

  const currency = stats?.recentSales[0]?.currency ?? "XAF";
  const fmt = (n: number) => {
    try { return formatAmount(n, currency); }
    catch { return `${n.toLocaleString("fr-FR")} ${currency}`; }
  };

  // Normalize revenue scale for stacked display: divide by 1000 for readability
  const chartData = stats?.topProducts.map((p) => ({
    name: p.productName.length > 14 ? p.productName.slice(0, 14) + "…" : p.productName,
    fullName: p.productName,
    count: p.count,
    revenue: Math.round(p.revenue / 1000),
  })) ?? [];

  const topProduct = stats?.topProducts[0];

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Statistiques</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={refresh} title="Actualiser">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Same recipe as AdminHomePage/WalletPage: content capped and
          centered, Card-based KPIs with real gaps instead of a flat
          divide-x/divide-y dashboard strip. */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-4">

        {/* KPI Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <KpiCard title="Revenus (30j)" value={stats ? fmt(stats.revenue30d) : "—"}
            subtitle="Total encaissé" icon={Banknote} loading={loading}  />
          <KpiCard title="Forfaits vendus" value={stats ? `${stats.subscriptions30d}` : "—"}
            subtitle="Achats validés" icon={ShoppingBag} loading={loading} />
          <KpiCard title="Abonnements actifs" value={stats ? `${stats.activeSubscriptions}` : "—"}
            subtitle="En cours" icon={Users} loading={loading} />
         
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Main chart — forfaits les mieux vendus */}
          <Card>
            <CardHeader>
              <CardTitle>Forfaits les mieux vendus</CardTitle>
              <CardDescription>Ventes et revenus par forfait — 30 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 w-full flex items-end justify-between gap-3 px-2">
                  {CHART_SKELETON_HEIGHTS.map((h, i) => (
                    <Skeleton key={i} className="w-full rounded-md" style={{ height: `${h}%` }} />
                  ))}
                </div>
              ) : !chartData.length ? (
                <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
                  Aucune vente sur la période
                </div>
              ) : (
                <ChartContainer config={salesChartConfig}>
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis tickLine={false} axisLine={false} width={40} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name, item) => {
                            if (name === "revenue") {
                              return [
                                fmt(item.payload.revenue * 1000),
                                salesChartConfig.revenue.label,
                              ];
                            }
                            return [String(value), salesChartConfig.count.label];
                          }}
                          labelFormatter={(_, payload) => payload[0]?.payload?.fullName ?? ""}
                        />
                      }
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey="count"
                      stackId="a"
                      fill="var(--color-count)"
                      radius={[0, 0, 4, 4]}
                    />
                    <Bar
                      dataKey="revenue"
                      stackId="a"
                      fill="var(--color-revenue)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
            {loading ? (
              <CardFooter className="flex-col items-start gap-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardFooter>
            ) : topProduct && (
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                  Meilleur forfait : {topProduct.productName}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  {topProduct.count} vente{topProduct.count > 1 ? "s" : ""} · {fmt(topProduct.revenue)}
                </div>
              </CardFooter>
            )}
          </Card>

          {/* Recent sales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Derniers achats</CardTitle>
              <CardDescription className="text-xs">10 transactions les plus récentes</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="divide-y">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-3.5 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-10 rounded-full" />
                        <Skeleton className="h-4 w-14" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !stats?.recentSales.length ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Aucun achat sur les 30 derniers jours
                </div>
              ) : (
                <div className="divide-y">
                  {stats.recentSales.map((sale, i) => {
                    const date = new Date(sale.paidAt);
                    return (
                      <div key={i} className="flex items-center justify-between px-6 py-3 text-sm hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                            <ShoppingBag className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium leading-none">{sale.productName}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge tone="success" className="text-[10px]">
                            Payé
                          </StatusBadge>
                          <span className="font-semibold tabular-nums">{fmt(sale.amount)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
