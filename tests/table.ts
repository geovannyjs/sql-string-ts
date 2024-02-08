import { assert } from 'chai'

import { table } from '../dist/index.js'

import { user, movie, director } from './schema'


describe('table', () => {

  it('without config params', () => {
    assert.equal(table(user), 'user')
    assert.equal(table(movie), 'movie')
    assert.equal(table(director), 'director')
  })

  it('with alias enabled', () => {
    assert.equal(table(user, { alias: true }), 'user u')
    assert.equal(table(movie, { alias: true }), 'movie m')
    assert.equal(table(director, { alias: true }), 'director d')
  })

  it('with quote enabled', () => {
    assert.equal(table(user, { quote: true }), '`user`')
    assert.equal(table(movie, { quote: true }), '`movie`')
    assert.equal(table(director, { quote: true }), '`director`')
  })

  it('with alias and quote enabled', () => {
    assert.equal(table(user, { alias: true, quote: true }), '`user` `u`')
    assert.equal(table(movie, { alias: true, quote: true }), '`movie` `m`')
    assert.equal(table(director, { alias: true, quote: true }), '`director` `d`')
  })

})
