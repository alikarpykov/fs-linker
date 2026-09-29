import { Box, Text, type TextProps } from 'ink'

import { FixedText } from '#/shared/ui/FixedText.js'

type LabelValueProps = TextProps & {
  label: string
  value: string | number
}

export const LabelValue = ({ label, value, ...textProps }: LabelValueProps) => {
  return (
    <Box columnGap={1}>
      <FixedText text={`${label}:`} />
      <Text color='#57acdc' {...textProps}>
        {value}
      </Text>
    </Box>
  )
}
