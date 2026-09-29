import fs from 'fs/promises'

export const unlinkEntries = async ({
  sourcePaths,
}: {
  sourcePaths: string[]
}) => {
  for (const sourcePath of sourcePaths) {
    const stats = await fs.lstat(sourcePath)

    if (!stats.isSymbolicLink()) {
      throw new Error(`Only symlinks can be removed: ${sourcePath}`)
    }

    await fs.unlink(sourcePath)
  }
}
