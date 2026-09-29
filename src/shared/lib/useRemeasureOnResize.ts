import { useEffect, type RefObject } from 'react'

import type { ScrollListRef } from 'ink-scroll-list'

export const useRemeasureOnResize = (
  listRef: RefObject<ScrollListRef | null>,
) => {
  useEffect(() => {
    const handleResize = () => listRef.current?.remeasure()

    process.stdout.on('resize', handleResize)

    return () => {
      process.stdout.off('resize', handleResize)
    }
  }, [listRef])
}
