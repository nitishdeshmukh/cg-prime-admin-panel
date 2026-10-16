import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import type { AppUser } from '../api/types'
import { UsersDeleteDialog } from './users-delete-dialog'

const mutateMock = vi.fn()
vi.mock('../api/use-users', () => ({
  useDeleteUser: () => ({
    mutate: mutateMock,
    isPending: false,
  }),
}))

const MOCK_USER: AppUser = {
  id: 1,
  name: 'John Doe',
  phoneNumber: '+959123456789',
  dialCode: '+91',
  fcmToken: null,
  profilePicLink: null,
  badge: 'MONTHLY_ACTIVE',
  lastUsedAt: '2026-01-01T00:00:00',
  country: 'India',
  state: 'Delhi',
  city: 'Delhi',
}

describe('UsersDeleteDialog', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the dialog with the correct title, description, input and buttons', async () => {
    const { getByText, getByRole } = await render(
      <UsersDeleteDialog open onOpenChange={vi.fn()} currentRow={MOCK_USER} />
    )

    const title = getByRole('heading', {
      level: 2,
      name: /Delete User/i,
    })
    const desc = getByText(
      new RegExp(`Are you sure you want to delete user ${MOCK_USER.name}?`, 'i')
    )
    const confirmationInput = getByRole('textbox', { name: /Confirmation/i })
    const cancelButton = getByRole('button', { name: /Cancel/i })
    const deleteButton = getByRole('button', { name: /Delete/i })

    await expect.element(title).toBeInTheDocument()
    await expect.element(desc).toBeInTheDocument()
    await expect.element(confirmationInput).toBeInTheDocument()
    await expect.element(cancelButton).toBeInTheDocument()
    await expect.element(deleteButton).toBeInTheDocument()
    await expect.element(deleteButton).toBeDisabled()
  })

  it('keeps the delete button disabled until the confirmation input is filled correctly', async () => {
    const { getByRole } = await render(
      <UsersDeleteDialog open onOpenChange={vi.fn()} currentRow={MOCK_USER} />
    )

    const confirmationInput = getByRole('textbox', { name: /Confirmation/i })
    const deleteButton = getByRole('button', { name: /Delete/i })

    await expect.element(deleteButton).toBeDisabled()

    await userEvent.fill(confirmationInput, 'wrong-keyword')
    await expect.element(deleteButton).toBeDisabled()

    await userEvent.fill(confirmationInput, MOCK_USER.phoneNumber)
    await expect.element(deleteButton).toBeEnabled()
  })

  it('closes the dialog when the cancel button is clicked', async () => {
    const onOpenChange = vi.fn()
    const { getByRole } = await render(
      <UsersDeleteDialog
        open
        onOpenChange={onOpenChange}
        currentRow={MOCK_USER}
      />
    )

    const cancelButton = getByRole('button', { name: /Cancel/i })
    await userEvent.click(cancelButton)

    expect(onOpenChange).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('resets the confirmation input when the dialog is closed and reopened', async () => {
    function Harness() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <button type='button' onClick={() => setOpen(true)}>
            Reopen
          </button>
          {open ? (
            <UsersDeleteDialog
              open={open}
              onOpenChange={setOpen}
              currentRow={MOCK_USER}
            />
          ) : null}
        </>
      )
    }

    const { getByRole } = await render(<Harness />)

    const confirmationInput = getByRole('textbox', { name: /Confirmation/i })
    const deleteButton = getByRole('button', { name: /Delete/i })

    await userEvent.fill(confirmationInput, MOCK_USER.phoneNumber)
    await expect.element(deleteButton).toBeEnabled()

    const cancelButton = getByRole('button', { name: /Cancel/i })
    await userEvent.click(cancelButton)

    const reopenButton = getByRole('button', { name: /Reopen/i })
    await userEvent.click(reopenButton)

    const reopenedInput = getByRole('textbox', { name: /Confirmation/i })
    const reopenedDeleteButton = getByRole('button', { name: /Delete/i })

    await expect.element(reopenedInput).toHaveValue('')
    await expect.element(reopenedDeleteButton).toBeDisabled()
  })

  it('calls delete mutation and closes dialog on submit', async () => {
    const onOpenChange = vi.fn()
    mutateMock.mockImplementation((_id, { onSuccess }) => onSuccess?.())
    const { getByRole } = await render(
      <UsersDeleteDialog
        open
        onOpenChange={onOpenChange}
        currentRow={MOCK_USER}
      />
    )

    const confirmationInput = getByRole('textbox', { name: /Confirmation/i })
    const deleteButton = getByRole('button', { name: /Delete/i })

    await userEvent.fill(confirmationInput, MOCK_USER.phoneNumber)
    await userEvent.click(deleteButton)

    expect(mutateMock).toHaveBeenCalledOnce()
    expect(mutateMock).toHaveBeenCalledWith(
      MOCK_USER.id,
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
