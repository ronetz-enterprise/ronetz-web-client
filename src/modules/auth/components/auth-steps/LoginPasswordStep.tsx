import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { Loader2, Lock } from "lucide-react"

import { EmailField } from "./EmailField"
import { IconInput } from "./IconInput"
import { errorClass } from "./styles"
import type { AuthFormValues } from "./types"
import { Button } from "@/components/ui/button"

interface LoginPasswordStepProps {
  busy: boolean
  email: string
  register: UseFormRegister<AuthFormValues>
  errors: FieldErrors<AuthFormValues>
  onSubmit: (e: React.FormEvent) => void
  onEditEmail: () => void
}

export function LoginPasswordStep({ busy, email, register, errors, onSubmit, onEditEmail }: LoginPasswordStepProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <EmailField email={email} onEdit={onEditEmail} />

      <div className="flex flex-col gap-2">
        <IconInput
          icon={Lock}
          id="password"
          type="password"
          aria-label="Mot de passe"
         
          autoFocus
          {...register("password", { required: "Mot de passe requis" })}
        />
        <a href="#" className="text-xs text-end text-muted-foreground transition-colors hover:text-foreground">
          Mot de passe oublié ?
        </a>
        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
      </div>

      <Button
        type="submit"
        variant="default"
        size="lg"
        disabled={busy}
        className="w-full mt-1"
      >
        {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Se connecter
      </Button>
    </form>
  )
}
