import { cn } from "@/shared/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "../hooks/useAuth"
import { useForm } from "react-hook-form"
import type { LoginRequest } from "../../auth/types"
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path fill="#FFC107" d="M43.6 20.5H42V20.5H24v7h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5-5C33.7 6.3 29.1 4.5 24 4.5 12.9 4.5 4 13.4 4 24.5s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l5.8 4.2C13.6 15.1 18.4 12 24 12c3.1 0 5.8 1.1 8 3l5-5c-3.3-3.1-7.9-5-13-5-7.7 0-14.3 4.4-17.7 10.8z" />
      <path fill="#4CAF50" d="M24 44.5c5 0 9.6-1.9 13-5l-6-5c-2 1.4-4.5 2.2-7 2.2-5.3 0-9.7-3.4-11.3-8l-6 4.6C10 39.8 16.4 44.5 24 44.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20.5H24v7h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6 5C40.6 35 44 30.2 44 24.5c0-1.3-.1-2.7-.4-4z" />
    </svg>
  )
}

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login, loginWithGoogle, isLoading } = useAuth()
  const { register, handleSubmit } = useForm<LoginRequest>()

  const onSubmit = (data: LoginRequest) => {
    login(data).catch(() => {})
  }

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">Connexion</h2>
        <p className="text-sm text-muted-foreground">
          Entrez vos identifiants pour accéder à votre espace
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            {...register("email")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Mot de passe</Label>
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Mot de passe oublié ?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            {...register("password")}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full mt-1">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Se connecter
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        className="w-full"
        onClick={() => loginWithGoogle().catch(() => {})}
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        Continuer avec Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link to="/register" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
