# sql-string-ts

[![npm](https://img.shields.io/npm/v/sql-string-ts.svg?maxAge=2592000)](https://www.npmjs.com/package/sql-string-ts)
[![license](https://img.shields.io/npm/l/sql-string-ts.svg?maxAge=2592000)](https://github.com/geovannyjs/sql-string-ts/blob/main/LICENSE)

A lib with some functions to make writing SQL strings easier and safer.

Works with [mysql](https://www.npmjs.com/package/mysql), [mysql2](https://www.npmjs.com/package/mysql2) and [postgres](https://www.npmjs.com/package/pg)

It is not an ORM or Query Builder, it just try to rely on Typescript types to make the SQL strings safer.

```js
import { schema, SQL, bind } from 'sql-string-ts'

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

const q1 = SQL`select ${user.name}
from ${user}
where ${user.id} > ${bind(5)} and ${user.is_active} = ${bind(true)}`

// generated query
select `u`.`name`
from `user` `u`
where `u`.`id` > ? and `u`.`is_active` = ?

// generated bind values
[  5,  true  ]
```

So you can run the query with your favorite RDBMS/lib:
```js
mysql.query(q1)
// or
pg.query(q1)
```

### A more complex example:
```js
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

const q2 = SQL`select ${user.name}, ${movie.name}, ${director.name}
from ${user}
left join ${movie} on ${movie.id} = ${user.favorite_movie_id}
left join ${director} on ${director.id} = ${movie.director_id}
where ${user.id} = ${bind(1)}

// generated query
select `u`.`name`, `m`.`name`, `d`.`name`
from `user` `u`
left join `movie` `m` on `m`.`id` = `u`.`favorite_movie_id`
left join `director` `d` on `d`.`id` = `m`.`director_id`
where `u`.`id` = ?

// generated bind values
[ 1 ]
```

## Fragments

**concat**
You can use the concat method to combine queries fragments.
```js
const id = 1
const email = 'user@test.com'

const base = SQL`select ${u.name} from ${u} where true`
const whereId = SQL`${u.id} = ${bind(id)}`
const whereEmail = SQL`${u.email} = ${bind(email)}`

const q3 = base.concat(SQL` and ${whereId} and ${whereEmail}`)

// generated query
select `u`.`name` from `user` `u` where true and `u`.`id` = ? and `u`.`email` = ?

// generated bind values
[ 1, 'user@test.com' ]
```

## Functions

**table**
Receives a schema an returns its table name.
```js
table(user) // user
table(user, { alias: true }) // user u
table(user, { quote: true }) // `user`
table(user, { alias: true, quote: true }) // `user` `u`
```

**column**
Receives a column an returns its name.
```js
column(user.email) // email
column(user.email, { as: true }) // email as u_email
column(user.email, { prefix: true }) // u.email
column(user.email, { quote: true }) // `email`
column(user.email, { as: true, prefix: true, quote: true }) // `u`.`email` as `u_email`
```

**insert**
`insert` is a function to generate insert statements, to insert binded values is important to use the function `bind` (or its alias `b`), otherwise values will be treated as raw values.
```js
const q4 = insert([u.name, b('User Name')], [u.email, b('user@email.com')], [u.active, b(true)], [u.inserted_at, 'NOW()'])

// generated query
insert into `user` (`name`, `email`, `active`, `inserted_at`) values (?, ?, ?, NOW())

// generated bind values
[ 'User Name', 'user@email.com', true ]
```

**update**
`update` is a function to generate update statements, to update binded values is important to user the function `bind` (or its alias `b`), otherwise values will be treated as raw values.

```js
const q5 = update([u.name, bind('User New Name')], [u.updated_at, 'NOW()'])

// generated query
update `user` set `name`=?, `updated_at`=NOW()

// generated bind values
[ 'User New Name' ]
```

## Note

This lib is based in the [sql-template-strings](https://www.npmjs.com/package/sql-template-strings), I decided to write this lib mainly because the `.append` method of `sql-template-strings` is not pure.

## Contributing

  - Pull requests are welcome.
