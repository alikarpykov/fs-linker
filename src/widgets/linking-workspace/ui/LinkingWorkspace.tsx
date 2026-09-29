import { Box, Text, useWindowSize } from 'ink'
import Gradient from 'ink-gradient'
import Link from 'ink-link'

import { Keycap } from '#/shared/ui/Keycap.js'

import { useLinkingKeyboard } from '../model/useLinkingKeyboard.js'
import { useLinkingWorkspace } from '../model/useLinkingWorkspace.js'
import { LinkPlan } from './LinkPlan.js'
import { Panel } from './Panel.js'

import type { usePanel } from '../model/usePanel.js'

const ROWS_OUTSIDE_PANELS = 4
const ROWS_OUTSIDE_ENTRIES = 7
const LINK_PLAN_VISIBLE_ROWS = 11
const LINK_PLAN_ROWS = LINK_PLAN_VISIBLE_ROWS + 7
const RESERVED_ROWS =
  ROWS_OUTSIDE_PANELS + ROWS_OUTSIDE_ENTRIES + LINK_PLAN_ROWS
const MIN_TERMINAL_COLUMNS = 110
const MIN_TERMINAL_ROWS = 40

type PanelStateForView = ReturnType<typeof usePanel>

const getPanelProps = (panel: PanelStateForView) => ({
  path: panel.path,
  entries: panel.entries,
  focusedIndex: panel.focusedIndex,
  selectedPaths: panel.selectedPaths,
})

type HotkeyPart = string | { id: string; keycap: string }

type HotkeyHelp = {
  id: string
  parts: HotkeyPart[]
}

const hotkeyHelp: HotkeyHelp[] = [
  {
    id: 'quit',
    parts: [{ id: 'quit', keycap: 'q' }, 'uit'],
  },
]

export const LinkingWorkspace = () => {
  const { columns, rows } = useWindowSize()
  const {
    source,
    target,
    moveFocus,
    focusBoundary,
    toggleFocusedEntry,
    openFocusedEntry,
    onLink,
    onDelete,
    linkPlanEntries,
    linkPlanFocusedIndex,
  } = useLinkingWorkspace()

  const isWidthSupported = columns >= MIN_TERMINAL_COLUMNS
  const isHeightSupported = rows >= MIN_TERMINAL_ROWS
  const isControlsEnabled = isWidthSupported && isHeightSupported

  useLinkingKeyboard({
    moveFocus,
    focusBoundary,
    toggleFocusedEntry,
    isControlsEnabled,
    openFocusedEntry,
    onLink,
    onDelete,
  })

  if (!isWidthSupported) {
    return (
      <Text>
        Increase the terminal width to at least {MIN_TERMINAL_COLUMNS} columns.
      </Text>
    )
  }
  if (!isHeightSupported) {
    return (
      <Text>
        Increase the terminal height to at least {MIN_TERMINAL_ROWS} rows.
      </Text>
    )
  }

  const visibleRows = rows - RESERVED_ROWS

  return (
    <Box flexDirection='column' alignItems='center' height={rows} padding={1}>
      <Box columnGap={1} marginBottom={1} paddingX={1}>
        <Link url='https://github.com/hireddev/fs-linker' fallback={false}>
          <Text bold>
            <Gradient colors={['#57acdc', '#dc5757']}>FS-Linker</Gradient>
          </Text>
        </Link>
        <Text color='gray'>v1.0.0</Text>
      </Box>

      <Box columnGap={1}>
        <Keycap keycap='[Tab]' />
        <Text color='gray'>Switch section</Text>
      </Box>

      <Box columnGap={1} width='100%'>
        <Panel
          type='source'
          {...getPanelProps(source)}
          visibleRows={visibleRows}
        />
        <Panel
          type='target'
          {...getPanelProps(target)}
          visibleRows={visibleRows}
        />
      </Box>

      <LinkPlan
        entries={linkPlanEntries}
        focusedIndex={linkPlanFocusedIndex}
        visibleRows={LINK_PLAN_VISIBLE_ROWS}
        height={LINK_PLAN_ROWS}
      />

      <Box alignSelf='flex-start' flexShrink={0} columnGap={1} paddingX={1}>
        {hotkeyHelp.map((hotkey) => (
          <Box key={hotkey.id}>
            {hotkey.parts.map((part) =>
              typeof part === 'string' ? (
                <Text key={`${hotkey.id}-${part}`} color='gray'>
                  {part}
                </Text>
              ) : (
                <Keycap key={part.id} keycap={part.keycap} />
              ),
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
