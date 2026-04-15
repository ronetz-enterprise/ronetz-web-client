import React from "react";
import { Clock, Wifi, Smartphone, CheckCircle2, XCircle, type LucideIcon, Ticket, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type Forfait } from "@/shared/types";

// ─── StatRow ──────────────────────────────────────────────────────────────────

interface StatRowProps {
    icon: LucideIcon;
    iconClass: string;   // Tailwind bg color for the icon square
    iconColor: string;   // Tailwind text color for the icon itself
    label: string;
    value: string;
}

function StatRow({ icon: Icon, iconClass, iconColor, label, value }: StatRowProps) {
    return (
        <div className="flex items-center p-1 gap-2.5 w-fit">
            <span className={cn("flex h-[20px] w-[20Spx] shrink-0 items-center justify-center rounded-[9px]", iconClass)}>
                <Icon className={cn("h-[12px] w-[12px]", iconColor)} />
            </span>
            <div className="min-w-0 ">
                <p className="text-[10px] font leading-none text-foreground text-center">{value}</p>
            </div>
        </div>
    );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

/**
 * primary Money version of the InternetPlanCard
 * Uses the iconic primary (#FF7900) and Black palette.
 */
export const InternetPlanCard: React.FC<{ forfait: Forfait }> = ({ forfait }) => {
    const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
    const active = forfait.isActive;

    // primary brand color: #FF7900
    // We'll use a mix of utility classes and inline styles for the brand color if needed,
    // but Tailwind's primary-2000/600 is very close. Let's use custom hex for brand accuracy.

    return (
        <div
            className={cn(
                "w-full  relative overflow-hidden rounded-md border bg-background ",
                "transition-all duration-300 hover:-translate-y-1S",
                !active && "opacity-60 grayscale-[0.5]"
            )}
        >
            {/* ── Hero ── */}
            <div
                className={cn(
                    "px-[18px] pb-[5px] pt-4 relative overflow-hidden mb-6",
                    active ? "bg-background" : "bg-muted/60"
                )}
            >
                {/* Subtle pattern overlay for primary Money feel */}
                {active && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                )}

                <div className="mb-1 flex items-start justify-between gap-2 relative z-10">
                   
                    <p className={cn(
                        "text-base  leading-snug tracking-wider",
                        active ? "text-foreground" : "text-foreground"
                    )}>
                        {forfait.nom}
                    </p>
                    {active ? (
                        <Badge variant="outline" className="shrink-0 gap-1 border-white/40 bg-white/20 text-foreground backdrop-blur-sm">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Actif
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="shrink-0 gap-1 border-muted-foreground/30 bg-muted text-muted-foreground">
                            <XCircle className="h-2.5 w-2.5" /> Inactif
                        </Badge>
                    )}
                </div>

                <div className=" flex items-baseline gap-1 relative ">
                    <span className={cn("text-xs text-muted-foreground", active ? "text-foreground " : "text-muted-foreground")}>
                        FCFA
                    </span>
                    <span className={cn("text-xl font-medium", active ? "text-foreground" : "text-foreground")}>
                        {fmt(forfait.prix)}
                    </span>
                    <span className={cn("ml-0.5 text-xs text-muted-foreground", active ? "text-foreground " : "text-muted-foreground")}>
                        / mois
                    </span>
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="flex px-1  absolute bottom-2 right-2 border w-fit justify-start divide-x  rounded-full  bg-background">
                <StatRow
                    icon={Clock}
                    iconClass={active ? "bg-primary-200 dark:bg-primary-950/30" : "bg-muted"}
                    iconColor={active ? "text-primary" : "text-muted-foreground"}
                    label="Durée"
                    value={`${fmt(forfait.duree)} H`}
                />
                <StatRow

                    icon={Wifi}
                    iconClass={active ? "bg-primary-200 dark:bg-primary-950/30 " : "bg-muted"}
                    iconColor={active ? "text-primary" : "text-muted-foreground"}
                    label="Volume de données"
                    value={`${forfait.volume} Go`}
                />
                <StatRow
                    icon={Smartphone}
                    iconClass={active ? "bg-primary-200 dark:bg-primary-950/30" : "bg-muted"}
                    iconColor={active ? "text-primary" : "text-muted-foreground"}
                    label="Appareils simultanés"
                    value={`${forfait.maxDevices}`}
                />


            </div>
        </div>
    );
}