import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { Loader2, Mail } from "lucide-react"

import { IconInput } from "./IconInput"
import { errorClass } from "./styles"
import type { AuthFormValues } from "./types"
import { Button } from "@/components/ui/button"

interface EmailStepProps {
  busy: boolean
  register: UseFormRegister<AuthFormValues>
  errors: FieldErrors<AuthFormValues>
  onSubmit: (e: React.FormEvent) => void
}

export function EmailStep({ busy, register, errors, onSubmit }: EmailStepProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <IconInput
          icon={Mail}
          id="email"
         
          type="email"
          placeholder="Email"
          aria-label="Email"
          
          autoFocus
          {...register("email", { required: "Email requis" })}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <Button
        type="submit"
        variant="default"
        size="lg"
        disabled={busy}
        className="w-full mt-1"
      >
        {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Continuer
      </Button>
    </form>
  )
}
