import { assert } from 'chai'

import { insert, b } from '../dist/index.js'

import { user } from './schema'


describe('insert', () => {

  it('should return a valid insert statement', () => {
    assert.equal(insert([user.name, b('Nick')], [user.email, b('nick@email.com')]).text, 'insert into `user` (`name`, `email`) values ($1, $2)')
  })

  it('should return a valid insert statement ignoring undefined values', () => {
    assert.equal(insert([user.name, b('Nick')], [user.password, b(undefined)], [user.email, b('nick@email.com')]).text, 'insert into `user` (`name`, `email`) values ($1, $2)')
  })

})
