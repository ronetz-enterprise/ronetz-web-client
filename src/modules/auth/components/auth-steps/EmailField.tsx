import { Mail, Pencil } from "lucide-react"

import { IconInput } from "./IconInput"

/** Shows the email confirmed in the previous step as a read-only field, with a way back to change it. */
export function EmailField({ email, onEdit }: { email: string; onEdit: () => void }) {
  return (
    <div className="relative">
      <IconInput
        icon={Mail}
        type="email"
        value={email}
       
        readOnly
        tabIndex={-1}
        aria-label="Adresse email confirmée"
        className=" cursor-default  bg-muted/40 pr-9 text-muted-foreground"
      />
      <button
        type="button"
        onClick={onEdit}
        aria-label="Modifier l'email"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>
  )
}
