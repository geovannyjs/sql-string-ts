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

export {
  user,
  movie,
  director
}
