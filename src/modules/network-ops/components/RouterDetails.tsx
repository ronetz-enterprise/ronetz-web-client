import { Copy, Download } from "lucide-react"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/shared/components/StatusBadge"
import type { Routeur } from "../types"

export function RouterDetails({ router, siteName, onClose, onDownload }: { router: Routeur | null; siteName?: string; onClose: () => void; onDownload: (id: string, name: string) => void }) {
  const copy = async (value: string) => { try { await navigator.clipboard.writeText(value); toast.success("Copié") } catch { toast.error("Impossible de copier. Sélectionnez le texte pour le copier manuellement.") } }
  return <Sheet open={!!router} onOpenChange={open => { if (!open) onClose() }}><SheetContent className="w-full overflow-y-auto sm:max-w-lg">
    <SheetHeader><SheetTitle>{router?.name ?? "Détail du routeur"}</SheetTitle><SheetDescription>Informations de connexion et configuration de l’équipement.</SheetDescription></SheetHeader>
    {router && <div className="space-y-6 px-5 pb-8">
      <StatusBadge tone={router.status === "ACTIVE" ? "success" : router.status === "OFFLINE" ? "danger" : router.status === "PROVISIONED" ? "warning" : "neutral"}>{({ ACTIVE: "Actif", OFFLINE: "Hors ligne", PROVISIONED: "À configurer", DECOMMISSIONED: "Déclassé" })[router.status]}</StatusBadge>
      <dl className="space-y-4 text-sm">
        <div><dt className="text-xs text-muted-foreground">Site</dt><dd className="mt-1 break-all">{siteName ?? router.siteId}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Identifiant</dt><dd className="mt-1 flex items-center justify-between gap-2"><code className="break-all text-xs">{router.id}</code><Button variant="ghost" size="icon-sm" aria-label="Copier l’identifiant" onClick={() => copy(router.id)}><Copy /></Button></dd></div>
        <div><dt className="text-xs text-muted-foreground">Adresse IP VPN</dt><dd className="mt-1 flex items-center justify-between gap-2"><code>{router.vpnIpAddress ?? "Non attribuée"}</code>{router.vpnIpAddress && <Button variant="ghost" size="icon-sm" aria-label="Copier l’adresse IP" onClick={() => copy(router.vpnIpAddress!)}><Copy /></Button>}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Dernier heartbeat</dt><dd className="mt-1 font-mono text-xs">{router.lastHeartbeatAt ? new Date(router.lastHeartbeatAt).toLocaleString("fr-FR") : "Aucun signal reçu"}</dd></div>
      </dl>
      <section className="space-y-3 border-t pt-5"><h2 className="text-sm font-semibold">VPN</h2><p className="text-xs leading-5 text-muted-foreground">L’état du tunnel VPN n’est pas fourni par l’API.</p>{router.vpnPublicKey ? <><p className="text-xs text-muted-foreground">Clé publique</p><code className="block break-all rounded-md border bg-muted p-3 text-xs">{router.vpnPublicKey}</code><Button variant="outline" size="sm" onClick={() => copy(router.vpnPublicKey!)}><Copy />Copier la clé publique</Button></> : <p className="text-sm">Clé publique non disponible.</p>}</section>
      <section className="space-y-3 border-t pt-5"><h2 className="text-sm font-semibold">Configuration RADIUS</h2><p className="text-sm leading-6 text-muted-foreground">Le fichier de configuration contient les paramètres nécessaires à l’enrôlement. Il peut contenir des informations sensibles.</p><Button variant="outline" disabled={router.status === "DECOMMISSIONED"} onClick={() => onDownload(router.id, router.name)}><Download />Télécharger la configuration</Button></section>
    </div>}
  </SheetContent></Sheet>
}
