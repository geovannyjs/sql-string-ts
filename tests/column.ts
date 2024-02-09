import { assert } from 'chai'

import { column } from '../dist/index.js'

import { user, movie, director } from './schema'


describe('column', () => {

  it('should return the column name when called without config', () => {
    assert.equal(column(user.name), 'name')
    assert.equal(column(movie.name), 'name')
    assert.equal(column(director.name), 'name')
  })

  it('should return the column name with as when called with as enabled', () => {
    assert.equal(column(user.name, { as: true }), 'name as u_name')
    assert.equal(column(movie.name, { as: true }), 'name as m_name')
    assert.equal(column(director.name, { as: true }), 'name as d_name')
  })

  it('should return the column name prefixed when called with prefix enabled', () => {
    assert.equal(column(user.name, { prefix: true }), 'u.name')
    assert.equal(column(movie.name, { prefix: true }), 'm.name')
    assert.equal(column(director.name, { prefix: true }), 'd.name')
  })

  it('should return the column name quoted when called with quote enabled', () => {
    assert.equal(column(user.name, { quote: true }), '`name`')
    assert.equal(column(movie.name, { quote: true }), '`name`')
    assert.equal(column(director.name, { quote: true }), '`name`')
  })

  it('should return the column name with as, prefixed and quoted when called with as, prefix and quote enabled', () => {
    assert.equal(column(user.name, { as: true, prefix: true, quote: true }), '`u`.`name` as `u_name`')
    assert.equal(column(movie.name, { as: true, prefix: true, quote: true }), '`m`.`name` as `m_name`')
    assert.equal(column(director.name, { as: true, prefix: true, quote: true }), '`d`.`name` as `d_name`')
  })

})
