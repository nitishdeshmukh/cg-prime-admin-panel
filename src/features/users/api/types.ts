export interface AppUser {
  id: number
  fcmToken: string | null
  phoneNumber: string
  dialCode: string | null
  name: string | null
  profilePicLink: string | null
  badge: string | null
  lastUsedAt: string | null
  latestAppVersion?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  lat?: number | null
  longitude?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface GetUsersParams {
  page?: number // 0-based
  size?: number
  sortBy?: string
  sortDir?: 'ASC' | 'DESC'
  country?: string
  state?: string
  city?: string
  search?: string
}

export interface UsersPageData {
  content: AppUser[]
  size: number
  totalElements: number
  totalPages: number
}

export interface GetUsersResponse {
  error: boolean
  statusCode: number
  message: string | null
  serverError: string | null
  data: UsersPageData
}

export interface GetUserResponse {
  error: boolean
  statusCode: number
  message: string | null
  serverError: string | null
  data: AppUser
}

export interface DeleteUserResponse {
  error: boolean
  statusCode: number
  message: string | null
  serverError: string | null
}


