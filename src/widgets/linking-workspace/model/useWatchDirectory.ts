import { useEffect, useRef } from 'react'

import { watch } from 'chokidar'

type UseWatchDirectoryOptions = {
  directoryPath: string
  reloadEntries: () => void
}

export const useWatchDirectory = ({
  directoryPath,
  reloadEntries,
}: UseWatchDirectoryOptions) => {
  const reloadEntriesRef = useRef(reloadEntries)

  reloadEntriesRef.current = reloadEntries

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const watcher = watch(directoryPath, {
      depth: 0,
      followSymlinks: false,
      ignoreInitial: true,
      persistent: false,
    })

    const scheduleReload = () => {
      clearTimeout(timer)

      timer = setTimeout(() => {
        reloadEntriesRef.current()
      }, 100)
    }

    watcher.on('all', scheduleReload)
    watcher.on('error', () => {})

    return () => {
      clearTimeout(timer)
      void watcher.close()
    }
  }, [directoryPath])
}
