import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import type { AppUser } from '../api/types'
import { UsersActionDialog } from './users-action-dialog'

const MOCK_USER: AppUser = {
  id: 1,
  name: 'Alex Smith',
  phoneNumber: '+19999999999',
  dialCode: '+1',
  badge: 'MONTHLY_ACTIVE',
  fcmToken: null,
  profilePicLink: null,
  lastUsedAt: '2026-01-01T00:00:00',
  country: 'United States',
  state: 'California',
  city: 'San Francisco',
}

vi.mock('@/lib/show-submitted-data', () => ({ showSubmittedData: vi.fn() }))

describe('UsersActionDialog', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('add user', () => {
    it('renders title and description', async () => {
      const { getByRole, getByText } = await render(
        <UsersActionDialog open onOpenChange={vi.fn()} />
      )

      const title = getByRole('heading', {
        level: 2,
        name: /Add New User/i,
      })
      const description = getByText(
        /Create new user here. Click save when you're done./i
      )

      await expect.element(title).toBeInTheDocument()
      await expect.element(description).toBeInTheDocument()
    })

    it('shows validation messages when the form is submitted with empty required fields', async () => {
      const { getByRole, getByText } = await render(
        <UsersActionDialog open onOpenChange={vi.fn()} />
      )

      const submitButton = getByRole('button', { name: /Save Changes/i })
      await userEvent.click(submitButton)

      await expect
        .element(getByText('Name is required.'))
        .toBeInTheDocument()
      await expect
        .element(getByText('Phone number is required.'))
        .toBeInTheDocument()
    })
  })

  describe('edit user', () => {
    it('renders title and description for editing', async () => {
      const { getByRole, getByText } = await render(
        <UsersActionDialog open onOpenChange={vi.fn()} currentRow={MOCK_USER} />
      )

      const title = getByRole('heading', {
        level: 2,
        name: /Edit User/i,
      })
      const description = getByText(
        /Update user details here. Click save when you're done./i
      )

      await expect.element(title).toBeInTheDocument()
      await expect.element(description).toBeInTheDocument()
    })

    it('pre-fills fields with currentRow data', async () => {
      const { getByPlaceholder } = await render(
        <UsersActionDialog open onOpenChange={vi.fn()} currentRow={MOCK_USER} />
      )

      const nameInput = getByPlaceholder('e.g. John Doe')
      const phoneInput = getByPlaceholder('e.g. +919876543210')

      await expect.element(nameInput).toHaveValue(MOCK_USER.name!)
      await expect.element(phoneInput).toHaveValue(MOCK_USER.phoneNumber)
    })
  })
})
