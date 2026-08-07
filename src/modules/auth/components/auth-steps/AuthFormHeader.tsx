import type { Step } from "./types"

const TITLES: Record<Step, string> = {
  method: "Se connecter ou s'inscrire",
  email: "Se connecter ou s'inscrire",
  "login-password": "Connexion",
  "register-details": "Créer un compte",
}

const SUBTITLES: Record<Step, string> = {
  method: "Gérez vos accès WiFi en quelques secondes.",
  email: "Entrez votre email pour continuer.",
  "login-password": "Entrez votre mot de passe pour accéder à votre espace.",
  "register-details": "Encore quelques informations pour finaliser votre inscription.",
}

export function AuthFormHeader({ step }: { step: Step }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="text-2xl text-center font-semibold tracking-tight">{TITLES[step]}</h2>
      <p className="text-sm  text-center text-muted-foreground">{SUBTITLES[step]}</p>
    </div>
  )
}
