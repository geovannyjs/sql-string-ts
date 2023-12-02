# sql-string-ts

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

console.log(query.sql)
// select `u`.`name` from `user` `u` where `u`.`id` > ? and `u`.`active` = ?

console.log(query.values)
//[ 5, true ]
```
