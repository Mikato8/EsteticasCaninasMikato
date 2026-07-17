// Paletas de plantilla. Cada tema define el set completo de variables CSS
// que consume src/index.css. Los colores de "success/danger/info/warning"
// se mantienen fijos y no forman parte de la plantilla.

export const THEME_VARS = [
  '--bg',
  '--bg2',
  '--card',
  '--card2',
  '--border',
  '--fg',
  '--fg2',
  '--muted',
  '--accent',
  '--accent2',
  '--accent-glow',
]

export const themes = [
  {
    id: 'coral',
    name: 'Coral (Oscuro)',
    vars: {
      '--bg': '#09090b',
      '--bg2': '#131316',
      '--card': '#18181b',
      '--card2': '#222225',
      '--border': '#27272a',
      '--fg': '#ede9e3',
      '--fg2': '#a8a29e',
      '--muted': '#6b6560',
      '--accent': '#E06C4F',
      '--accent2': '#f0a030',
      '--accent-glow': 'rgba(224,108,79,.12)',
    },
  },
  {
    id: 'oceano',
    name: 'Océano (Oscuro)',
    vars: {
      '--bg': '#0b1220',
      '--bg2': '#111a2e',
      '--card': '#152036',
      '--card2': '#1c2a45',
      '--border': '#24344f',
      '--fg': '#e6edf7',
      '--fg2': '#9fb2cc',
      '--muted': '#647089',
      '--accent': '#3b82f6',
      '--accent2': '#06b6d4',
      '--accent-glow': 'rgba(59,130,246,.14)',
    },
  },
  {
    id: 'bosque',
    name: 'Bosque (Oscuro)',
    vars: {
      '--bg': '#0a0f0b',
      '--bg2': '#101a12',
      '--card': '#142016',
      '--card2': '#1b2b1e',
      '--border': '#243528',
      '--fg': '#e8f0e9',
      '--fg2': '#a3b8a8',
      '--muted': '#64766a',
      '--accent': '#22c55e',
      '--accent2': '#84cc16',
      '--accent-glow': 'rgba(34,197,94,.14)',
    },
  },
  {
    id: 'purpura',
    name: 'Púrpura (Oscuro)',
    vars: {
      '--bg': '#0e0b14',
      '--bg2': '#16111f',
      '--card': '#1c1528',
      '--card2': '#261c35',
      '--border': '#312445',
      '--fg': '#ece7f3',
      '--fg2': '#b3a8c6',
      '--muted': '#726588',
      '--accent': '#8b5cf6',
      '--accent2': '#d946ef',
      '--accent-glow': 'rgba(139,92,246,.14)',
    },
  },
  {
    id: 'claro',
    name: 'Claro',
    vars: {
      '--bg': '#f4f5f7',
      '--bg2': '#ffffff',
      '--card': '#ffffff',
      '--card2': '#f1f3f5',
      '--border': '#e2e5ea',
      '--fg': '#1f2937',
      '--fg2': '#5b6472',
      '--muted': '#98a1af',
      '--accent': '#E06C4F',
      '--accent2': '#f0a030',
      '--accent-glow': 'rgba(224,108,79,.15)',
    },
  },
]

export const DEFAULT_THEME_ID = 'coral'

export const getTheme = (themeId) => themes.find((theme) => theme.id === themeId) || themes[0]

const hexToGlow = (hex, alpha = 0.14) => {
  const match = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex || '')
  if (!match) return null
  const [r, g, b] = match.slice(1).map((part) => parseInt(part, 16))
  return `rgba(${r},${g},${b},${alpha})`
}

// Resuelve las variables efectivas: base de la plantilla + overrides de color
// configurables (acento, acento secundario y fondo). Sólo aplica overrides con valor.
export const resolveThemeVars = (themeId, overrides = {}) => {
  const base = getTheme(themeId).vars
  const vars = { ...base }
  if (overrides.accent) {
    vars['--accent'] = overrides.accent
    const glow = hexToGlow(overrides.accent)
    if (glow) vars['--accent-glow'] = glow
  }
  if (overrides.accent2) vars['--accent2'] = overrides.accent2
  if (overrides.bg) {
    vars['--bg'] = overrides.bg
    vars['--bg2'] = overrides.bg
  }
  return vars
}
