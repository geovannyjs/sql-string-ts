import { assert } from 'chai'

import { update, b } from '../dist/index.js'

import { user } from './schema'


describe('update', () => {

  it('should return a valid update statement', () => {
    assert.equal(update([user.name, b('Nick')], [user.email, b('nick@email.com')]).text, 'update `user` set `name`=$1, `email`=$2')
  })

  it('should return a valid update statement ignoring undefined values', () => {
    assert.equal(update([user.name, b('Nick')], [user.password, b(undefined)], [user.email, b('nick@email.com')]).text, 'update `user` set `name`=$1, `email`=$2')
  })

})
