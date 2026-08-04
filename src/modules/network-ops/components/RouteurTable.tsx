import React from "react";
import {
  Router,
  Download,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  WifiOff,
  Power,
  RefreshCw,
  ShieldOff,
  Network,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Routeur } from "../types";

interface RouteurTableProps {
  routeurs: Routeur[];
  loading: boolean;
  onDownloadConfig: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (routeur: Routeur) => void;
  onActivate?: (id: string) => void;
  onRotateSecrets?: (id: string) => void;
}

const statusConfig: Record<
  Routeur["status"],
  { icon: React.ReactNode; label: string; className: string }
> = {
  ACTIVE: {
    icon: <CheckCircle2 size={12} />,
    label: "Actif",
    className: "bg-green-50 text-green-600 border-green-100",
  },
  PROVISIONED: {
    icon: <Power size={12} />,
    label: "Provisionné",
    className: "bg-amber-50 text-amber-600 border-amber-100",
  },
  OFFLINE: {
    icon: <WifiOff size={12} />,
    label: "Hors ligne",
    className: "bg-red-50 text-red-600 border-red-100",
  },
  DECOMMISSIONED: {
    icon: <ShieldOff size={12} />,
    label: "Déclassé",
    className: "bg-slate-50 text-slate-400 border-slate-100",
  },
};

export const RouteurTable: React.FC<RouteurTableProps> = ({
  routeurs,
  loading,
  onDownloadConfig,
  onDelete,
  onEdit,
  onActivate,
  onRotateSecrets,
}) => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Routeur
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Site
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                IP VPN
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Statut
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Dernier contact
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-8 py-8">
                    <div className="h-4 bg-slate-100 rounded-full w-full" />
                  </td>
                </tr>
              ))
            ) : routeurs.length > 0 ? (
              routeurs.map((r) => {
                const sc = statusConfig[r.status];
                const isDecommissioned = r.status === "DECOMMISSIONED";
                return (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/50 transition-colors duration-200 group"
                  >
                    {/* Name */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                          <Router size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight">
                            {r.name}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 font-mono">
                            {r.id.slice(0, 8)}…
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Site */}
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-600 font-mono">
                        {r.siteId.slice(0, 8)}…
                      </span>
                    </td>

                    {/* VPN IP */}
                    <td className="px-8 py-6">
                      <span className="text-sm font-mono text-slate-500">
                        {r.vpnIpAddress ?? "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-8 py-6">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${sc.className}`}
                      >
                        {sc.icon}
                        {sc.label}
                      </div>
                    </td>

                    {/* Last heartbeat */}
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest">
                        {r.lastHeartbeatAt
                          ? new Date(r.lastHeartbeatAt).toLocaleString("fr-FR")
                          : "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Activate — only for PROVISIONED */}
                        {r.status === "PROVISIONED" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onActivate?.(r.id)}
                            title="Activer"
                            className="h-9 w-9 text-amber-500 hover:text-green-600 hover:bg-green-50 rounded-xl"
                          >
                            <Power size={16} />
                          </Button>
                        )}

                        {/* Rotate secrets — only for ACTIVE */}
                        {r.status === "ACTIVE" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Régénérer les secrets VPN et RADIUS ? Les connexions actives seront interrompues."
                                )
                              ) {
                                onRotateSecrets?.(r.id);
                              }
                            }}
                            title="Rotation des secrets"
                            className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl"
                          >
                            <RefreshCw size={16} />
                          </Button>
                        )}

                        {/* Download config */}
                        {!isDecommissioned && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDownloadConfig(r.id, r.name)}
                            title="Télécharger la config"
                            className="h-9 w-9 text-slate-400 hover:text-primary rounded-xl hover:bg-slate-50"
                          >
                            <Download size={16} />
                          </Button>
                        )}

                        {/* VPN key */}
                        {r.vpnPublicKey && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(r.vpnPublicKey!);
                            }}
                            title="Copier la clé publique VPN"
                            className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-xl"
                          >
                            <Network size={16} />
                          </Button>
                        )}

                        {/* Edit */}
                        {!isDecommissioned && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit?.(r)}
                            title="Modifier"
                            className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-xl"
                          >
                            <Edit size={16} />
                          </Button>
                        )}

                        {/* Delete */}
                        {!isDecommissioned && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(r.id)}
                            title="Supprimer"
                            className="h-9 w-9 text-slate-400 hover:text-red-500 rounded-xl"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <Router size={48} className="mx-auto text-slate-100 mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Aucun routeur détecté
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
