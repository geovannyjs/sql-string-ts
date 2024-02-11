# sql-string-ts

[![npm](https://img.shields.io/npm/v/sql-string-ts.svg?maxAge=2592000)](https://www.npmjs.com/package/sql-string-ts)
[![license](https://img.shields.io/npm/l/sql-string-ts.svg?maxAge=2592000)](https://github.com/geovannyjs/sql-string-ts/blob/main/LICENSE)

A lib with some functions to make writing SQL strings easier and safer.

Works with [mysql](https://www.npmjs.com/package/mysql), [mysql2](https://www.npmjs.com/package/mysql2) and [postgres](https://www.npmjs.com/package/pg)

It is not an ORM or Query Builder, it just try to rely on Typescript types to make the sql strings safer.

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

const query1 = SQL`select ${user.name} from ${user} where ${user.id} > ${bind(5)} and ${user.is_active} = ${bind(true)}`

/*

query1 generated query:
select `u`.`name` from `user` `u` where `u`.`id` > ? and `u`.`is_active` = ?

query1 generated bind values:
[ 5, true ]

*/
```

## Concat

You can use concat to combine queries.

```js

const id = 1
const email = 'user@test.com'

const base = SQL`select ${u.name} from ${u} where true`
const whereId = SQL`${u.id} = ${bind(id)}`
const whereEmail = SQL`${u.email} = ${bind(email)}`

const result = base.concat(SQL` and ${whereId} and ${whereEmail}`)

console.log(result.text)   // select `u`.`name` from `user` `u` where true and `u`.`id` = $1 and `u`.`email` = $2
console.log(result.sql)    // select `u`.`name` from `user` `u` where true and `u`.`id` = ? and `u`.`email` = ?
console.log(result.values) // [ 1, 'user@test.com' ]

```

## Insert

`insert` is a function to generate insert statements, to insert binded values is important to use the function `bind` (or its alias `b`), otherwise values will be treated as raw values.

```js
const query2 = insert([u.name, b('User Name')], [u.email, b('user@email.com')], [u.active, b(true)], [u.inserted_at, 'NOW()'])

query2.text   // insert into `user` (`name`, `email`, `active`, `inserted_at`) values ($1, $2, $3, NOW())
query2.sql    // insert into `user` (`name`, `email`, `active`, `inserted_at`) values (?, ?, ?, NOW())
query2.values // [ 'User Name', 'user@email.com', true ]

```

## Update

`update` is a function to generate update statements, to update binded values is important to user the function `bind` (or its alias `b`), otherwise values will be treated as raw values.

```js

const query3 = update([u.name, bind('User New Name')], [u.updated_at, 'NOW()'])

query3.text  // update `user` set `name`=$1, `updated_at`=NOW()
query3.sql   // update `user` set `name`=?, `updated_at`=NOW()
query3.values // [ 'User New Name' ]
```

## Note

This lib is based in the [sql-template-strings](https://www.npmjs.com/package/sql-template-strings), I decided to write this lib mainly because the `.append` method of `sql-template-strings` is not pure.

## Contributing

  - Pull requests are welcome.
