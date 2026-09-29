#!/usr/bin/env node
import Pastel from 'pastel'

const app = new Pastel({
  importMeta: import.meta,
  name: 'fsl',
  description: 'File system linker via native operating system symlinks',
  version: '1.0.0',
})

await app.run()
