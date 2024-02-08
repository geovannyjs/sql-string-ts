import { assert } from 'chai'

import { empty, SQL } from '../dist/index.js'


describe('concat', () => {
  it('should return an empty string when concatenated with another empty', () => {
    assert.equal(empty.concat(empty).text, '')
    assert.equal(empty.concat(empty).sql, '')
  })
  it('should return an empty string when concatenated multiple times with another empty', () => {
    assert.equal(empty.concat(empty).concat(empty).text, '')
    assert.equal(empty.concat(empty).concat(empty).sql, '')
  })
  it('should return the same string when concatenated with empty', () => {
    assert.equal(SQL`select from table`.concat(empty).text, 'select from table')
    assert.equal(SQL`select from table`.concat(empty).sql, 'select from table')
  })
  it('should return the same string when concatenated multiple times with empty', () => {
    assert.equal(SQL`select from table`.concat(empty).concat(empty).text, 'select from table')
    assert.equal(SQL`select from table`.concat(empty).concat(empty).sql, 'select from table')
  })
})
