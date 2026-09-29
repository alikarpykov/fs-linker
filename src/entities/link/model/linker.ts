import fs from 'fs/promises'
import path from 'path'

import type {
  EntryState,
  ExecutableAuditResult,
  ExecutableLinkPlan,
} from './types.js'

type LinkOptions = {
  sourcePath: string
  targetPath: string
  audit: ExecutableAuditResult
}

const getEntryType = (entryState: EntryState) => {
  if (entryState === 'empty_folder' || entryState === 'folder') {
    return 'dir'
  }

  if (entryState === 'empty_file' || entryState === 'file') {
    return 'file'
  }

  throw new Error(`Cannot get an entry type from state: ${entryState}.`)
}

export const create_symlink = async ({
  sourcePath,
  targetPath,
  audit,
}: LinkOptions): Promise<ExecutableLinkPlan> => {
  switch (audit.plan) {
    case 'link_source': {
      if (audit.sourceState === 'symlink') {
        await fs.unlink(sourcePath)
      }
      if (audit.sourceState === 'missing') {
        await fs.mkdir(path.dirname(sourcePath), { recursive: true })
      }

      const targetType = getEntryType(audit.targetState)

      await fs.symlink(targetPath, sourcePath, targetType)

      return 'link_source'
    }

    case 'migrate_source_to_target': {
      if (audit.targetState === 'empty_file') {
        await fs.unlink(audit.resolvedTargetPath)
      }
      if (audit.targetState === 'empty_folder') {
        await fs.rmdir(audit.resolvedTargetPath)
      }

      const sourceType = getEntryType(audit.sourceState)

      await fs.cp(sourcePath, audit.resolvedTargetPath, {
        recursive: sourceType === 'dir',
        force: false,
        errorOnExist: true,
        verbatimSymlinks: true,
      })

      await fs.rm(sourcePath, {
        recursive: sourceType === 'dir',
        force: false,
      })

      await fs.symlink(targetPath, sourcePath, sourceType)

      return 'migrate_source_to_target'
    }
  }
}
