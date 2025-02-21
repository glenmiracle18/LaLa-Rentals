import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-600 to bg-orange-300">
      <SignIn fallbackRedirectUrl="/listing" />
    </div>
  )
}