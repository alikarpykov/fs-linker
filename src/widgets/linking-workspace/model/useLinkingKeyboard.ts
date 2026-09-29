import { useApp, useInput } from 'ink'

type UseLinkingKeyboardProps = {
  moveFocus: (direction: 'up' | 'down') => void
  focusBoundary: (boundary: 'first' | 'last') => void
  toggleFocusedEntry: () => void
  isControlsEnabled: boolean
  openFocusedEntry: () => void
  onLink: () => Promise<void>
  onDelete: () => Promise<void>
}

export const useLinkingKeyboard = ({
  moveFocus,
  focusBoundary,
  toggleFocusedEntry,
  isControlsEnabled,
  openFocusedEntry,
  onLink,
  onDelete,
}: UseLinkingKeyboardProps) => {
  const { exit } = useApp()

  useInput((input, key) => {
    if (input === 'q') exit(0)
    if (!isControlsEnabled) return

    if (key.upArrow) moveFocus('up')
    if (key.downArrow) moveFocus('down')
    if (key.home) focusBoundary('first')
    if (key.end) focusBoundary('last')
    if (key.return) openFocusedEntry()
    if (input === ' ') toggleFocusedEntry()
    if (input === 'l') void onLink()
    if (input === 'd') void onDelete()
  })
}
