import { assert } from 'chai'

import { column } from '../dist/index.js'

import { user, movie, director } from './schema'


describe('column', () => {

  it('without config params', () => {
    assert.equal(column(user.name), 'name')
    assert.equal(column(movie.name), 'name')
    assert.equal(column(director.name), 'name')
  })

  it('with as enabled', () => {
    assert.equal(column(user.name, { as: true }), 'name as u_name')
    assert.equal(column(movie.name, { as: true }), 'name as m_name')
    assert.equal(column(director.name, { as: true }), 'name as d_name')
  })

  it('with prefix enabled', () => {
    assert.equal(column(user.name, { prefix: true }), 'u.name')
    assert.equal(column(movie.name, { prefix: true }), 'm.name')
    assert.equal(column(director.name, { prefix: true }), 'd.name')
  })

  it('with quote enabled', () => {
    assert.equal(column(user.name, { quote: true }), '`name`')
    assert.equal(column(movie.name, { quote: true }), '`name`')
    assert.equal(column(director.name, { quote: true }), '`name`')
  })

  it('with as, prefix and quote enabled', () => {
    assert.equal(column(user.name, { as: true, prefix: true, quote: true }), '`u`.`name` as `u_name`')
    assert.equal(column(movie.name, { as: true, prefix: true, quote: true }), '`m`.`name` as `m_name`')
    assert.equal(column(director.name, { as: true, prefix: true, quote: true }), '`d`.`name` as `d_name`')
  })

})
