import { useEffect, useState } from 'react'

import { getLinkPlanEntries } from '#/entities/link/index.js'

import type { LinkPlanEntry } from '#/entities/link/index.js'

type UseLinkPlanProps = {
  sourcePaths: string[]
  targetSelectionPath: string | undefined
}

export const useLinkPlan = ({
  sourcePaths,
  targetSelectionPath,
}: UseLinkPlanProps) => {
  const [linkPlanEntries, setLinkPlanEntries] = useState<LinkPlanEntry[]>([])

  useEffect(() => {
    let isCurrent = true

    setLinkPlanEntries([])

    if (sourcePaths.length === 0 || !targetSelectionPath) {
      return
    }

    const loadLinkPlan = async () => {
      try {
        const entries = await getLinkPlanEntries({
          sourcePaths,
          targetSelectionPath,
        })

        if (isCurrent) {
          setLinkPlanEntries(entries)
        }
      } catch {
        if (isCurrent) {
          setLinkPlanEntries([])
        }
      }
    }

    void loadLinkPlan()

    return () => {
      isCurrent = false
    }
  }, [sourcePaths, targetSelectionPath])

  const resetLinkPlan = () => {
    setLinkPlanEntries([])
  }

  return {
    linkPlanEntries,
    resetLinkPlan,
  }
}
