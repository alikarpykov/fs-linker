import { useCallback, useEffect, useReducer, useRef } from 'react'

import {
  ACCESS_DENIED,
  getDirectoryEntries,
  getEntryPath,
  isEntryUnavailable,
  type FileSystemEntry,
} from '#/entities/file-system-entry/index.js'

import { useWatchDirectory } from './useWatchDirectory.js'

type SelectionMode = 'single' | 'multiple'

type UsePanelProps = {
  initialPath: string
  selectionMode: SelectionMode
}

type PanelState = {
  path: string
  selectionMode: SelectionMode
  entries: FileSystemEntry[]
  focusedIndex: number
  selectedPaths: string[]
}

type PanelAction =
  | {
      type: 'entriesLoaded'
      payload: {
        path: string
        entries: FileSystemEntry[]
        focusedIndex: number
      }
    }
  | {
      type: 'focusChanged'
      payload: { focusedIndex: number }
    }
  | {
      type: 'selectionToggled'
      payload: { entryPath: string }
    }
  | {
      type: 'unavailableSelectionsRemoved'
      payload: { unavailableSelectedPaths: string[] }
    }
  | {
      type: 'selectionCleared'
    }

const panelReducer = (panel: PanelState, action: PanelAction) => {
  switch (action.type) {
    case 'entriesLoaded': {
      const { path, entries, focusedIndex } = action.payload
      return {
        ...panel,
        path,
        entries,
        focusedIndex,
      }
    }
    case 'focusChanged': {
      const { focusedIndex } = action.payload
      return { ...panel, focusedIndex }
    }
    case 'selectionToggled': {
      const { entryPath } = action.payload

      if (panel.selectionMode === 'single') {
        return {
          ...panel,
          selectedPaths:
            panel.selectedPaths[0] === entryPath ? [] : [entryPath],
        }
      }

      return {
        ...panel,
        selectedPaths: panel.selectedPaths.includes(entryPath)
          ? panel.selectedPaths.filter((path) => path !== entryPath)
          : [...panel.selectedPaths, entryPath],
      }
    }
    case 'unavailableSelectionsRemoved': {
      const { unavailableSelectedPaths } = action.payload
      return {
        ...panel,
        selectedPaths: panel.selectedPaths.filter(
          (selectedPath) => !unavailableSelectedPaths.includes(selectedPath),
        ),
      }
    }
    case 'selectionCleared': {
      return { ...panel, selectedPaths: [] }
    }
    default: {
      throw Error('Unknown panel action')
    }
  }
}

export const usePanel = ({ initialPath, selectionMode }: UsePanelProps) => {
  const [panel, dispatch] = useReducer(panelReducer, {
    path: initialPath,
    selectionMode,
    entries: [],
    focusedIndex: 0,
    selectedPaths: [],
  })

  const selectedPathsRef = useRef(panel.selectedPaths)

  selectedPathsRef.current = panel.selectedPaths

  const loadEntriesAtPath = useCallback(
    async (nextPath: string, focusedEntryName?: string) => {
      const getUnavailableSelectedPaths = async () => {
        const unavailablePaths = await Promise.all(
          selectedPathsRef.current.map(async (selectedPath) => {
            return (await isEntryUnavailable(selectedPath))
              ? selectedPath
              : null
          }),
        )
        return unavailablePaths.filter(
          (selectedPath): selectedPath is string => selectedPath !== null,
        )
      }

      try {
        const entries = await getDirectoryEntries(nextPath)
        const focusedIndex = focusedEntryName
          ? Math.max(
              0,
              entries.findIndex((entry) => entry.name === focusedEntryName),
            )
          : 0

        dispatch({
          type: 'entriesLoaded',
          payload: { path: nextPath, entries, focusedIndex },
        })
      } catch {
        dispatch({
          type: 'entriesLoaded',
          payload: {
            path: nextPath,
            entries: [ACCESS_DENIED],
            focusedIndex: 0,
          },
        })
      } finally {
        const unavailableSelectedPaths = await getUnavailableSelectedPaths()

        if (unavailableSelectedPaths.length > 0) {
          dispatch({
            type: 'unavailableSelectionsRemoved',
            payload: { unavailableSelectedPaths },
          })
        }
      }
    },
    [],
  )

  useEffect(() => {
    void loadEntriesAtPath(initialPath)
  }, [initialPath, loadEntriesAtPath])

  const focusedEntry = panel.entries[panel.focusedIndex]

  const reloadEntries = () => {
    void loadEntriesAtPath(panel.path, focusedEntry?.name)
  }

  useWatchDirectory({
    directoryPath: panel.path,
    reloadEntries,
  })

  const openPath = (nextPath: string, focusedEntryName?: string) => {
    void loadEntriesAtPath(nextPath, focusedEntryName)
  }

  const moveEntryFocus = (direction: 'up' | 'down') => {
    if (panel.entries.length === 0) return

    const nextIndex =
      direction === 'up'
        ? Math.max(0, panel.focusedIndex - 1)
        : Math.min(panel.entries.length - 1, panel.focusedIndex + 1)

    dispatch({ type: 'focusChanged', payload: { focusedIndex: nextIndex } })
  }

  const focusEntryBoundary = (boundary: 'first' | 'last') => {
    if (panel.entries.length === 0) return

    dispatch({
      type: 'focusChanged',
      payload: {
        focusedIndex: boundary === 'first' ? 0 : panel.entries.length - 1,
      },
    })
  }

  const enterDirectory = () => {
    if (focusedEntry?.isDirectory && !focusedEntry.isSymlink) {
      openPath(getEntryPath(panel.path, focusedEntry))
    }
  }

  const toggleFocusedEntry = () => {
    if (focusedEntry?.kind !== 'entry') {
      return
    }

    const focusedEntryPath = getEntryPath(panel.path, focusedEntry)

    dispatch({
      type: 'selectionToggled',
      payload: { entryPath: focusedEntryPath },
    })
  }

  const clearSelection = () => {
    dispatch({ type: 'selectionCleared' })
  }

  return {
    path: panel.path,
    entries: panel.entries,
    focusedIndex: panel.focusedIndex,
    selectedPaths: panel.selectedPaths,
    focusedEntry,
    reloadEntries,
    openPath,
    moveEntryFocus,
    focusEntryBoundary,
    enterDirectory,
    toggleFocusedEntry,
    clearSelection,
  }
}
