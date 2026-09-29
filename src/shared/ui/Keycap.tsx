import { FixedText } from '#/shared/ui/FixedText.js'

type KeycapProps = {
  keycap: string
}

export const Keycap = ({ keycap }: KeycapProps) => {
  return <FixedText text={keycap} color='#dc5757' bold />
}
