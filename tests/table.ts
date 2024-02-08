import { assert } from 'chai'

import { table } from '../dist/index.js'

import { user, movie, director } from './schema'


describe('table', () => {

  it('should return the table name when called without config', () => {
    assert.equal(table(user), 'user')
    assert.equal(table(movie), 'movie')
    assert.equal(table(director), 'director')
  })

  it('should return the table aliased when called with alias config enabled', () => {
    assert.equal(table(user, { alias: true }), 'user u')
    assert.equal(table(movie, { alias: true }), 'movie m')
    assert.equal(table(director, { alias: true }), 'director d')
  })

  it('should return the table quoted when called with quote config enabled', () => {
    assert.equal(table(user, { quote: true }), '`user`')
    assert.equal(table(movie, { quote: true }), '`movie`')
    assert.equal(table(director, { quote: true }), '`director`')
  })

  it('should return the table aliased and quoted when called with alias and quote config enabled', () => {
    assert.equal(table(user, { alias: true, quote: true }), '`user` `u`')
    assert.equal(table(movie, { alias: true, quote: true }), '`movie` `m`')
    assert.equal(table(director, { alias: true, quote: true }), '`director` `d`')
  })

})
