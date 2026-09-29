import { forEachLinkEntry } from './forEachLinkEntry.js'
import { create_symlink } from './linker.js'

import type {
  AuditResult,
  ExecutableAuditResult,
  LinkEntriesProps,
} from './types.js'

const isExecutableAuditResult = (
  audit: AuditResult,
): audit is ExecutableAuditResult => {
  return audit.plan !== 'conflict'
}

export const linkEntries = async ({
  sourcePaths,
  targetSelectionPath,
}: LinkEntriesProps): Promise<void> => {
  await forEachLinkEntry({
    sourcePaths,
    targetSelectionPath,
    processEntry: async ({ sourcePath, targetPath, audit }) => {
      if (!isExecutableAuditResult(audit)) return

      await create_symlink({ sourcePath, targetPath, audit })
    },
  })
}
