import fs from 'fs/promises'
import path from 'path'

import { isErrorWithCode } from '#/shared/lib/isErrorWithCode.js'

import type {
  AuditResult,
  EntryState,
  LinkPlan,
  TargetSelectionType,
} from './types.js'

const inspectEntry = async (entryPath: string): Promise<EntryState> => {
  try {
    const stats = await fs.lstat(entryPath)

    if (stats.isSymbolicLink()) {
      return 'symlink'
    }

    if (stats.isFile()) {
      return stats.size === 0 ? 'empty_file' : 'file'
    }

    if (stats.isDirectory()) {
      const directory = await fs.opendir(entryPath, { bufferSize: 1 })

      try {
        return (await directory.read()) === null ? 'empty_folder' : 'folder'
      } finally {
        await directory.close()
      }
    }

    return 'unsupported'
  } catch (error: unknown) {
    if (isErrorWithCode(error, 'ENOENT')) {
      return 'missing'
    }

    return 'unavailable'
  }
}

type TargetInspection = {
  targetState: EntryState
  resolvedTargetPath: string
}

const inspectTarget = async (targetPath: string): Promise<TargetInspection> => {
  const targetState = await inspectEntry(targetPath)

  if (targetState !== 'symlink') {
    return {
      targetState,
      resolvedTargetPath: targetPath,
    }
  }

  try {
    const resolvedTargetPath = await fs.realpath(targetPath)

    return {
      targetState: await inspectEntry(resolvedTargetPath),
      resolvedTargetPath,
    }
  } catch {
    return {
      targetState: 'unavailable',
      resolvedTargetPath: targetPath,
    }
  }
}

const getLinkPlan = (
  sourceState: EntryState,
  targetState: EntryState,
  targetSelectionType: TargetSelectionType,
): LinkPlan => {
  if (
    sourceState === 'unsupported' ||
    sourceState === 'unavailable' ||
    targetState === 'unsupported' ||
    targetState === 'unavailable'
  ) {
    return 'conflict'
  }

  if (
    targetSelectionType === 'file' &&
    (sourceState === 'empty_folder' || sourceState === 'folder')
  ) {
    return 'conflict'
  }

  switch (sourceState) {
    case 'missing':
    case 'symlink':
      return targetState === 'missing' ? 'conflict' : 'link_source'

    case 'empty_file':
    case 'file':
    case 'empty_folder':
    case 'folder':
      return targetState === 'missing' ||
        targetState === 'empty_file' ||
        targetState === 'empty_folder'
        ? 'migrate_source_to_target'
        : 'conflict'
  }
}

type CheckConflictOptions = {
  sourcePath: string
  targetPath: string
  targetSelectionType: TargetSelectionType
}

export const check_conflict = async ({
  sourcePath,
  targetPath,
  targetSelectionType,
}: CheckConflictOptions): Promise<AuditResult> => {
  const [sourceState, targetInspection] = await Promise.all([
    inspectEntry(sourcePath),
    inspectTarget(targetPath),
  ])
  const isSourceTargetSame =
    path.resolve(sourcePath) ===
    path.resolve(targetInspection.resolvedTargetPath)

  return {
    sourceState,
    ...targetInspection,
    plan: isSourceTargetSame
      ? 'conflict'
      : getLinkPlan(
          sourceState,
          targetInspection.targetState,
          targetSelectionType,
        ),
  }
}
