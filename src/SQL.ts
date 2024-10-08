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

const bind = (v: any): Bind | undefined => v === undefined ? undefined : new Bind(v)

const empty: Fragment = SQL``

const insert = <T extends Columns>(maybeConf: ApplyQuote | [ColumnMeta<T>, any], ...cols: Array<[ColumnMeta<T>, any]>): Fragment => {

  let conf: ApplyQuote = { quote: true }
  let cs = cols

  if((maybeConf as ApplyQuote).quote === undefined) cs = [(maybeConf as [ColumnMeta<T>, any]), ...cols]
  else conf = (maybeConf as ApplyQuote)

  let scs = cs.filter(c => c[1] !== undefined)

  if(!scs.length) throw new Error('You should pass at least one column')

  return SQL`insert into ${table(scs[0][0].schema, conf)} (`
    .concat(interleave(SQL`, `, scs.map(c => SQL`${column(c[0], conf)}`)).reduce((a, x) => a.concat(x), empty))
    .concat(') values (')
    .concat(interleave(SQL`, `, scs.map(c => SQL`${c[1]}`)).reduce((a, x) => a.concat(x), empty))
    .concat(')')
}

const join = <A, B>(a: ColumnMeta<A>, b: ColumnMeta<B>): Fragment => SQL`join ${a.schema} on ${a} = ${b}`

const selectBuilder = (cols: Array<ColumnMeta<Columns>>) => (fn: Function): Fragment => SQL`${cols.map(x => fn(x)).join(', ')}`

const select = (maybeConf: ApplySelect | ColumnMeta<Columns>, ...cols: Array<ColumnMeta<Columns>>): Fragment => {

  let conf: ApplySelect = { as: true, prefix: true, quote: true }
  let cs = cols

  if((maybeConf as ApplySelect).as === undefined && (maybeConf as ApplySelect).prefix === undefined && (maybeConf as ApplySelect).quote === undefined)
    cs = [(maybeConf as ColumnMeta<Columns>), ...cols]
  else conf = { ...conf, ...(maybeConf as ApplySelect) }

  return selectBuilder(cs)(x => column(x, conf))
}

const selectAll = <T extends Columns>(schema: Schema<T>, maybeConf?: ApplySelect | ColumnMeta<T>, ...exclude: Array<ColumnMeta<T>>): Fragment => {

  let conf: ApplySelect = { as: true, prefix: true, quote: true }
  let cs = exclude

  if(maybeConf) {
    if((maybeConf as ApplySelect).as === undefined && (maybeConf as ApplySelect).prefix === undefined && (maybeConf as ApplySelect).quote === undefined)
      cs = [(maybeConf as ColumnMeta<T>), ...exclude]
    else conf = { ...conf, ...(maybeConf as ApplySelect) }
  }

  let excs = cs.reduce((a, x) => { a[column(x, { prefix: true })] = true; return a }, {})

  return selectBuilder(columns(schema).filter(c => !excs[column(c, { prefix: true })]))(x => column(x, conf))
}

const update = <T extends Columns>(maybeConf: ApplyQuote | [ColumnMeta<T>, any], ...cols: Array<[ColumnMeta<T>, any]>): Fragment => {

  let conf: ApplyQuote = { quote: true }
  let cs = cols

  if((maybeConf as ApplyQuote).quote === undefined) cs = [(maybeConf as [ColumnMeta<T>, any]), ...cols]
  else conf = (maybeConf as ApplyQuote)

  let scs = cs.filter(c => c[1] !== undefined)

  if(!scs.length) throw new Error('You should pass at least one column')

  return SQL`update ${table(scs[0][0].schema, conf)} set `
    .concat(interleave(SQL`, `, scs.map(x => SQL`${column(x[0], conf)}=${x[1]}`)).reduce<Fragment>((a, x) => a.concat(x), empty))
}

export {
  bind,
  bind as b,
  empty,
  insert,
  join,
  SQL,
  select,
  selectAll,
  update
}
