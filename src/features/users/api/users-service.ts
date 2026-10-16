import { protectedApi } from '@/lib/api/axios-client'
import type {
  GetUsersParams,
  GetUsersResponse,
  GetUserResponse,
  DeleteUserResponse,
} from './types'

export const usersService = {
  /**
   * Fetch paginated list of users with optional filtering and sorting
   */
  getUsers: async (params?: GetUsersParams): Promise<GetUsersResponse> => {
    const response = await protectedApi.get<GetUsersResponse>('api/user', {
      params,
    })
    return response.data
  },

  /**
   * Get single user by ID
   */
  getUserById: async (id: number): Promise<GetUserResponse> => {
    const response = await protectedApi.get<GetUserResponse>(`api/user/${id}`)
    return response.data
  },

  /**
   * Delete user by ID
   */
  deleteUser: async (id: number): Promise<DeleteUserResponse> => {
    const response = await protectedApi.delete<DeleteUserResponse>(`api/user/${id}`)
    return response.data
  },
}

