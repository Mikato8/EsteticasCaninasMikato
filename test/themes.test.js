import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_THEME_ID, THEME_VARS, getTheme, resolveThemeVars, themes } from '../src/constants/themes.js'

test('there are exactly 5 templates with unique ids', () => {
  assert.equal(themes.length, 5)
  assert.equal(new Set(themes.map((theme) => theme.id)).size, 5)
})

test('every theme defines all expected CSS variables', () => {
  for (const theme of themes) {
    for (const name of THEME_VARS) {
      assert.ok(theme.vars[name], `${theme.id} missing ${name}`)
    }
  }
})

test('getTheme returns the default theme for unknown ids', () => {
  assert.equal(getTheme('does-not-exist').id, DEFAULT_THEME_ID)
  assert.equal(getTheme('oceano').id, 'oceano')
})

test('resolveThemeVars applies overrides and derives accent glow', () => {
  const base = resolveThemeVars('oceano')
  assert.equal(base['--accent'], '#3b82f6')

  const custom = resolveThemeVars('oceano', { accent: '#ff0000', accent2: '#00ff00', bg: '#101010' })
  assert.equal(custom['--accent'], '#ff0000')
  assert.equal(custom['--accent-glow'], 'rgba(255,0,0,0.14)')
  assert.equal(custom['--accent2'], '#00ff00')
  assert.equal(custom['--bg'], '#101010')
  assert.equal(custom['--bg2'], '#101010')
})

test('resolveThemeVars ignores empty overrides', () => {
  const base = resolveThemeVars('coral')
  const same = resolveThemeVars('coral', { accent: '', accent2: undefined, bg: null })
  assert.deepEqual(same, base)
})
