import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { creatorsService } from './creators-service'
import type {
  GetCreatorsParams,
  CreateCreatorPayload,
  CreateCreatorResponse,
  UpdateCreatorPayload,
  UpdateCreatorResponse,
} from './types'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'

export function useCreators(params: GetCreatorsParams) {
  return useQuery({
    queryKey: ['creators', params],
    queryFn: () => creatorsService.getCreators(params),
    placeholderData: (previousData) => previousData,
  })
}

export function useCreatorById(id?: number | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['creator', id],
    queryFn: () => creatorsService.getCreatorById(id!),
    enabled: !!id && enabled,
  })
}

export function useCreateCreator() {
  const queryClient = useQueryClient()

  return useMutation<CreateCreatorResponse, Error, CreateCreatorPayload>({
    mutationFn: (payload) => creatorsService.createCreator(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['creators'] })
      toast.success(data?.message || 'Creator created successfully!')
    },
    onError: (error) => {
      handleServerError(error)
    },
  })
}

export function usePartiallyUpdateCreator() {
  const queryClient = useQueryClient()

  return useMutation<
    UpdateCreatorResponse,
    Error,
    { id: number; payload: UpdateCreatorPayload }
  >({
    mutationFn: ({ id, payload }) =>
      creatorsService.partiallyUpdateCreator(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['creators'] })
      queryClient.invalidateQueries({ queryKey: ['creator', variables.id] })
      toast.success(data?.message || 'Creator updated successfully!')
    },
    onError: (error) => {
      handleServerError(error)
    },
  })
}

export function useDeleteCreator() {
  const queryClient = useQueryClient()

  return useMutation<
    { error: boolean; statusCode: number; message: string | null },
    Error,
    number
  >({
    mutationFn: (id: number) => creatorsService.deleteCreator(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['creators'] })
      toast.success(data?.message || 'Creator deleted successfully!')
    },
    onError: (error) => {
      handleServerError(error)
    },
  })
}
