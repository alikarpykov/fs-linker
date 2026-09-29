import fs from 'fs/promises'
import path from 'path'

import { check_conflict } from './audit.js'

import type {
  AuditResult,
  LinkEntriesProps,
  TargetSelectionType,
} from './types.js'

type AuditedLinkEntry = {
  sourcePath: string
  targetPath: string
  audit: AuditResult
}

type ForEachLinkEntryProps = LinkEntriesProps & {
  processEntry: (entry: AuditedLinkEntry) => void | Promise<void>
}

export const forEachLinkEntry = async ({
  sourcePaths,
  targetSelectionPath,
  processEntry,
}: ForEachLinkEntryProps): Promise<void> => {
  const targetSelectionStats = await fs.stat(targetSelectionPath)
  const targetSelectionType: TargetSelectionType =
    targetSelectionStats.isDirectory() ? 'directory' : 'file'

  for (const sourcePath of sourcePaths) {
    const targetPath =
      targetSelectionType === 'directory'
        ? path.join(targetSelectionPath, path.basename(sourcePath))
        : targetSelectionPath
    const audit = await check_conflict({
      sourcePath,
      targetPath,
      targetSelectionType,
    })

    await processEntry({ sourcePath, targetPath, audit })
  }
}
