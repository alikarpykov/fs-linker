export type EntryState =
  | 'missing'
  | 'symlink'
  | 'empty_file'
  | 'empty_folder'
  | 'file'
  | 'folder'
  | 'unsupported'
  | 'unavailable'

export type TargetSelectionType = 'file' | 'directory'

export type LinkPlan = 'link_source' | 'migrate_source_to_target' | 'conflict'

export type ExecutableLinkPlan = Exclude<LinkPlan, 'conflict'>

export type LinkEntriesProps = {
  sourcePaths: string[]
  targetSelectionPath: string
}

export type LinkPlanEntry = {
  sourcePath: string
  targetPath: string
  plan: LinkPlan
}

export type AuditResult = {
  sourceState: EntryState
  targetState: EntryState
  resolvedTargetPath: string
  plan: LinkPlan
}

export type ExecutableAuditResult = AuditResult & {
  plan: ExecutableLinkPlan
}
