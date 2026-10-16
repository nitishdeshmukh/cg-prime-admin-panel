export interface Creator {
  id: number
  name: string | null
  phoneNumber: string
  bio: string | null
  youtubeLink: string | null
  instagramLink: string | null
  profileImage: string | null
  enabled: boolean
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface GetCreatorsParams {
  page?: number // 0-based
  size?: number
  sortBy?: string
  sortDir?: 'ASC' | 'DESC'
  search?: string
  createdAtFrom?: string
  createdAtTo?: string
}

export interface CreatorsPageData {
  content: Creator[]
  size: number
  totalElements: number
  totalPages: number
}

export interface GetCreatorsResponse {
  error: boolean
  statusCode: number
  message: string | null
  serverError: string | null
  data: CreatorsPageData
}

export interface GetCreatorResponse {
  error: boolean
  statusCode: number
  message: string | null
  serverError: string | null
  data: Creator
}

export interface CreateCreatorPayload {
  name: string
  phoneNumber: string
  dialCode: string
  email: string
  bio?: string
  youtubeLink?: string
}

export interface CreateCreatorResponse {
  error: boolean
  statusCode: number
  message: string | null
  serverError: string | null
  data?: Creator | unknown
}

export interface UpdateCreatorPayload {
  name?: string
  bio?: string
  youtubeLink?: string
  instagramLink?: string
  profileImage?: string | null
  enabled?: boolean
  onboardingCompleted?: boolean
}

export interface UpdateCreatorResponse {
  error: boolean
  statusCode: number
  message: string | null
  serverError: string | null
  data: Creator
}
