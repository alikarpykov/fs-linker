import nodePath from 'path'

import { useRef } from 'react'

import { Box, Text } from 'ink'
import { ScrollList, type ScrollListRef } from 'ink-scroll-list'

import { useRemeasureOnResize } from '#/shared/lib/useRemeasureOnResize.js'
import { FixedText } from '#/shared/ui/FixedText.js'

import type { FileSystemEntry } from '#/entities/file-system-entry/index.js'

type PanelEntriesProps = {
  type: 'source' | 'target'
  isActive: boolean
  path: string
  entries: FileSystemEntry[]
  focusedIndex: number
  selectedPaths: string[]
  visibleRows: number
}

const getEntryIcon = (entry: FileSystemEntry, isFocused: boolean) => {
  if (entry.isSymlink && entry.isBrokenSymlink) {
    return '⛓️‍💥'
  }
  if (entry.isSymlink && entry.isDirectory) {
    return `🔗 ${isFocused ? '📂' : '📁'}`
  }
  if (entry.isSymlink && entry.kind === 'entry') {
    return '🔗'
  }
  if (entry.isDirectory) return isFocused ? '📂' : '📁'
  return '📄'
}

const formatResolvedTargetPath = (resolvedTargetPath: string) => {
  const pathSegments = resolvedTargetPath.split(nodePath.sep).filter(Boolean)

  if (pathSegments.length <= 3) {
    return resolvedTargetPath
  }

  return `${nodePath.sep}…${nodePath.sep}${pathSegments.slice(-3).join(nodePath.sep)}`
}

export const PanelEntries = ({
  type,
  isActive,
  path,
  entries,
  focusedIndex,
  selectedPaths,
  visibleRows,
}: PanelEntriesProps) => {
  const listRef = useRef<ScrollListRef>(null)

  useRemeasureOnResize(listRef)

  return (
    <ScrollList
      ref={listRef}
      selectedIndex={focusedIndex}
      scrollAlignment='auto'
      height={visibleRows}
      borderColor='gray'
    >
      {entries.map((entry, index) => {
        const isEntryFocused = isActive && index === focusedIndex
        const fullPath = nodePath.join(path, entry.name)
        const isSelected = selectedPaths.includes(fullPath)
        const selectionIndicators = {
          source: isSelected ? '■' : '□',
          target: isSelected ? '●' : '○',
        }[type]
        const canOpen =
          entry.isDirectory === true ||
          (entry.isSymlink && !entry.isBrokenSymlink)

        return (
          <Box key={entry.name} columnGap={1}>
            <FixedText
              text={isEntryFocused ? '▶' : ''}
              boxProps={{ width: 1 }}
              color='#57acdc'
              bold
            />

            {entry.kind !== 'parent' && (
              <>
                <FixedText
                  text={selectionIndicators}
                  color={isSelected ? '#57acdc' : 'gray'}
                />
                <FixedText text={getEntryIcon(entry, isEntryFocused)} />
              </>
            )}

            <Text
              color={isSelected ? '#57acdc' : 'white'}
              wrap='truncate-middle'
            >
              {entry.name}
            </Text>

            {entry.isSymlink && isEntryFocused && (
              <Box columnGap={1}>
                <FixedText
                  boxProps={{ justifyContent: 'flex-end', width: 1 }}
                  text='→'
                  color='gray'
                />
                <Text color='gray' wrap='truncate-middle'>
                  {formatResolvedTargetPath(entry.resolvedTargetPath)}
                </Text>
              </Box>
            )}
            <FixedText
              boxProps={{ width: 4 }}
              text={canOpen && isEntryFocused ? '[↵]' : ''}
              color='#dc5757'
              bold
            />
          </Box>
        )
      })}
    </ScrollList>
  )
}
