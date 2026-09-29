import { Box, Text } from 'ink'

import { Keycap } from './Keycap.js'
import { LabelValue } from './LabelValue.js'

type ListNavigationProps = {
  focusedIndex: number
  itemsCount: number
}

export const ListNavigation = ({
  focusedIndex,
  itemsCount,
}: ListNavigationProps) => {
  return (
    <Box flexShrink={0} columnGap={1}>
      <Box>
        <Keycap keycap='[↑' />
        <Text color='gray'>/</Text>
        <Keycap keycap='↓]' />
      </Box>
      <LabelValue
        label='Row'
        value={`${itemsCount > 0 ? focusedIndex + 1 : 0}/${itemsCount}`}
      />
      <Box>
        <Keycap keycap='[Home' />
        <Text color='gray'>/</Text>
        <Keycap keycap='End]' />
      </Box>
    </Box>
  )
}
