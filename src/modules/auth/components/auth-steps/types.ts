export type Step = "method" | "email" | "login-password" | "register-details"

export interface AuthFormValues {
  email: string
  password: string
  name: string
}
