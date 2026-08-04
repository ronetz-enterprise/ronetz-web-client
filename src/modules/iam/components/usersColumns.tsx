import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { type UserDetails } from "../types";
import { MoreHorizontal, Shield, UserX, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type UserTableActions = {
  currentUserId: string;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onGrantAdminWifi: (id: string, tenantName: string) => void;
};

function PromoteDialog({
  userId,
  onConfirm,
}: {
  userId: string;
  onConfirm: (id: string, tenantName: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tenantName, setTenantName] = useState("");

  const handleConfirm = () => {
    if (!tenantName.trim()) return;
    onConfirm(userId, tenantName.trim());
    setOpen(false);
    setTenantName("");
  };

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Shield className="mr-2 h-4 w-4" />
        Élever en ADMIN_WIFI
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setTenantName(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Élever en ADMIN_WIFI</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="tenantName">Nom de l'entreprise</Label>
            <Input
              id="tenantName"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              placeholder="Ex: Acme Corp"
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfirm} disabled={!tenantName.trim()}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const getUsersColumns = (actions: UserTableActions): ColumnDef<UserDetails>[] => [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "name",
    header: "Identité",
    cell: ({ row }) => {
      const fn = row.original.firstName;
      const ln = row.original.lastName;
      const label = [fn, ln].filter(Boolean).join(" ") || "—";
      return <span className="text-foreground">{label}</span>;
    },
  },
  {
    accessorKey: "countryCode",
    header: "Pays",
    cell: ({ row }) => row.original.countryCode ?? "—",
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-medium">
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "active",
    header: "Statut",
    cell: ({ row }) => {
      const active = row.original.active;
      return (
        <StatusBadge tone={active ? "success" : "danger"}>
          {active ? "Actif" : "Bloqué"}
        </StatusBadge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Création",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const u = row.original;
      const isSelf = u.id === actions.currentUserId;
      const isGlobalAdmin = u.role === "SUPER_ADMIN";

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
                disabled={!actions.currentUserId}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Menu actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {u.role === "CLIENT" && !isSelf && (
                <PromoteDialog userId={u.id} onConfirm={actions.onGrantAdminWifi} />
              )}
              {!isGlobalAdmin && !isSelf && (
                <DropdownMenuItem onClick={() => actions.onToggleStatus(u.id)}>
                  <UserX className="mr-2 h-4 w-4" />
                  {u.active ? "Bloquer le compte" : "Débloquer le compte"}
                </DropdownMenuItem>
              )}
              {!isGlobalAdmin && !isSelf && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      if (window.confirm("Supprimer définitivement cet utilisateur ?")) {
                        actions.onDelete(u.id);
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
