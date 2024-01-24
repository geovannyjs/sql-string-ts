import {
  ColumnMeta,
  Columns,
  Schema,
  column,
  columns,
  table
} from './Schema'

import { Bind } from './Bind'
import { Fragment } from './Fragment'
import { ApplyAs, ApplyPrefix, ApplyQuote } from './Apply'


type ApplySelect = ApplyAs & ApplyPrefix & ApplyQuote

const interleave = <T>(item: T, array: Array<T>): Array<T> => array.reduce<Array<T>>((acc, x, i, a) => (i == a.length - 1) ? acc.concat(x) : acc.concat(x, item), [])

const SQL = (...pieces: Array<any>): Fragment => new Fragment(pieces[0], pieces.slice(1))

const bind = (v: any): Bind => new Bind(v)

const empty: Fragment = SQL``

const insert = <T extends Columns>(schema: Schema<T>, maybeConf: ApplyQuote | [ColumnMeta<T>, any], ...cols: Array<[ColumnMeta<T>, any]>): Fragment => {

  let conf: ApplyQuote = { quote: true }
  let cs = cols

  if((maybeConf as ApplyQuote).quote === undefined) cs = [(maybeConf as [ColumnMeta<T>, any]), ...cols]
  else conf = (maybeConf as ApplyQuote)

  return SQL`insert into ${table(schema, conf)} (`
    .concat(interleave(SQL`, `, cs.map(c => SQL`${column(c[0], conf)}`)).reduce((a, x) => a.concat(x), empty))
    .concat(') values (')
    .concat(interleave(SQL`, `, cs.map(c => SQL`${c[1]}`)).reduce((a, x) => a.concat(x), empty))
    .concat(')')
}

const selectBuilder = <T>(cols: Array<ColumnMeta<T>>) => (fn: Function): Fragment => SQL`${cols.map(x => fn(x)).join(', ')}`

const select = <T>(maybeConf: ApplySelect | ColumnMeta<T>, ...cols: Array<ColumnMeta<T>>): Fragment => {

  let conf: ApplySelect = { as: true, prefix: true, quote: true }
  let cs = cols

  if((maybeConf as ApplySelect).as === undefined && (maybeConf as ApplySelect).prefix === undefined && (maybeConf as ApplySelect).quote === undefined)
    cs = [(maybeConf as ColumnMeta<T>), ...cols]
  else conf = { ...conf, ...(maybeConf as ApplySelect) }

  return selectBuilder(cs)(x => column(x, conf))
}

const selectAll = <T extends Columns>(schema: Schema<T>, maybeConf?: ApplySelect | ColumnMeta<T>, ...excs: Array<ColumnMeta<T>>): Fragment => {

  let conf: ApplySelect = { as: true, prefix: true, quote: true }
  let cs = excs

  if(maybeConf) {
    if((maybeConf as ApplySelect).as === undefined && (maybeConf as ApplySelect).prefix === undefined && (maybeConf as ApplySelect).quote === undefined)
      cs = [(maybeConf as ColumnMeta<T>), ...excs]
    else conf = { ...conf, ...(maybeConf as ApplySelect) }
  }

  return selectBuilder(columns(schema))(x => column(x, conf))
}

const update = <T extends Columns>(schema: Schema<T>, maybeConf: ApplyQuote | [ColumnMeta<T>, any], ...cols: Array<[ColumnMeta<T>, any]>): Fragment => {

  let conf: ApplyQuote = { quote: true }
  let cs = cols

  if((maybeConf as ApplyQuote).quote === undefined) cs = [(maybeConf as [ColumnMeta<T>, any]), ...cols]
  else conf = (maybeConf as ApplyQuote)

  return SQL`update ${table(schema, conf)} set `
    .concat(interleave(SQL`, `, cs.map(x => SQL`${column(x[0], conf)}=${x[1]}`)).reduce<Fragment>((a, x) => a.concat(x), empty))
}

export {
  bind,
  bind as b,
  empty,
  insert,
  SQL,
  select,
  selectAll,
  update
}
