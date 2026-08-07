import { AuthForm } from '@/modules/auth/components/AuthForm';

// Same entry point as /login: the flow itself (AuthForm) figures out
// whether this email is signing in or creating an account.
export default function RegisterPage() {
  return <AuthForm />;
}
