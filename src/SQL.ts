import type { ColumnMeta, TableColumns } from './Table'
import {
  UNLIKELY_COLUMN_NAME,
  as,
  columns
} from './Table'

import { Bind } from './Bind'
import { Fragment } from './Fragment'


const interleave = <T>(item: T, array: Array<T>): Array<T> => array.reduce<Array<T>>((acc, x, i, a) => (i == a.length - 1) ? acc.concat(x) : acc.concat(x, item), [])

const SQL = (...pieces: Array<any>): Fragment => new Fragment(pieces[0], pieces.slice(1))

const bind = (v: any): Bind => new Bind(v)

const empty: Fragment = SQL``

const insert = <T>(table: TableColumns<T>, ...cols: Array<[ColumnMeta<T>, any]>): Fragment => {

  let meta = table[UNLIKELY_COLUMN_NAME]
  let q = meta.quote || ''

  return SQL`insert into ${q}${meta.name}${q} (`
    .concat(interleave(SQL`, `, cols.map(c => SQL`${q}${c[0].name}${q}`)).reduce((a, x) => a.concat(x), empty)).concat(') values (')
    .concat(interleave(SQL`, `, cols.map(c => SQL`${c[1]}`)).reduce((a, x) => a.concat(x), empty))
    .concat(')')
}

const selectBuilder = <T>(cols: Array<ColumnMeta<T>>) => (fn: Function): Fragment => SQL`${cols.map(x => fn(x)).join(', ')}`

const select = <T>(...cols: Array<ColumnMeta<T>>): Fragment => selectBuilder(cols)(x => x.toString())

const selectAll = <T>(table: TableColumns<T>): Fragment => selectBuilder(columns(table))(x => x.toString())

const selectAs = <T>(...cols: Array<ColumnMeta<T>>): Fragment => selectBuilder(cols)(as)

const selectAllAs = <T>(table: TableColumns<T>): Fragment => selectBuilder(columns(table))(as)

const update = <T>(table: TableColumns<T>, ...cols: Array<[ColumnMeta<T>, any]>): Fragment => {

  let meta = table[UNLIKELY_COLUMN_NAME]
  let q = meta.quote || ''

  return SQL`update ${q}${meta.name}${q} set `
    .concat(interleave(SQL`, `, cols.map(x => SQL`${q}${x[0].name}${q}=${x[1]}`)).reduce<Fragment>((a, x) => a.concat(x), empty))
}

export {
  bind,
  bind as b,
  empty,
  insert,
  SQL,
  select,
  selectAll,
  selectAllAs,
  selectAs,
  update
}
