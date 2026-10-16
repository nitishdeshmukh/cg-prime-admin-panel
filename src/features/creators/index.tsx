import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CreatorsDialogs } from './components/creators-dialogs'
import { CreatorsPrimaryButtons } from './components/creators-primary-buttons'
import { CreatorsProvider } from './components/creators-provider'
import { CreatorsTable } from './components/creators-table'

export function Creators() {
  return (
    <CreatorsProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Creators</h2>
            <p className='text-muted-foreground text-sm'>
              View and manage all registered content creators in the system.
            </p>
          </div>
          <CreatorsPrimaryButtons />
        </div>

        <CreatorsTable />
      </Main>

      <CreatorsDialogs />
    </CreatorsProvider>
  )
}
