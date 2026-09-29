import path from 'path'

import { useEffect } from 'react'

import { useFocusManager } from 'ink'

import { linkEntries, unlinkEntries } from '#/entities/link/index.js'

import { useLinkPlan } from './useLinkPlan.js'
import { useLinkPlanNavigation } from './useLinkPlanNavigation.js'
import { usePanel } from './usePanel.js'

export const useLinkingWorkspace = () => {
  const { activeId, focus } = useFocusManager()

  const initialPath = process.cwd()

  const source = usePanel({
    initialPath,
    selectionMode: 'multiple',
  })
  const target = usePanel({
    initialPath,
    selectionMode: 'single',
  })

  const reloadPanels = () => {
    source.reloadEntries()
    target.reloadEntries()
  }

  const clearSelections = () => {
    source.clearSelection()
    target.clearSelection()
  }

  const targetSelectionPath = target.selectedPaths[0]

  const { linkPlanEntries, resetLinkPlan } = useLinkPlan({
    sourcePaths: source.selectedPaths,
    targetSelectionPath,
  })
  const linkPlanNavigation = useLinkPlanNavigation({
    entriesCount: linkPlanEntries.length,
  })

  useEffect(() => {
    if (activeId === 'linkPlan' && linkPlanEntries.length === 0) {
      focus('source')
    }
  }, [activeId, focus, linkPlanEntries.length])

  const activePanel = activeId === 'target' ? target : source

  const moveFocus = (direction: 'up' | 'down') => {
    if (activeId === 'linkPlan') {
      linkPlanNavigation.moveRowFocus(direction)
      return
    }

    activePanel.moveEntryFocus(direction)
  }

  const focusBoundary = (boundary: 'first' | 'last') => {
    if (activeId === 'linkPlan') {
      linkPlanNavigation.focusRowBoundary(boundary)
      return
    }

    activePanel.focusEntryBoundary(boundary)
  }

  const toggleFocusedEntry = () => {
    if (activeId !== 'linkPlan') {
      activePanel.toggleFocusedEntry()
    }
  }

  const onLink = async () => {
    if (source.selectedPaths.length === 0 || !targetSelectionPath) {
      return
    }

    try {
      await linkEntries({
        sourcePaths: source.selectedPaths,
        targetSelectionPath,
      })
      resetLinkPlan()
      clearSelections()
    } finally {
      reloadPanels()
    }
  }

  const onDelete = async () => {
    if (source.selectedPaths.length === 0) {
      return
    }

    try {
      await unlinkEntries({ sourcePaths: source.selectedPaths })
    } finally {
      reloadPanels()
    }
  }

  const openFocusedEntry = () => {
    if (activeId === 'linkPlan') return

    const entry = activePanel.focusedEntry

    if (!entry) return

    if (entry.isSymlink) {
      if (entry.isBrokenSymlink) return

      focus('target')

      if (entry.isDirectory) {
        target.openPath(entry.resolvedTargetPath)
      } else {
        target.openPath(
          path.dirname(entry.resolvedTargetPath),
          path.basename(entry.resolvedTargetPath),
        )
      }

      return
    }

    if (!entry.isDirectory) return

    activePanel.enterDirectory()
  }

  return {
    source,
    target,
    moveFocus,
    focusBoundary,
    toggleFocusedEntry,
    openFocusedEntry,
    onLink,
    onDelete,
    linkPlanEntries,
    linkPlanFocusedIndex: linkPlanNavigation.focusedIndex,
  }
}
