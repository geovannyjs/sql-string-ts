import { ApplyAlias, ApplyAs, ApplyPrefix, ApplyQuote } from './Apply'


type Columns = Record<string, string | number>

type SchemaChangeableConfig = {
  alias?: string
  quote?: string
}

type SchemaConfig <T> = {
  columns: T
  table: string
} & SchemaChangeableConfig

type ColumnMeta <T> = {
  name: string
  schema: Schema <T>
}

type Schema <T> = Record<keyof T, ColumnMeta<T>>

// to prevent colision with columns
const UNLIKELY_COLUMN_NAME = '"!@#$%&*()-_=+\|,<.>;:/?'

// return schema config
const config = <T>(schema: Schema<T>): SchemaConfig<T> => schema[UNLIKELY_COLUMN_NAME]

const asBuilder = <T extends Columns>(col: ColumnMeta<T>): string => {
  let m: SchemaConfig<T> = config(col.schema)
  let prefix = m.alias || m.table
  return `${prefix}_${col.name}`
}

const column = <T extends Columns>(col: ColumnMeta<T>, cfg?: ApplyAs & ApplyPrefix & ApplyQuote): string => {
  let m: SchemaConfig<T> = config(col.schema)
  let q = cfg && cfg.quote === true && m.quote ? m.quote : ''
  let prefix = cfg && cfg.prefix === true ? `${q}${m.alias || m.table}${q}.` : ''
  return `${prefix}${q}${col.name}${q}` + ((cfg && cfg.as === true) ? ` as ${q}${asBuilder(col)}${q}` : '')
}

const table = <T extends Columns>(schema: Schema<T>, cfg?: ApplyAlias & ApplyQuote): string => {
  let m: SchemaConfig<T> = config(schema)
  let q = cfg && cfg.quote === true && m.quote ? m.quote : ''
  return cfg && cfg.alias === true && m.alias ? `${q}${m.table}${q} ${q}${m.alias}${q}` : `${q}${m.table}${q}`
}

const schema = <T extends Columns>(cfg: SchemaConfig<T>): Schema<T> => {

  let built: Schema<T> = <Schema<any>>{}

  // save schema meta
  Object.defineProperty(built, UNLIKELY_COLUMN_NAME, {
    enumerable: false,
    value: cfg
  })

  // table toString
  Object.defineProperty(built, 'toString', {
    enumerable: false,
    value: () => table(built, { alias: true, quote: true })
  })

  Object.keys(cfg.columns).forEach((x: keyof T) => {

    // save the column meta for each column
    built[x] = {
      name: String(x),
      schema: built
    } as ColumnMeta<T>

    // column toString
    Object.defineProperty(built[x], 'toString', {
      enumerable: false,
      value: () => column(built[x], { as: false, prefix: true, quote: true })
    })

  })

  return built

}

// receives a column and returns its generated as
const as = <T extends Columns>(col: ColumnMeta<T>): string => asBuilder(col)

// receives a type schema and returns an array of columns
const columns = <T extends Columns>(cols: Schema<T>): Array<ColumnMeta<T>> => Object.keys(cols).filter(x => !Number(x) && Number(x) !== 0).map(x => cols[x])

// receives a schema and a new config. Returns a new schema with the new configs applied
const set = <T extends Columns>(old: Schema<T>, cfg: SchemaChangeableConfig): Schema<T> => {
  let m: SchemaConfig<T> = config(old)
  return schema<T>({ ...m, ...cfg })
}

export type {
  ColumnMeta,
  Columns,
  Schema
}

export {
  as,
  column, column as c,
  columns,
  config,
  schema,
  set,
  table, table as t
}
