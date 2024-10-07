import { assert } from 'chai'

import { update } from '../dist/index.js'

import { user } from './schema'


describe('update', () => {

  it('should return a valid update statement', () => {
    assert.equal(update([user.name, 'Nick'], [user.email, 'nick@email.com']).text, 'update `user` set `name`=Nick, `email`=nick@email.com')
  })

  it('should return a valid update statement ignoring undefined values', () => {
    assert.equal(update([user.name, 'Nick'], [user.password, undefined], [user.email, 'nick@email.com']).text, 'update `user` set `name`=Nick, `email`=nick@email.com')
  })

})
