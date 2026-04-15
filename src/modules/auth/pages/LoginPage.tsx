import { LoginForm } from '@/modules/auth/components/LoginForm.tsx';

export default function LoginPage() {
  return (
    <div className="flex  flex-col items-center justify-center  bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
