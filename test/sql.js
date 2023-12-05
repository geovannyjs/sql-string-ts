const assert = require('chai').assert;

const { empty, SQL } = require('../dist/index.js')

describe('SQL', function () {
  describe('empty', function () {
    it('should return an empty string when accessing the text property', function () {
      assert.equal(empty.text, '')
    })
    it('should return an empty string when accessing the sql property', function () {
      assert.equal(empty.sql, '')
    })
  })
  describe('concat', function () {
    it('should return an empty string when concatenated with another empty and accessing the text property', function () {
      assert.equal(empty.concat(empty).text, '')
    })
    it('should return an empty string when concatenated with another empty and accessing the sql property', function () {
      assert.equal(empty.concat(empty).sql, '')
    })
    it('should return an empty string when concatenated multiple times with another empty and accessing the text property', function () {
      assert.equal(empty.concat(empty).concat(empty).text, '')
    })
    it('should return an empty string when concatenated multiple times with another empty and accessing the sql property', function () {
      assert.equal(empty.concat(empty).concat(empty).sql, '')
    })
    it('should return the same string when concatenated with empty and accessing the text property', function () {
      assert.equal(SQL`select from table`.concat(empty).text, 'select from table')
    })
    it('should return the same string when concatenated with empty and accessing the sql property', function () {
      assert.equal(SQL`select from table`.concat(empty).sql, 'select from table')
    })
    it('should return the same string when concatenated multiple times with empty and accessing the text property', function () {
      assert.equal(SQL`select from table`.concat(empty).concat(empty).text, 'select from table')
    })
    it('should return the same string when concatenated multiple times with empty and accessing the sql property', function () {
      assert.equal(SQL`select from table`.concat(empty).concat(empty).sql, 'select from table')
    })
  })
})
