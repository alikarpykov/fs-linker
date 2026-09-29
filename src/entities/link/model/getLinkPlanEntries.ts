import { forEachLinkEntry } from './forEachLinkEntry.js'

import type { LinkEntriesProps, LinkPlanEntry } from './types.js'

export const getLinkPlanEntries = async ({
  sourcePaths,
  targetSelectionPath,
}: LinkEntriesProps): Promise<LinkPlanEntry[]> => {
  const linkPlanEntries: LinkPlanEntry[] = []

  await forEachLinkEntry({
    sourcePaths,
    targetSelectionPath,
    processEntry: ({ sourcePath, targetPath, audit }) => {
      linkPlanEntries.push({ sourcePath, targetPath, plan: audit.plan })
    },
  })

  return linkPlanEntries
}
