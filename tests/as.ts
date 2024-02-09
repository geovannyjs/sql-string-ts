import { assert } from 'chai'

import { as } from '../dist/index.js'

import { user, movie, director } from './schema'


describe('as', () => {
  it('should return the prefix (table alias) followed by an underline followed by the column name', () => {
    assert.equal(as(user.name), 'u_name')
    assert.equal(as(movie.name), 'm_name')
    assert.equal(as(director.name), 'd_name')
  })
})
