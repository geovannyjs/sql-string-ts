import { assert } from 'chai'

import { empty } from '../dist/index.js'


describe('empty', () => {
  it('should return an empty string', () => {
    assert.equal(empty.text, '')
    assert.equal(empty.sql, '')
  })
})
