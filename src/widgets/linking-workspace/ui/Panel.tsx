import { Box, Text, useFocus } from 'ink'

import { LabelValue } from '#/shared/ui/LabelValue.js'
import { ListNavigation } from '#/shared/ui/ListNavigation.js'

import { PanelEntries } from './PanelEntries.js'

import type { FileSystemEntry } from '#/entities/file-system-entry/index.js'

type PanelProps = {
  type: 'source' | 'target'
  path: string
  entries: FileSystemEntry[]
  focusedIndex: number
  selectedPaths: string[]
  visibleRows: number
}

export const Panel = ({
  type,
  path,
  entries,
  focusedIndex,
  selectedPaths,
  visibleRows,
}: PanelProps) => {
  const { isFocused } = useFocus({
    id: type,
    autoFocus: type === 'source',
  })
  const title = type === 'source' ? 'Source' : 'Target'

  return (
    <Box
      flexDirection='column'
      width='50%'
      padding={1}
      borderStyle='round'
      borderColor={isFocused ? '#57acdc' : 'gray'}
    >
      <Box justifyContent='center'>
        <Box marginTop={-2}>
          <Text color={isFocused ? '#57acdc' : 'white'} bold>
            {' ' + title + ' '}
          </Text>
        </Box>
      </Box>

      <Box flexDirection='column' rowGap={1}>
        <LabelValue label='Path' value={path} wrap='truncate-middle' />

        <PanelEntries
          type={type}
          isActive={isFocused}
          path={path}
          entries={entries}
          focusedIndex={focusedIndex}
          selectedPaths={selectedPaths}
          visibleRows={visibleRows}
        />

        <ListNavigation
          focusedIndex={focusedIndex}
          itemsCount={entries.length}
        />
      </Box>
    </Box>
  )
}
