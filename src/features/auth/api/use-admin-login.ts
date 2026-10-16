import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { authService } from './auth-service'
import type { AdminLoginPayload, AdminLoginResponse } from './types'
import { useAuthStore } from '@/stores/auth-store'
import { handleServerError } from '@/lib/handle-server-error'

interface UseAdminLoginOptions {
  redirectTo?: string
}

export function useAdminLogin(options?: UseAdminLoginOptions) {
  const navigate = useNavigate()
  const { setUser, setTokens, setAccessToken } = useAuthStore(
    (state) => state.auth
  )

  return useMutation<AdminLoginResponse, Error, AdminLoginPayload>({
    mutationFn: (payload) => authService.adminLogin(payload),
    onSuccess: (res, variables) => {
      const accessToken =
        res.data?.accessToken ||
        (res as any)?.accessToken ||
        res.data?.user?.accessToken ||
        ''
      const refreshToken =
        res.data?.refreshToken ||
        (res as any)?.refreshToken ||
        res.data?.user?.refreshToken ||
        ''

      const rawUser =
        res.data?.user || res.data?.admin || (res.data ? res.data : null)

      const user =
        rawUser && typeof rawUser === 'object'
          ? {
              ...(rawUser as any),
              email: (rawUser as any).email || variables.email,
              role: (rawUser as any).role || ['admin'],
            }
          : {
              email: variables.email,
              role: ['admin'],
            }

      if (accessToken) {
        if (refreshToken) {
          setTokens(accessToken, refreshToken)
        } else {
          setAccessToken(accessToken)
        }
      }

      if (user) {
        setUser(user)
      }

      toast.success(res.message || 'Signed in successfully!')

      const destination =
        options?.redirectTo &&
        options.redirectTo !== '/sign-in' &&
        options.redirectTo !== '/(auth)/sign-in'
          ? options.redirectTo
          : '/'

      navigate({ to: destination, replace: true })
    },
    onError: (error) => {
      handleServerError(error)
    },
  })
}
