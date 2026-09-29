import { Box, Text, type BoxProps, type TextProps } from 'ink'

type FixedTextProps = Omit<TextProps, 'children'> & {
  text: string
  boxProps?: Omit<BoxProps, 'children' | 'flexShrink'>
}

export const FixedText = ({ text, boxProps, ...textProps }: FixedTextProps) => {
  return (
    <Box {...boxProps} flexShrink={0}>
      <Text {...textProps}>{text}</Text>
    </Box>
  )
}
