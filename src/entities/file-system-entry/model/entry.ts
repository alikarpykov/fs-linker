import path from 'path'

type SymlinkEntry = {
  name: string
  kind: 'entry'
  isDirectory: boolean | null
  isSymlink: true
  isBrokenSymlink: boolean
  resolvedTargetPath: string
}

type RegularEntry = {
  name: string
  kind: 'entry' | 'parent' | 'accessDenied'
  isDirectory: boolean
  isSymlink: false
}

export type FileSystemEntry = SymlinkEntry | RegularEntry

export const ACCESS_DENIED: FileSystemEntry = {
  name: '❌ Access Denied',
  kind: 'accessDenied',
  isDirectory: false,
  isSymlink: false,
}

export const getEntryPriority = (entry: FileSystemEntry) => {
  if (entry.isSymlink && entry.isBrokenSymlink) {
    return 0
  }
  if (entry.isSymlink && entry.isDirectory) {
    return 1
  }
  if (entry.isSymlink) {
    return 2
  }
  if (entry.isDirectory) {
    return 3
  }
  return 4
}

export const getEntryPath = (currentPath: string, entry: FileSystemEntry) => {
  return entry.kind === 'parent'
    ? path.resolve(currentPath, '..')
    : path.join(currentPath, entry.name)
}
