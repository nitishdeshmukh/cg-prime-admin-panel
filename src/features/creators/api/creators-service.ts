import { protectedApi } from '@/lib/api/axios-client'
import type {
  GetCreatorsParams,
  GetCreatorsResponse,
  GetCreatorResponse,
  CreateCreatorPayload,
  CreateCreatorResponse,
  UpdateCreatorPayload,
  UpdateCreatorResponse,
} from './types'

export const creatorsService = {
  /**
   * Create creator profile
   */
  createCreator: async (
    payload: CreateCreatorPayload
  ): Promise<CreateCreatorResponse> => {
    const response = await protectedApi.post<CreateCreatorResponse>(
      'api/creator',
      payload
    )
    return response.data
  },

  /**
   * Fetch paginated creators list with optional search and filters
   */
  getCreators: async (params?: GetCreatorsParams): Promise<GetCreatorsResponse> => {
    const response = await protectedApi.get<GetCreatorsResponse>('api/creators', {
      params,
    })
    return response.data
  },

  /**
   * Get single creator by ID
   */
  getCreatorById: async (id: number): Promise<GetCreatorResponse> => {
    const response = await protectedApi.get<GetCreatorResponse>(`api/creator/${id}`)
    return response.data
  },

  /**
   * Partially update creator by ID
   */
  partiallyUpdateCreator: async (
    id: number,
    payload: UpdateCreatorPayload
  ): Promise<UpdateCreatorResponse> => {
    const response = await protectedApi.patch<UpdateCreatorResponse>(
      `api/creator/${id}`,
      payload
    )
    return response.data
  },

  /**
   * Delete creator by ID
   */
  deleteCreator: async (id: number): Promise<{ error: boolean; statusCode: number; message: string | null }> => {
    const response = await protectedApi.delete(`api/creator/${id}`)
    return response.data
  },
}
