# sql-string-ts

[![npm](https://img.shields.io/npm/v/sql-string-ts.svg?maxAge=2592000)](https://www.npmjs.com/package/sql-string-ts)
[![license](https://img.shields.io/npm/l/sql-string-ts.svg?maxAge=2592000)](https://github.com/geovannyjs/sql-string-ts/blob/main/LICENSE)

A lib with some functions to make writing SQL strings easier and safer.

This lib is based in the [sql-template-strings](https://www.npmjs.com/package/sql-template-strings), I decided to write this lib mainly because the `.append` method of `sql-template-strings` is not pure.

Works with [mysql](https://www.npmjs.com/package/mysql), [mysql2](https://www.npmjs.com/package/mysql2) and [postgres](https://www.npmjs.com/package/pg)

It is not an ORM or Query Builder, it just try to rely on Typescript types to make the sql strings safer.

```js
import { table, SQL, bind } from 'sql-string-ts'

enum userColumns {
  id,
  name,
  email,
  active,
  inserted_at,
  updated_at
}

const u = table({ name: 'user', columns: userColumns, quote: '`', alias: 'u' })

const query = SQL`select ${u.name} from ${u} where ${u.id} > ${bind(5)} and ${u.active} = ${bind(true)}`

query.text   // select `u`.`name` from `user` `u` where `u`.`id` > $1 and `u`.`active` = $2
query.sql    // select `u`.`name` from `user` `u` where `u`.`id` > ? and `u`.`active` = ?
query.values // [ 5, true ]
```

## Insert

`insert` is a function to generate insert statements, to insert binded values is important to use the function `bind` (or its alias `b`), otherwise values will be treated as raw values.

```js
const query = insert(u, [u.name, b('User Name')], [u.email, b('user@email.com')], [u.active, b(true)], [u.inserted_at, 'NOW()'])

query.text   // insert into `user` `u` (`name`, `email`, `active`, `inserted_at`) values ($1, $2, $3, NOW())
query.sql    // insert into `user` `u` (`name`, `email`, `active`, `inserted_at`) values (?, ?, ?, NOW())
query.values // [ 'User Name', 'user@email.com', true ]

```

## Update

`update` is a function to generate update statements, to update binded values is important to user the function `bind` (or its alias `b`), otherwise values will be treated as raw values.

```js

const query = update(u, [u.name, bind('User New Name')], [u.updated_at, 'NOW()'])

query.text  // update `user` `u` set `name`=$1, `updated_at`=NOW()
query.sql   // update `user` `u` set `name`=?, `updated_at`=NOW()
query.values // [ 'User New Name' ]
```

## Contributing
 - Pull requests are welcome.
