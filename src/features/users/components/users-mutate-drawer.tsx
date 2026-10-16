import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parsePhoneNumber } from 'react-phone-number-input'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
import { showSubmittedData } from '@/lib/show-submitted-data'
import type { AppUser } from '../api/types'
import { useUserById } from '../api/use-users'

type UsersMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: AppUser | null
  mode?: 'create' | 'update' | 'view'
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  phoneNumber: z.string().min(6, 'Valid phone number is required.'),
  badge: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
})

type UserFormValues = z.infer<typeof formSchema>

export function UsersMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  mode,
}: UsersMutateDrawerProps) {
  const isView = mode === 'view'
  const isUpdate = mode === 'update' || (!mode && !!currentRow)

  const { data: userDetailData } = useUserById(
    currentRow?.id,
    open && !!currentRow?.id
  )
  const activeUser = userDetailData?.data || currentRow

  const defaultValues: UserFormValues = {
    name: activeUser?.name || '',
    phoneNumber: activeUser?.phoneNumber || '',
    badge: activeUser?.badge || '',
    country: activeUser?.country || '',
    state: activeUser?.state || '',
    city: activeUser?.city || '',
  }

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Synchronize form values with activeUser or reset on drawer open/close
  useEffect(() => {
    if (open) {
      if (activeUser) {
        form.reset({
          name: activeUser.name || '',
          phoneNumber: activeUser.phoneNumber || '',
          badge: activeUser.badge || '',
          country: activeUser.country || '',
          state: activeUser.state || '',
          city: activeUser.city || '',
        })
      } else {
        form.reset({
          name: '',
          phoneNumber: '',
          badge: '',
          country: '',
          state: '',
          city: '',
        })
      }
    } else {
      // Clear form immediately when drawer is closed so no stale prefilled value remains
      form.reset({
        name: '',
        phoneNumber: '',
        badge: '',
        country: '',
        state: '',
        city: '',
      })
    }
  }, [activeUser, open, form])

  const onSubmit = (data: UserFormValues) => {
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
      if (nationalPhone.startsWith('+')) {
        nationalPhone = nationalPhone.slice(1)
      }
    }

    const payload = {
      ...data,
      phoneNumber: nationalPhone,
      dialCode,
    }

    showSubmittedData(payload, isUpdate ? 'User updated successfully:' : 'User created successfully:')
    onOpenChange(false)
    form.reset()
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
            {isView ? 'View' : isUpdate ? 'Update' : 'Create'} User
            {isView && currentRow?.id && (
              <span className='text-xs font-mono font-normal text-muted-foreground rounded-md bg-muted px-2 py-0.5'>
                #{currentRow.id}
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            {isView
              ? 'View user profile details and platform activity.'
              : isUpdate
              ? 'Update the user profile and account details.'
              : 'Add a new user by providing their contact details and location.'}{' '}
            {!isView && "Click save when you're done."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='user-form'
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
                      disabled={isView}
                      placeholder='Enter user name'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      disabled={isView}
                      placeholder='Enter phone number'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Badge */}
            <FormField
              control={form.control}
              name='badge'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Badge</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isView}
                      placeholder='e.g. MONTHLY_ACTIVE'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isView}
                      placeholder='e.g. India'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State */}
            <FormField
              control={form.control}
              name='state'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isView}
                      placeholder='e.g. Maharashtra'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name='city'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isView}
                      placeholder='e.g. Mumbai'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Metadata Section in View or Update mode */}
            {(isUpdate || isView) && activeUser && (
              <div className='border-t pt-4 space-y-4'>
                <div className='rounded-lg border p-3 space-y-2 bg-muted/30 text-xs text-muted-foreground'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium text-muted-foreground'>User ID:</span>
                    <span className='font-mono font-medium text-foreground'>#{activeUser.id}</span>
                  </div>
                  {activeUser.latestAppVersion && (
                    <div className='flex justify-between items-center'>
                      <span className='font-medium text-muted-foreground'>App Version:</span>
                      <span className='font-mono font-medium text-foreground'>{activeUser.latestAppVersion}</span>
                    </div>
                  )}
                  {activeUser.lastUsedAt && (
                    <div className='flex justify-between items-center'>
                      <span className='font-medium text-muted-foreground'>Last Active:</span>
                      <span className='font-medium text-foreground'>
                        {(() => {
                          try {
                            return format(new Date(activeUser.lastUsedAt), 'MMM dd, yyyy HH:mm')
                          } catch {
                            return activeUser.lastUsedAt
                          }
                        })()}
                      </span>
                    </div>
                  )}
                  {activeUser.dialCode && (
                    <div className='flex justify-between items-center'>
                      <span className='font-medium text-muted-foreground'>Dial Code:</span>
                      <span className='font-mono text-foreground'>{activeUser.dialCode}</span>
                    </div>
                  )}
                  {activeUser.lat != null && activeUser.longitude != null && (
                    <div className='flex justify-between items-center'>
                      <span className='font-medium text-muted-foreground'>Location:</span>
                      <span className='font-mono text-foreground'>
                        {activeUser.lat}, {activeUser.longitude}
                      </span>
                    </div>
                  )}
                  {activeUser.fcmToken && (
                    <div className='flex flex-col gap-1 pt-1'>
                      <span className='font-medium text-muted-foreground'>FCM Token:</span>
                      <span className='font-mono text-[11px] truncate text-foreground bg-muted p-1 rounded'>
                        {activeUser.fcmToken}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </Form>

        <SheetFooter className='gap-2 sm:justify-end border-t'>
          <SheetClose asChild>
            <Button variant={isView ? 'default' : 'outline'}>
              {isView ? 'Close' : 'Cancel'}
            </Button>
          </SheetClose>
          {!isView && (
            <Button form='user-form' type='submit'>
              {isUpdate ? 'Save changes' : 'Create User'}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
