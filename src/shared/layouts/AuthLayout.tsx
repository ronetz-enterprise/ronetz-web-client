import React from "react"
import { Outlet } from "react-router-dom"
import { ShieldCheck, Signal, Sparkles } from "lucide-react"

const AuthLayout: React.FC = () => (
  <main className="grid min-h-svh bg-background lg:grid-cols-[1.08fr_.92fr]">
    <section className="relative hidden overflow-hidden bg-[#0a1711] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div aria-hidden className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_20%_18%,rgba(113,200,177,.22),transparent_30%),radial-gradient(circle_at_78%_64%,rgba(168,214,94,.16),transparent_34%)]" />
      <div aria-hidden className="absolute -right-28 top-28 h-[34rem] w-[34rem] rounded-full border border-white/10" />
      <div aria-hidden className="absolute -right-10 top-48 h-[22rem] w-[22rem] rounded-full border border-white/10" />
      <div aria-hidden className="absolute right-20 top-72 h-[10rem] w-[10rem] rounded-full border border-[var(--brand-lime)]/35" />

      <div className="relative flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-[var(--brand-lime)] text-[#102018]">
          <Signal className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-[-0.03em]">Ronet</p>
          <p className="text-[10px] tracking-[0.18em] text-white/45">NETWORK CONTROL</p>
        </div>
      </div>

      <div className="relative max-w-xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/65">
          <Sparkles className="h-3.5 w-3.5 text-[var(--brand-lime)]" />
          Votre réseau, clairement maîtrisé
        </div>
        <h1 className="max-w-lg text-5xl font-medium leading-[1.08] tracking-[-0.055em]">
          Connectez vos sites. Simplifiez chaque accès.
        </h1>
        <p className="mt-6 max-w-md text-[15px] leading-7 text-white/60">
          Supervisez vos hotspots, commercialisez vos forfaits et suivez vos revenus depuis un espace fiable et apaisé.
        </p>
      </div>

      <div className="relative flex items-center gap-3 text-xs text-white/50">
        <ShieldCheck className="h-4 w-4 text-[var(--brand-aqua)]" />
        Connexion sécurisée · Données protégées
      </div>
    </section>

    <section className="relative flex items-center justify-center px-5 py-10 sm:px-10">
      <div aria-hidden className="ronet-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
      <div className="relative w-full max-w-[420px]">
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-primary text-primary-foreground">
            <Signal className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold tracking-[-0.04em]">Ronet</span>
        </div>
        <div className="ronet-surface rounded-[24px] p-6 sm:p-8">
          <Outlet />
        </div>
        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
          En continuant, vous acceptez les conditions d’utilisation et la politique de confidentialité de Ronet.
        </p>
      </div>
    </section>
  </main>
)

export default AuthLayout