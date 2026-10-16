import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usersService } from './users-service'
import type { DeleteUserResponse, GetUsersParams } from './types'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'

export function useAppUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.getUsers(params),
    placeholderData: (previousData) => previousData,
  })
}

export function useUserById(id?: number | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersService.getUserById(id!),
    enabled: !!id && enabled,
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation<DeleteUserResponse, Error, number>({
    mutationFn: (id: number) => usersService.deleteUser(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(data?.message || 'User deleted successfully!')
    },
    onError: (error) => {
      handleServerError(error)
    },
  })
}


