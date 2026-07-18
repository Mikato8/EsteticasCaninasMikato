import { test } from 'node:test'
import assert from 'node:assert/strict'
import { findDuplicateUsernames, normalizeUsername } from '../backend/src/utils/users.js'

test('normalizeUsername trims and handles nullish', () => {
  assert.equal(normalizeUsername('  ana '), 'ana')
  assert.equal(normalizeUsername(null), '')
  assert.equal(normalizeUsername(undefined), '')
})

test('findDuplicateUsernames detects repeats case-insensitively', () => {
  const dups = findDuplicateUsernames([{ username: 'ana' }, { username: 'ANA' }, { username: 'juan' }])
  assert.deepEqual(dups, ['ana'])
})

test('findDuplicateUsernames returns empty when all unique', () => {
  assert.deepEqual(findDuplicateUsernames([{ username: 'ana' }, { username: 'juan' }]), [])
})

test('findDuplicateUsernames ignores empty usernames', () => {
  assert.deepEqual(findDuplicateUsernames([{ username: '' }, { username: '  ' }, {}]), [])
})
