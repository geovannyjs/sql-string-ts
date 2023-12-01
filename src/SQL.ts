import type { ColumnMeta, Columns } from './Table'
import {
  as,
  columns,
  name
} from './Table'

import { Bind } from './Bind'
import { Fragment } from './Fragment'


const interleave = <T>(item: T, array: Array<T>): Array<T> => array.reduce<Array<T>>((acc, x, i, a) => (i == a.length - 1) ? acc.concat(x) : acc.concat(x, item), [])

const SQL = (...pieces: Array<any>): Fragment => new Fragment(pieces[0], pieces.slice(1))

const bind = (v: any): Bind => new Bind(v)

const empty: Fragment = SQL``

const insert = <T>(table: Columns<T>, ...cols: Array<[ColumnMeta<T>, any]>): Fragment => SQL`insert into ${table} (`
  .concat(interleave(SQL`, `, cols.map(c => SQL`${name(c[0])}`)).reduce((a, x) => a.concat(x), empty)).concat(') values (')
  .concat(interleave(SQL`, `, cols.map(c => SQL`${bind(c[1])}`)).reduce((a, x) => a.concat(x), empty))
  .concat(')')

const selectBuilder = <T>(cols: Array<ColumnMeta<T>>) => (fn: Function): Fragment => SQL`${cols.map(x => fn(x)).join(', ')}`

const select = <T>(...cols: Array<ColumnMeta<T>>): Fragment => selectBuilder(cols)(name)

const selectAll = <T>(table: Columns<T>): Fragment => selectBuilder(columns(table))(name)

const selectAs = <T>(...cols: Array<ColumnMeta<T>>): Fragment => selectBuilder(cols)(as)

const selectAllAs = <T>(table: Columns<T>): Fragment => selectBuilder(columns(table))(as)

const update = <T>(table: Columns<T>, ...cols: Array<[ColumnMeta<T>, any]>): Fragment => SQL`update ${table} set `
  .concat(interleave(SQL`, `, cols.map(x => SQL`${name(x[0])}=${bind(x[1])}`)).reduce<Fragment>((a, x) => a.concat(x), empty))

export {
  bind,
  empty,
  insert,
  SQL,
  select,
  selectAll,
  selectAllAs,
  selectAs,
  update
}
