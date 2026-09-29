import { useRef } from 'react'

import { Box, Text, useFocus } from 'ink'
import { ScrollList, type ScrollListRef } from 'ink-scroll-list'

import { useRemeasureOnResize } from '#/shared/lib/useRemeasureOnResize.js'
import { FixedText } from '#/shared/ui/FixedText.js'
import { Keycap } from '#/shared/ui/Keycap.js'
import { ListNavigation } from '#/shared/ui/ListNavigation.js'

import type { LinkPlanEntry } from '#/entities/link/index.js'

type LinkPlanRow = {
  id: string
  sourcePath: string
  targetPath: string
  action: string
}

type LinkPlanSummary = {
  selected: number
  ready: number
  conflicts: number
}

type LinkPlanViewProps = {
  rows: LinkPlanRow[]
  summary: LinkPlanSummary
  isActive: boolean
  focusedIndex: number
  visibleRows: number
  height: number
}

const FOCUS_COLUMN_WIDTH = 1
const RESULT_COLUMN_WIDTH = 12
const linkPlanActions = [
  { keycap: '[SPC]', label: 'Select' },
  { keycap: '[l]', label: 'Link' },
  { keycap: '[d]', label: 'Unlink selected symlinks' },
]

const LinkPlanView = ({
  rows,
  summary,
  isActive,
  focusedIndex,
  visibleRows,
  height,
}: LinkPlanViewProps) => {
  const listRef = useRef<ScrollListRef>(null)

  useRemeasureOnResize(listRef)

  return (
    <Box
      flexDirection='column'
      width='100%'
      height={height}
      padding={1}
      borderStyle='round'
      borderColor={isActive ? '#57acdc' : 'gray'}
    >
      <Box justifyContent='center'>
        <Box marginTop={-2}>
          <Text color={isActive ? '#57acdc' : 'white'} bold>
            {' Link Plan '}
          </Text>
        </Box>
      </Box>

      {rows.length === 0 ? (
        <Box
          justifyContent='center'
          alignItems='center'
          flexGrow={1}
          flexShrink={0}
          columnGap={1}
        >
          {linkPlanActions.map(({ keycap, label }, index) => (
            <Box key={keycap} columnGap={1}>
              {index > 0 && <Text color='gray'>·</Text>}
              <Keycap keycap={keycap} />
              <Text>{label}</Text>
            </Box>
          ))}
        </Box>
      ) : (
        <Box flexDirection='column' rowGap={1}>
          <Box columnGap={1}>
            {Object.entries(summary).map(([label, value], index) => (
              <Box key={label} columnGap={1}>
                {index > 0 && <Text color='gray'>·</Text>}
                <Text color='#57acdc'>{value}</Text>
                <Text>{label}</Text>
              </Box>
            ))}
          </Box>

          <Box columnGap={1}>
            <Box width={FOCUS_COLUMN_WIDTH} flexShrink={0} />
            <Box flexBasis={0} flexGrow={1}>
              <Text color='#57acdc' bold>
                Source
              </Text>
            </Box>
            <Box flexBasis={0} flexGrow={1}>
              <Text color='#57acdc' bold>
                Target
              </Text>
            </Box>
            <Box width={RESULT_COLUMN_WIDTH} flexShrink={0}>
              <Text color='#57acdc' bold>
                Result
              </Text>
            </Box>
          </Box>

          <ScrollList
            ref={listRef}
            selectedIndex={focusedIndex}
            scrollAlignment='auto'
            height={visibleRows}
          >
            {rows.map((row, index) => (
              <Box key={row.id} columnGap={1}>
                <FixedText
                  text={isActive && index === focusedIndex ? '▶' : ''}
                  boxProps={{ width: FOCUS_COLUMN_WIDTH }}
                  color='#57acdc'
                  bold
                />
                <Box flexBasis={0} flexGrow={1}>
                  <Text wrap='truncate-middle'>{row.sourcePath}</Text>
                </Box>
                <Box flexBasis={0} flexGrow={1}>
                  <Text wrap='truncate-middle'>{row.targetPath}</Text>
                </Box>
                <Box width={RESULT_COLUMN_WIDTH} flexShrink={0}>
                  <Text>{row.action}</Text>
                </Box>
              </Box>
            ))}
          </ScrollList>
          <ListNavigation
            focusedIndex={focusedIndex}
            itemsCount={rows.length}
          />
        </Box>
      )}
    </Box>
  )
}

type LinkPlanProps = {
  entries: LinkPlanEntry[]
  focusedIndex: number
  visibleRows: number
  height: number
}

const planPriority: Record<LinkPlanEntry['plan'], number> = {
  conflict: 0,
  migrate_source_to_target: 1,
  link_source: 2,
}

const actionLabels: Record<LinkPlanEntry['plan'], string> = {
  conflict: '❌ Conflict',
  migrate_source_to_target: '✅ Migrate',
  link_source: '✅ Link',
}

export const LinkPlan = ({
  entries,
  focusedIndex,
  visibleRows,
  height,
}: LinkPlanProps) => {
  const { isFocused } = useFocus({
    id: 'linkPlan',
    isActive: entries.length > 0,
  })
  const conflictsCount = entries.filter(
    ({ plan }) => plan === 'conflict',
  ).length
  const readyCount = entries.length - conflictsCount
  const rows: LinkPlanRow[] = [...entries]
    .sort(
      (first, second) => planPriority[first.plan] - planPriority[second.plan],
    )
    .map(({ sourcePath, targetPath, plan }) => ({
      id: `${sourcePath}:${targetPath}`,
      sourcePath,
      targetPath,
      action: actionLabels[plan],
    }))

  const summary: LinkPlanSummary = {
    selected: entries.length,
    ready: readyCount,
    conflicts: conflictsCount,
  }

  return (
    <LinkPlanView
      rows={rows}
      summary={summary}
      isActive={isFocused}
      focusedIndex={focusedIndex}
      visibleRows={visibleRows}
      height={height}
    />
  )
}
