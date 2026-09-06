import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowDownToLine, ArrowRight, ArrowUpFromLine, CircleDollarSign, ShoppingBag, TicketCheck, Users, Wallet } from "lucide-react"
import { useWallet } from "@/modules/wallet/hooks/useWallet"
import { useDashboardStats } from "@/modules/commerce/hooks/useDashboardStats"
import type { TransactionType } from "@/modules/wallet/types"
import { KpiCard } from "@/shared/components/KpiCard"
import { StatusBadge, type StatusBadgeTone } from "@/shared/components/StatusBadge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatAmount } from "@/shared/lib/format"

const TX_LABEL: Record<TransactionType, string> = { CREDIT: "Vente", DEBIT: "Retrait" }
const TX_TONE: Record<TransactionType, StatusBadgeTone> = { CREDIT: "success", DEBIT: "warning" }

const AdminHomePage: React.FC = () => {
  const navigate = useNavigate()
  const { wallet, transactions, loading: walletLoading } = useWallet()
  const { stats, loading: statsLoading } = useDashboardStats()
  const currency = wallet?.balanceCurrency ?? stats?.recentSales[0]?.currency ?? "XAF"
  const fmt = (n: number) => { try { return formatAmount(n, currency) } catch { return n.toLocaleString("fr-FR") + " " + currency } }
  const recentTransactions = transactions.slice(0, 4)
  const recentEvents = stats?.recentSales.slice(0, 4) ?? []
  const maxRevenue = Math.max(...(stats?.dailyRevenue.map((day) => day.revenue) ?? [1]), 1)

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Réseau opérationnel</div>
          <h1 className="text-2xl font-semibold tracking-[-.035em] sm:text-[30px]">Bonjour, votre activité en un coup d’œil.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Les informations utiles pour piloter vos ventes et vos accès Wi-Fi.</p>
        </div>
        <Button onClick={() => navigate("/forfaits")}><ShoppingBag />Créer un forfait</Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Solde disponible" value={walletLoading ? "—" : fmt(wallet?.balanceAmount ?? 0)} subtitle="Disponible pour un retrait" icon={Wallet} loading={walletLoading} />
        <KpiCard title="Revenus sur 30 jours" value={stats ? fmt(stats.revenue30d) : "—"} subtitle={(stats?.subscriptions30d ?? 0) + " ventes finalisées"} icon={CircleDollarSign} loading={statsLoading} />
        <KpiCard title="Accès actifs" value={String(stats?.activeSubscriptions ?? 0)} subtitle="Utilisateurs actuellement couverts" icon={Users} loading={statsLoading} />
        <KpiCard title="Panier moyen" value={stats ? fmt(stats.averageOrderValue) : "—"} subtitle="Par forfait vendu" icon={TicketCheck} loading={statsLoading} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
        <Card className="ronet-signal">
          <CardHeader className="flex flex-row items-start justify-between">
            <div><CardTitle>Revenus quotidiens</CardTitle><CardDescription>Évolution des 30 derniers jours</CardDescription></div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/stats")}>Analyser <ArrowRight /></Button>
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-52 w-full rounded-xl" /> : (
              <div className="flex h-52 items-end gap-1.5" aria-label="Graphique des revenus quotidiens">
                {(stats?.dailyRevenue ?? []).map((day) => (
                  <div key={day.date} className="group relative flex min-w-1 flex-1 items-end">
                    <div className="w-full rounded-t-[5px] bg-primary/20 transition-colors group-hover:bg-primary/55" style={{ height: Math.max(6, day.revenue / maxRevenue * 100) + "%" }} />
                    <span className="sr-only">{day.date}: {fmt(day.revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background-0 text-background-0-foreground">
          <CardHeader><CardTitle className="text-background-0-foreground">Forfaits les plus demandés</CardTitle><CardDescription className="text-background-0-foreground/55">Classement par nombre de ventes</CardDescription></CardHeader>
          <CardContent className="space-y-5">
            {(stats?.topProducts.slice(0, 4) ?? []).map((product, index) => (
              <div key={product.productName} className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/8 text-xs text-white/60">{index + 1}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{product.productName}</p><p className="mt-1 text-xs text-white/45">{product.count} ventes</p></div>
                <span className="text-sm font-semibold tabular-nums">{fmt(product.revenue)}</span>
              </div>
            ))}
            {!statsLoading && !stats?.topProducts.length && <p className="py-8 text-center text-sm text-white/50">Les forfaits vendus apparaîtront ici.</p>}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ActivityCard title="Mouvements du portefeuille" description="Entrées et retraits récents" empty="Aucun mouvement n’a encore été enregistré." action={() => navigate("/wallet")}>
          {walletLoading ? <LoadingRows /> : recentTransactions.map((tx) => {
            const credit = tx.type === "CREDIT"
            return <ActivityRow key={tx.id} icon={credit ? ArrowUpFromLine : ArrowDownToLine} title={tx.description} meta={new Date(tx.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })} trailing={<div className="flex items-center gap-3"><StatusBadge tone={TX_TONE[tx.type]}>{TX_LABEL[tx.type]}</StatusBadge><span className="font-semibold tabular-nums">{credit ? "+" : "−"}{fmt(tx.amount)}</span></div>} />
          })}
        </ActivityCard>
        <ActivityCard title="Ventes récentes" description="Derniers forfaits payés" empty="Aucune vente sur les 30 derniers jours." action={() => navigate("/stats")}>
          {statsLoading ? <LoadingRows /> : recentEvents.map((sale, index) => <ActivityRow key={index} icon={ShoppingBag} title={sale.productName} meta={new Date(sale.paidAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })} trailing={<span className="font-semibold tabular-nums">{fmt(sale.amount)}</span>} />)}
        </ActivityCard>
      </section>
    </div>
  )
}

function ActivityCard({ title, description, empty, action, children }: { title: string; description: string; empty: string; action: () => void; children: React.ReactNode }) {
  const hasChildren = React.Children.count(children) > 0
  return <Card><CardHeader className="flex flex-row items-start justify-between"><div><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></div><Button variant="ghost" size="sm" onClick={action}>Voir tout <ArrowRight /></Button></CardHeader><CardContent className="space-y-1 p-2">{hasChildren ? children : <p className="px-4 py-12 text-center text-sm text-muted-foreground">{empty}</p>}</CardContent></Card>
}
function ActivityRow({ icon: Icon, title, meta, trailing }: { icon: React.ElementType; title: string; meta: string; trailing: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-muted/65"><div className="flex min-w-0 items-center gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-4 w-4" /></div><div className="min-w-0"><p className="truncate text-sm font-medium">{title}</p><p className="mt-1 text-xs text-muted-foreground">{meta}</p></div></div>{trailing}</div>
}
function LoadingRows() { return <div className="space-y-2 p-2">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div> }
export default AdminHomePage