import { cn } from "@/shared/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "../hooks/useAuth"
import { useForm } from "react-hook-form"
import type { LoginRequest } from "../../auth/types"
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login, isLoading } = useAuth()
  const { register, handleSubmit } = useForm<LoginRequest>()

  const onSubmit = (data: LoginRequest) => {
    login(data)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link to="/register" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
