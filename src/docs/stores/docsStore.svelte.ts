export type Theme = 'dark' | 'light'

export type DocsModel = {
  theme: Theme
}

let theme: DocsModel['theme'] = $state('light')

export const useDocsStore = (): DocsModel => {
  return {
    get theme() {
      return theme
    },
    set theme(to) {
      theme = to
    },
  }
}
