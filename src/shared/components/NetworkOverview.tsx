import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom"
import { siteApi } from "@/modules/network-ops/api/siteApi"
import { routeurApi } from "@/modules/network-ops/api/routeurApi"
import { useAuthStore } from "@/modules/auth/store/authStore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "./StatusBadge"

export function NetworkOverview() {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const network = useQuery({
    queryKey: ["console-network", user?.id, user?.domainId],
    queryFn: async () => {
      const [sites, routers] = await Promise.all([siteApi.getSites(), routeurApi.list()])
      return { sites: sites.data, routers: routers.data }
    },
    staleTime: 30_000,
  })
  const offline = network.data?.routers.filter(router => router.status === "OFFLINE") ?? []
  const pending = network.data?.routers.filter(router => router.status === "PROVISIONED") ?? []
  const active = network.data?.routers.filter(router => router.status === "ACTIVE").length ?? 0
  return <Card>
    <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2"><CardTitle>Infrastructure</CardTitle><Button variant="ghost" size="sm" onClick={() => navigate("/routeurs")}>Gérer les routeurs</Button></CardHeader>
    <CardContent>
      {network.isPending ? <Skeleton className="h-24 w-full" /> : network.isError ? <div role="alert" className="flex flex-wrap items-center justify-between gap-3 text-sm"><p>Impossible de charger l’état du réseau.</p><Button variant="outline" size="sm" onClick={() => network.refetch()}>Réessayer</Button></div> : <>
        <dl className="grid grid-cols-2 gap-5 border-b pb-5 sm:grid-cols-4">{[["Sites configurés", network.data.sites.length], ["Routeurs actifs", active], ["À configurer", pending.length], ["Hors ligne", offline.length]].map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-2 font-mono text-xl font-medium">{value}</dd></div>)}</dl>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          {offline.length > 0 ? <><div className="flex flex-wrap items-center gap-2"><StatusBadge tone="danger">À vérifier</StatusBadge><span>{offline.length} routeur{offline.length > 1 ? "s" : ""} hors ligne : {offline.slice(0, 3).map(r => r.name).join(", ")}{offline.length > 3 ? "…" : ""}</span></div><Link to="/routeurs" className="font-medium text-primary underline-offset-4 hover:underline">Consulter le réseau</Link></> : pending.length > 0 ? <><StatusBadge tone="warning">Configuration en attente</StatusBadge><span className="text-muted-foreground">Téléchargez la configuration de vos routeurs pour les connecter.</span></> : network.data.routers.length === 0 ? <><p className="text-muted-foreground">Ajoutez un routeur pour commencer à superviser votre réseau.</p><Link to="/routeurs" className="font-medium text-primary hover:underline">Ajouter un routeur</Link></> : <><StatusBadge tone="neutral">Dernier état connu</StatusBadge><p className="text-muted-foreground">Aucun routeur signalé hors ligne.</p></>}
        </div>
      </>}
    </CardContent>
  </Card>
}
