import { assert } from 'chai'

import { insert } from '../dist/index.js'

import { user } from './schema'


describe('insert', () => {

  it('should return a valid insert statement', () => {
    assert.equal(insert([user.name, 'Nick'], [user.email, 'nick@email.com']).text, 'insert into `user` (`name`, `email`) values (Nick, nick@email.com)')
  })

  it('should return a valid insert statement ignoring undefined values', () => {
    assert.equal(insert([user.name, 'Nick'], [user.password, undefined], [user.email, 'nick@email.com']).text, 'insert into `user` (`name`, `email`) values (Nick, nick@email.com)')
  })

})
