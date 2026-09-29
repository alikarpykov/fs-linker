import { useEffect, useState } from 'react'

type UseLinkPlanNavigationProps = {
  entriesCount: number
}

export const useLinkPlanNavigation = ({
  entriesCount,
}: UseLinkPlanNavigationProps) => {
  const [focusedIndex, setFocusedIndex] = useState(0)

  useEffect(() => {
    setFocusedIndex((currentIndex) =>
      entriesCount === 0 ? 0 : Math.min(currentIndex, entriesCount - 1),
    )
  }, [entriesCount])

  const moveRowFocus = (direction: 'up' | 'down') => {
    setFocusedIndex((currentIndex) => {
      if (entriesCount === 0) return 0

      return direction === 'up'
        ? Math.max(0, currentIndex - 1)
        : Math.min(entriesCount - 1, currentIndex + 1)
    })
  }

  const focusRowBoundary = (boundary: 'first' | 'last') => {
    setFocusedIndex(
      entriesCount === 0 || boundary === 'first' ? 0 : entriesCount - 1,
    )
  }

  return {
    focusedIndex,
    moveRowFocus,
    focusRowBoundary,
  }
}
