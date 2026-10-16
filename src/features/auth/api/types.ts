export interface AdminLoginPayload {
  email: string
  password: string
}

export interface AdminUserData {
  id?: number
  email?: string
  name?: string | null
  role?: string[]
  [key: string]: unknown
}

export interface AdminLoginResponse {
  error?: boolean
  statusCode?: number
  message?: string
  serverError?: unknown | null
  data?: {
    user?: AdminUserData | null
    admin?: AdminUserData | null
    accessToken?: string
    refreshToken?: string
    [key: string]: unknown
  }
}

export interface RefreshTokenPayload {
  refreshToken?: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken?: string
}
