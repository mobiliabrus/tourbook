declare module '*.md' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly glob: <T>(pattern: string, options?: any) => Record<string, () => Promise<T>>
}
