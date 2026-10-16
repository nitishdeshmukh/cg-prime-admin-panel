import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Creators } from '@/features/creators'

const creatorsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(20),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/creators/')({
  validateSearch: creatorsSearchSchema,
  component: Creators,
})
