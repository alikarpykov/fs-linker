import fs from 'fs/promises'
import path from 'path'

import { isErrorWithCode } from '#/shared/lib/isErrorWithCode.js'

import { ACCESS_DENIED, getEntryPriority } from '../model/entry.js'

import type { FileSystemEntry } from '../model/entry.js'

export const getDirectoryEntries = async (
  dirPath: string,
): Promise<FileSystemEntry[]> => {
  const names = await fs.readdir(dirPath)
  const entries = await Promise.all(
    names.map((name) => getDirectoryEntry(dirPath, name)),
  )
  const parentPath = path.resolve(dirPath, '..')

  entries.sort(
    (first, second) =>
      getEntryPriority(first) - getEntryPriority(second) ||
      first.name.localeCompare(second.name),
  )

  return parentPath === dirPath
    ? entries
    : [
        { name: '..', kind: 'parent', isDirectory: true, isSymlink: false },
        ...entries,
      ]
}

export const isEntryUnavailable = async (entryPath: string) => {
  try {
    await fs.lstat(entryPath)

    return false
  } catch (error: unknown) {
    return (
      isErrorWithCode(error, 'ENOENT') ||
      isErrorWithCode(error, 'EACCES') ||
      isErrorWithCode(error, 'EPERM')
    )
  }
}

const getDirectoryEntry = async (
  dirPath: string,
  name: string,
): Promise<FileSystemEntry> => {
  try {
    const fullPath = path.join(dirPath, name)
    const stats = await fs.lstat(fullPath)

    if (!stats.isSymbolicLink()) {
      return {
        name,
        kind: 'entry',
        isDirectory: stats.isDirectory(),
        isSymlink: false,
      }
    }

    try {
      const [targetStats, resolvedTargetPath] = await Promise.all([
        fs.stat(fullPath),
        fs.realpath(fullPath),
      ])

      return {
        name,
        kind: 'entry',
        isDirectory: targetStats.isDirectory(),
        isSymlink: true,
        isBrokenSymlink: false,
        resolvedTargetPath,
      }
    } catch (error: unknown) {
      if (isErrorWithCode(error, 'ENOENT')) {
        const linkTargetPath = path.resolve(
          dirPath,
          await fs.readlink(fullPath),
        )

        return {
          name,
          kind: 'entry',
          isDirectory: null,
          isSymlink: true,
          isBrokenSymlink: true,
          resolvedTargetPath: linkTargetPath,
        }
      }

      return ACCESS_DENIED
    }
  } catch {
    return ACCESS_DENIED
  }
}
