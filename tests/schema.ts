import { assert } from 'chai'

import { schema } from '../dist/index.js'


enum userColumns {
  id,
  name,
  email,
  password,
  favorite_movie_id,
  is_active,
  inserted_at,
  updated_at
}

const user = schema({ table: 'user', columns: userColumns, quote: '`', alias: 'u' })

enum movieColumns {
  id,
  name,
  year,
  director_id,
  inserted_at,
  updated_at
}

const movie = schema({ table: 'movie', columns: movieColumns, quote: '`', alias: 'm' })

enum directorColumns {
  id,
  name,
  inserted_at,
  updated_at
}

const director = schema({ table: 'director', columns: directorColumns, quote: '`', alias: 'd' })

describe('schema', () => {

  it('should return a schema object with all the columns from the enum', () => {
    assert.equal(user.id.name, 'id')
    assert.equal(user.name.name, 'name')
    assert.equal(user.email.name, 'email')
    assert.equal(user.password.name, 'password')
    assert.equal(user.favorite_movie_id.name, 'favorite_movie_id')
    assert.equal(user.is_active.name, 'is_active')
    assert.equal(user.inserted_at.name, 'inserted_at')
    assert.equal(user.updated_at.name, 'updated_at')

    assert.equal(movie.id.name, 'id')
    assert.equal(movie.name.name, 'name')
    assert.equal(movie.year.name, 'year')
    assert.equal(movie.director_id.name, 'director_id')
    assert.equal(movie.inserted_at.name, 'inserted_at')
    assert.equal(movie.updated_at.name, 'updated_at')

    assert.equal(director.id.name, 'id')
    assert.equal(director.name.name, 'name')
    assert.equal(director.inserted_at.name, 'inserted_at')
    assert.equal(director.updated_at.name, 'updated_at')
  })

  it('should return columns with a scheme property that references the schema itself', () => {
    assert.equal(user.id.schema, user)
    assert.equal(movie.id.schema, movie)
    assert.equal(director.id.schema, director)
  })

  it('should return an object which the toString method prints the table name aliased and quoted', () => {
    assert.equal(user.toString(), '`user` `u`')
    assert.equal(movie.toString(), '`movie` `m`')
    assert.equal(director.toString(), '`director` `d`')
  })

  it("should return an object which the column's toString method prints the column name prefixed and quoted", () => {
    assert.equal(user.name.toString(), '`u`.`name`')
    assert.equal(movie.name.toString(), '`m`.`name`')
    assert.equal(director.name.toString(), '`d`.`name`')
  })

})

export {
  user,
  movie,
  director
}
