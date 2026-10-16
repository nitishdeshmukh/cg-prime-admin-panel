import { publicApi, protectedApi } from '@/lib/api/axios-client'
import type { AdminLoginPayload, AdminLoginResponse } from './types'

export const authService = {
  /**
   * Admin authentication via email and password
   */
  adminLogin: async (payload: AdminLoginPayload): Promise<AdminLoginResponse> => {
    const response = await publicApi.post<AdminLoginResponse>(
      'api/auth/admin/login',
      payload
    )
    return response.data
  },

  /**
   * Logout admin from session
   */
  logout: async (): Promise<void> => {
    await protectedApi.post('api/auth/logout')
  },
}
