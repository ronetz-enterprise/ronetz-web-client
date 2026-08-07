import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppleIcon, GoogleIcon } from "../icons"

interface MethodStepProps {
  busy: boolean
  onGoogle: () => void
  onApple: () => void
  onEmail: () => void
}

export function MethodStep({ busy, onGoogle, onApple, onEmail }: MethodStepProps) {
  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={busy}
        className="w-full rounded-xl"
        onClick={onGoogle}
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        Continuer avec Google
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={busy}
        className="w-full rounded-xl"
        onClick={onApple}
      >
        <AppleIcon className="mr-2 h-4 w-4" />
        Continuer avec Apple
      </Button>

      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={busy}
        className="w-full mt-1 rounded-xl"
        onClick={onEmail}
      >
        <Mail className="mr-2 h-4 w-4" />
        Continuer avec un email
      </Button>
    </div>
  )
}
