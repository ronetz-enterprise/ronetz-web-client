import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { Loader2, Lock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmailField } from "./EmailField"
import { IconInput } from "./IconInput"
import { errorClass } from "./styles"
import type { AuthFormValues } from "./types"

interface RegisterDetailsStepProps {
  busy: boolean
  email: string
  register: UseFormRegister<AuthFormValues>
  errors: FieldErrors<AuthFormValues>
  onSubmit: (e: React.FormEvent) => void
  onEditEmail: () => void
}

export function RegisterDetailsStep({
  busy,
  email,
  register,
  errors,
  onSubmit,
  onEditEmail,
}: RegisterDetailsStepProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <EmailField email={email} onEdit={onEditEmail} />

      <div className="flex flex-col gap-2">
        <IconInput
          icon={User}
          placeholder="Nom"
          aria-label="Nom"
          className="h-12 rounded-xl"
          autoFocus
          {...register("name", { required: "Nom requis" })}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <IconInput
          icon={Lock}
          id="new-password"
          type="password"
          placeholder="Mot de passe"
          aria-label="Mot de passe"
          className="h-12 rounded-xl"
          {...register("password", {
            required: "Mot de passe requis",
            minLength: { value: 6, message: "6 caractères minimum" },
          })}
        />
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
        Créer mon compte
      </Button>
    </form>
  )
}
