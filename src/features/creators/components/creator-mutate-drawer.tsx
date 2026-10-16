import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parsePhoneNumber } from 'react-phone-number-input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { PhoneInput } from '@/components/phone-input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Loader2 } from 'lucide-react'
import type { Creator } from '../api/types'
import {
  useCreatorById,
  useCreateCreator,
  usePartiallyUpdateCreator,
} from '../api/use-creators'

type CreatorMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Creator | null
  mode?: 'create' | 'update' | 'view'
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.email('Valid email is required.').or(z.literal('')),
  phoneNumber: z.string().min(8, 'Valid phone number is required.'),
  bio: z.string(),
  youtubeLink: z.string(),
  instagramLink: z.string(),
  enabled: z.boolean(),
  onboardingCompleted: z.boolean(),
})

type CreatorFormValues = z.infer<typeof formSchema>

export function CreatorMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  mode,
}: CreatorMutateDrawerProps) {
  const isView = mode === 'view'
  const isUpdate = mode === 'update' || (!mode && !!currentRow)

  // 1. Fetch single creator by ID when in update or view mode
  const { data: creatorDetailData } = useCreatorById(
    currentRow?.id,
    open && (isUpdate || isView)
  )

  // 2. Mutations
  const createMutation = useCreateCreator()
  const updateMutation = usePartiallyUpdateCreator()
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const defaultValues: CreatorFormValues = {
    name: currentRow?.name || '',
    email: '',
    phoneNumber: currentRow?.phoneNumber || '',
    bio: currentRow?.bio || '',
    youtubeLink: currentRow?.youtubeLink || '',
    instagramLink: currentRow?.instagramLink || '',
    enabled: currentRow?.enabled ?? true,
    onboardingCompleted: currentRow?.onboardingCompleted ?? false,
  }

  const form = useForm<CreatorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Synchronize form values with currentRow or freshly fetched creator details
  useEffect(() => {
    if (open) {
      const activeCreator = creatorDetailData?.data || currentRow
      if (activeCreator) {
        form.reset({
          name: activeCreator.name || '',
          email: '',
          phoneNumber: activeCreator.phoneNumber || '',
          bio: activeCreator.bio || '',
          youtubeLink: activeCreator.youtubeLink || '',
          instagramLink: activeCreator.instagramLink || '',
          enabled: activeCreator.enabled ?? true,
          onboardingCompleted: activeCreator.onboardingCompleted ?? false,
        })
      } else {
        form.reset({
          name: '',
          email: '',
          phoneNumber: '',
          bio: '',
          youtubeLink: '',
          instagramLink: '',
          enabled: true,
          onboardingCompleted: false,
        })
      }
    } else {
      // Clear form immediately when drawer is closed so no stale prefilled value remains
      form.reset({
        name: '',
        email: '',
        phoneNumber: '',
        bio: '',
        youtubeLink: '',
        instagramLink: '',
        enabled: true,
        onboardingCompleted: false,
      })
    }
  }, [currentRow, creatorDetailData, open, form])

  const onSubmit = (data: CreatorFormValues) => {
    if (isUpdate && currentRow?.id) {
      updateMutation.mutate(
        {
          id: currentRow.id,
          payload: {
            name: data.name,
            bio: data.bio || '',
            youtubeLink: data.youtubeLink || '',
            instagramLink: data.instagramLink || '',
            enabled: data.enabled,
            onboardingCompleted: data.onboardingCompleted,
          },
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    } else {
      // Create mode - POST /api/creator
      let nationalPhone = data.phoneNumber
      let dialCode = '91'

      try {
        const parsed = parsePhoneNumber(data.phoneNumber)
        if (parsed?.nationalNumber) {
          nationalPhone = parsed.nationalNumber
        }
        if (parsed?.countryCallingCode) {
          dialCode = parsed.countryCallingCode
        }
      } catch {
        // Fallback if parsing didn't match standard format
        if (nationalPhone.startsWith('+')) {
          nationalPhone = nationalPhone.slice(1)
        }
      }

      createMutation.mutate(
        {
          name: data.name.trim(),
          phoneNumber: nationalPhone,
          dialCode: dialCode,
          email: data.email?.trim() || '',
          bio: data.bio?.trim() || undefined,
          youtubeLink: data.youtubeLink?.trim() || undefined,
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle className='flex items-center gap-2'>
            {isView ? 'View' : isUpdate ? 'Update' : 'Create'} Creator
            {isView && currentRow?.id && (
              <span className='text-xs font-mono font-normal text-muted-foreground rounded-md bg-muted px-2 py-0.5'>
                #{currentRow.id}
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            {isView
              ? 'View creator profile details and platform access status.'
              : isUpdate
              ? 'Update the creator profile and platform access settings.'
              : 'Add a new creator by providing their details and social links.'}{' '}
            {!isView && "Click save when you're done."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='creator-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4 pb-6'
          >
            {/* Full Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name {!isView && <span className='text-destructive'>*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isView || isSubmitting}
                      placeholder='Enter creator name'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email (Shown in Create mode) */}
            {!isUpdate && !isView && (
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email Address <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='email'
                        placeholder='creator@example.com'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Phone Number using PhoneInput */}
            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number {!isView && <span className='text-destructive'>*</span>}
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      disabled={isUpdate || isView || isSubmitting}
                      placeholder='Enter phone number'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isView || isSubmitting}
                      placeholder='Brief summary about the creator...'
                      className='resize-none h-20'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* YouTube Link */}
            <FormField
              control={form.control}
              name='youtubeLink'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube Channel Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isView || isSubmitting}
                      placeholder='https://youtube.com/@channel'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Instagram Link */}
            <FormField
              control={form.control}
              name='instagramLink'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isView || isSubmitting}
                      placeholder='https://instagram.com/handle'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(isUpdate || isView) && (
              <div className='border-t pt-4 space-y-4'>
                {/* Account Status Switch */}
                <FormField
                  control={form.control}
                  name='enabled'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-2xs'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-sm font-medium'>
                          Account Active
                        </FormLabel>
                        <FormDescription className='text-xs'>
                          Enable or disable creator access to the platform.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isView || isSubmitting}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Onboarding Completed Switch */}
                <FormField
                  control={form.control}
                  name='onboardingCompleted'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-2xs'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-sm font-medium'>
                          Onboarding Completed
                        </FormLabel>
                        <FormDescription className='text-xs'>
                          Mark whether onboarding steps have been finished.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isView || isSubmitting}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </form>
        </Form>

        <SheetFooter className='gap-2 sm:justify-end border-t'>
          <SheetClose asChild>
            <Button variant={isView ? 'default' : 'outline'} disabled={isSubmitting}>
              {isView ? 'Close' : 'Cancel'}
            </Button>
          </SheetClose>
          {!isView && (
            <Button
              form='creator-form'
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              {isUpdate ? 'Save changes' : 'Create Creator'}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
