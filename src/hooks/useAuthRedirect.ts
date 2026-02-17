import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useAuthRedirect = (redirectTo: string = '/dashboard') => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    const isAlreadyAtDashboard = window.location.pathname === redirectTo
    if (token && !isAlreadyAtDashboard) {
      router.replace(redirectTo)
    } else {
     requestAnimationFrame(() => {
      setIsLoading(false)
    })
    }
  }, [router, redirectTo])

  return { isLoading}
}
