# sql-string-ts

A lib with some functions to make writing SQL strings easier and safer.

This lib is based in the [sql-template-strings](https://www.npmjs.com/package/sql-template-strings), I decided to write this lib mainly because the `.append` method of `sql-template-strings` is not pure.

Works with [mysql](https://www.npmjs.com/package/mysql), [mysql2](https://www.npmjs.com/package/mysql2) and [postgres](https://www.npmjs.com/package/pg)

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
query.values //[ 5, true ]
```

## Insert

`insert` is a function to generate insert statements, to insert binded values is important to use the function `bind` (or the alias `b`), otherwise values will be treated as raw values.

```js
const query2 = insert(u, [u.name, b('User Name')], [u.email, b('user@email.com')], [u.active, b(true)], [u.inserted_at, 'NOW()'])

query2.text   // insert into `user` `u` (`name`, `email`, `active`, `inserted_at`) values ($1, $2, $3, NOW())
query2.sql    // insert into `user` `u` (`name`, `email`, `active`, `inserted_at`) values (?, ?, ?, NOW())
query2.values // [ 'User Name', 'user@email.com', true ]

```

## Contributing
 - Pull requests are welcome.
