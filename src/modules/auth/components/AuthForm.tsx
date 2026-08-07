import { useState } from "react"
import { useForm } from "react-hook-form"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { useAuth } from "../hooks/useAuth"
import { useRegister } from "../hooks/useRegister"
import { isEmailAlreadyInUseError } from "../lib/authError"
import { AuthFormHeader } from "./auth-steps/AuthFormHeader"
import { EmailStep } from "./auth-steps/EmailStep"
import { LoginPasswordStep } from "./auth-steps/LoginPasswordStep"
import { MethodStep } from "./auth-steps/MethodStep"
import { RegisterDetailsStep } from "./auth-steps/RegisterDetailsStep"
import type { AuthFormValues, Step } from "./auth-steps/types"

// Email-first auth flow: pick a provider, then — if email was chosen — find
// out whether an account already exists for it before asking for a
// password. That last question is checkEmailExists()'s job; see its doc
// comment (authProvider.ts) for the best-effort caveat that can affect it.
// The step bodies live in ./auth-steps — this file only owns the state
// machine and the form instance shared across them.
export function AuthForm({ className, ...props }: React.ComponentProps<"div">) {
  const [step, setStep] = useState<Step>("method")
  const { login, loginWithGoogle, loginWithApple, checkEmailExists, isLoading } = useAuth()
  const { register: createAccount, isLoading: isRegistering } = useRegister()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthFormValues>()

  const busy = isLoading || isRegistering
  const email = watch("email")
  const goToEmailStep = () => setStep("email")
  const goBack = () => setStep(step === "email" ? "method" : "email")

  const onSubmitEmail = handleSubmit(async (data) => {
    try {
      const exists = await checkEmailExists(data.email)
      console.log("Email exists:", exists);
      setStep(exists ? "login-password" : "register-details")
    } catch {
      // useAuth already toasted the error — stay on this step.
    }
  })

  const onSubmitLogin = handleSubmit((data) => {
    login({ email: data.email, password: data.password }).catch(() => {})
  })

  const onSubmitRegister = handleSubmit(async (data) => {
    try {
      await createAccount({
        email: data.email,
        password: data.password,
        name: data.name,
      })
    } catch (error) {
      // Best-effort duplicate-email detection (checkEmailExists) can miss —
      // see its doc comment. This is the fallback: register() itself just
      // told us the account already exists, so send the user to log in
      // instead of dead-ending on an error.
      if (isEmailAlreadyInUseError(error)) setStep("login-password")
    }
  })

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      {step !== "method" && (
        <button
          type="button"
          onClick={goBack}
          aria-label="Retour"
          className="-ml-2 flex h-8 w-8 items-center absolute top-4 justify-center self-start rounded-full text-muted-foreground transition-colors bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-col gap-6"
        >
          <AuthFormHeader step={step} />

          {step === "method" && (
            <MethodStep
              busy={busy}
              onGoogle={() => loginWithGoogle().catch(() => {})}
              onApple={() => loginWithApple().catch(() => {})}
              onEmail={goToEmailStep}
            />
          )}

          {step === "email" && (
            <EmailStep busy={busy} register={register} errors={errors} onSubmit={onSubmitEmail} />
          )}

          {step === "login-password" && (
            <LoginPasswordStep
              busy={busy}
              email={email}
              register={register}
              errors={errors}
              onSubmit={onSubmitLogin}
              onEditEmail={goToEmailStep}
            />
          )}

          {step === "register-details" && (
            <RegisterDetailsStep
              busy={busy}
              email={email}
              register={register}
              errors={errors}
              onSubmit={onSubmitRegister}
              onEditEmail={goToEmailStep}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
