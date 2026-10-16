import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCreatorsContext } from './creators-provider'
import {
  Calendar,
  CheckCircle2,
  Copy,
  ExternalLink,
  Phone,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { YoutubeIcon, InstagramIcon } from './social-icons'
import { toast } from 'sonner'
import { format } from 'date-fns'

export function CreatorViewDrawer() {
  const { open, setOpen, currentRow } = useCreatorsContext()

  if (!currentRow) return null

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const initials = currentRow.name
    ? currentRow.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'CR'

  const formattedCreatedAt = currentRow.createdAt
    ? format(new Date(currentRow.createdAt), 'PPpp')
    : 'N/A'

  const formattedUpdatedAt = currentRow.updatedAt
    ? format(new Date(currentRow.updatedAt), 'PPpp')
    : 'N/A'

  return (
    <Sheet
      open={open === 'view'}
      onOpenChange={(v) => {
        if (!v) setOpen(null)
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle className='flex items-center gap-2 text-xl'>
            <Sparkles className='h-5 w-5 text-primary' />
            Creator Details
          </SheetTitle>
          <SheetDescription>
            Detailed profile and status information for creator #{currentRow.id}.
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 space-y-6 overflow-y-auto px-1 py-4'>
          {/* Header Card with Avatar */}
          <div className='flex items-center gap-4 rounded-xl border bg-muted/30 p-4 shadow-xs'>
            <Avatar className='h-16 w-16 border-2 border-primary/20 shadow-xs'>
              <AvatarImage
                src={currentRow.profileImage || undefined}
                alt={currentRow.name || 'Creator'}
              />
              <AvatarFallback className='text-lg font-semibold bg-primary/10 text-primary'>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 space-y-1 min-w-0'>
              <div className='flex items-center justify-between gap-2'>
                <h3 className='font-semibold text-lg truncate'>
                  {currentRow.name || 'Unnamed Creator'}
                </h3>
                <span className='text-xs text-muted-foreground font-mono shrink-0 rounded-md bg-muted px-2 py-0.5'>
                  #{currentRow.id}
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Phone className='h-3.5 w-3.5 shrink-0' />
                <span className='font-mono text-xs'>{currentRow.phoneNumber}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6 ml-auto'
                  onClick={() => handleCopy(currentRow.phoneNumber, 'Phone number')}
                  title='Copy phone number'
                >
                  <Copy className='h-3 w-3' />
                </Button>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-1.5 rounded-lg border bg-card p-3 shadow-2xs'>
              <span className='text-xs font-medium text-muted-foreground'>
                Account Status
              </span>
              <div>
                {currentRow.enabled ? (
                  <Badge
                    variant='outline'
                    className='bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 gap-1'
                  >
                    <CheckCircle2 className='h-3 w-3' /> Active
                  </Badge>
                ) : (
                  <Badge
                    variant='outline'
                    className='bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 gap-1'
                  >
                    <XCircle className='h-3 w-3' /> Disabled
                  </Badge>
                )}
              </div>
            </div>

            <div className='flex flex-col gap-1.5 rounded-lg border bg-card p-3 shadow-2xs'>
              <span className='text-xs font-medium text-muted-foreground'>
                Onboarding
              </span>
              <div>
                {currentRow.onboardingCompleted ? (
                  <Badge
                    variant='outline'
                    className='bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 gap-1'
                  >
                    <CheckCircle2 className='h-3 w-3' /> Completed
                  </Badge>
                ) : (
                  <Badge
                    variant='outline'
                    className='bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 gap-1'
                  >
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-muted-foreground'>Bio</label>
            <div className='rounded-lg border bg-muted/20 p-3 text-sm'>
              {currentRow.bio ? (
                <p className='whitespace-pre-wrap leading-relaxed'>{currentRow.bio}</p>
              ) : (
                <span className='italic text-muted-foreground'>No bio provided yet.</span>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className='space-y-2'>
            <label className='text-xs font-medium text-muted-foreground'>
              Social Media Accounts
            </label>
            <div className='flex flex-col gap-2'>
              {currentRow.youtubeLink ? (
                <a
                  href={currentRow.youtubeLink}
                  target='_blank'
                  rel='noreferrer'
                  className='flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors text-sm group'
                >
                  <div className='flex items-center gap-2.5 min-w-0'>
                    <div className='h-8 w-8 rounded-md bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 shrink-0'>
                      <YoutubeIcon className='h-4.5 w-4.5' />
                    </div>
                    <div className='flex flex-col min-w-0'>
                      <span className='text-xs font-medium text-muted-foreground'>
                        YouTube Channel
                      </span>
                      <span className='truncate text-xs font-mono text-foreground group-hover:underline'>
                        {currentRow.youtubeLink}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className='h-3.5 w-3.5 text-muted-foreground shrink-0' />
                </a>
              ) : (
                <div className='flex items-center gap-2.5 rounded-lg border border-dashed p-3 text-xs text-muted-foreground'>
                  <div className='h-8 w-8 rounded-md bg-muted/40 flex items-center justify-center text-muted-foreground/60 shrink-0'>
                    <YoutubeIcon className='h-4.5 w-4.5' />
                  </div>
                  <span>No YouTube link connected</span>
                </div>
              )}

              {currentRow.instagramLink ? (
                <a
                  href={currentRow.instagramLink}
                  target='_blank'
                  rel='noreferrer'
                  className='flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors text-sm group'
                >
                  <div className='flex items-center gap-2.5 min-w-0'>
                    <div className='h-8 w-8 rounded-md bg-pink-50 dark:bg-pink-950/40 flex items-center justify-center text-pink-600 shrink-0'>
                      <InstagramIcon className='h-4.5 w-4.5' />
                    </div>
                    <div className='flex flex-col min-w-0'>
                      <span className='text-xs font-medium text-muted-foreground'>
                        Instagram Profile
                      </span>
                      <span className='truncate text-xs font-mono text-foreground group-hover:underline'>
                        {currentRow.instagramLink}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className='h-3.5 w-3.5 text-muted-foreground shrink-0' />
                </a>
              ) : (
                <div className='flex items-center gap-2.5 rounded-lg border border-dashed p-3 text-xs text-muted-foreground'>
                  <div className='h-8 w-8 rounded-md bg-muted/40 flex items-center justify-center text-muted-foreground/60 shrink-0'>
                    <InstagramIcon className='h-4.5 w-4.5' />
                  </div>
                  <span>No Instagram link connected</span>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className='space-y-2 rounded-lg border bg-muted/10 p-3 text-xs text-muted-foreground'>
            <div className='flex items-center justify-between'>
              <span className='flex items-center gap-1.5'>
                <Calendar className='h-3.5 w-3.5' /> Created At
              </span>
              <span className='font-mono'>{formattedCreatedAt}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='flex items-center gap-1.5'>
                <Calendar className='h-3.5 w-3.5' /> Last Updated
              </span>
              <span className='font-mono'>{formattedUpdatedAt}</span>
            </div>
          </div>
        </div>

        <SheetFooter className='gap-2 sm:justify-between border-t pt-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleCopy(String(currentRow.id), 'Creator ID')}
            className='gap-1.5 text-xs'
          >
            <Copy className='h-3.5 w-3.5' /> Copy Creator ID
          </Button>

          <SheetClose asChild>
            <Button variant='default' size='sm'>
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
