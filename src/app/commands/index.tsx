import { useEffect, useState } from 'react'

import ansiEscapes from 'ansi-escapes'

import { LinkingWorkspace } from '#/widgets/linking-workspace/index.js'

export const description = 'Open the file system linker'

export default function Index() {
  const [isScreenReady, setIsScreenReady] = useState(false)

  useEffect(() => {
    process.stdout.write(
      ansiEscapes.enterAlternativeScreen + ansiEscapes.clearViewport,
    )

    setIsScreenReady(true)

    return () => {
      process.stdout.write(ansiEscapes.exitAlternativeScreen)
    }
  }, [])

  if (!isScreenReady) return null

  return <LinkingWorkspace />
}
