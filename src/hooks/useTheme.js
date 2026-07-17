import { useEffect } from 'react'
import { resolveThemeVars } from '../constants/themes'

export const useTheme = (themeId, overrides) => {
  const accent = overrides?.accent
  const accent2 = overrides?.accent2
  const bg = overrides?.bg

  useEffect(() => {
    const root = document.documentElement
    const vars = resolveThemeVars(themeId, { accent, accent2, bg })
    for (const [name, value] of Object.entries(vars)) {
      root.style.setProperty(name, value)
    }
  }, [themeId, accent, accent2, bg])
}
