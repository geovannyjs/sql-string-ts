type EnumType = Record<string, string | number>

type TableMeta <T> = {
  asBuilder?: <T>(col: ColumnMeta<T>) => string
  alias?: string
  columns: T
  name: string
  quote?: string
}

type ColumnMeta <T> = {
  name: string
  table: TableMeta <T>
}

type Columns <T> = Record<keyof T, ColumnMeta<T>>

const UNLIKELY_TABLE_NAME = '$__________SQL-STRING-TS-TABLE-META-PARAMS__________$'

// define the table type schema
const table = <T extends EnumType>(params: TableMeta<T>): Columns<T> => {

  let p: TableMeta<T> = {
    asBuilder: <T>(col: ColumnMeta<T>) => {
      let q = col.table.quote || ''
      return `${q}${col.table.alias || col.table.name}_${col.name}${q}`
    },
    ...params
  }

  let built: Columns<T> = <Columns<any>>{}

  // save table meta
  Object.defineProperty(built, UNLIKELY_TABLE_NAME, {
    enumerable: false,
    value: p
  })

  // table toString
  Object.defineProperty(built, 'toString', {
    enumerable: false,
    value: () => {
      let q = p.quote || ''
      let a = p.alias || p.name
      return `${q}${p.name}${q} ${q}${a}${q}`
    }
  })

  Object.keys(p.columns).forEach((x: keyof T) => {

    // save the column meta for each column
    built[x] = {
      name: String(x),
      table: p
    }

    // column toString
    Object.defineProperty(built[x], 'toString', {
      enumerable: false,
      value: () => {
        let q = p.quote || ''
        let a = p.alias || p.name
        return `${q}${a}${q}.${q}${String(x)}${q}`
      }
    })

  })

  return built

}

// receives a column and returns the column alias (as) generated by the default asBuild function
const as = <T>(col: ColumnMeta<T>): string => col.toString() + ' as ' + (col.table.asBuilder || (x => x.name))(col)

// receives a table type schema and returns an array of column
const columns = <T>(cols: Columns<T>): Array<ColumnMeta<T>> => Object.keys(cols).filter(x => !Number(x) && Number(x) !== 0).map(x => cols[x])

// receives a table type schame and returns its alias
const getAlias = <T>(m: Columns<T>): string | undefined => m[UNLIKELY_TABLE_NAME].alias

// receives a column and returns the column alias (as) generated by the default asBuild function
const getAs = <T>(col: ColumnMeta<T>): string => (col.table.asBuilder || (x => x.name))(col)

// receives a table type schame and returns its quote
const getQuote = <T>(m: Columns<T>): string | undefined => m[UNLIKELY_TABLE_NAME].quote

// receives a table type schema or a column and returns the item name
const name = <T>(m: Columns<T> | ColumnMeta<T>): string => {
  if(m[UNLIKELY_TABLE_NAME]) return m[UNLIKELY_TABLE_NAME].name
  else {
    let cm = m as ColumnMeta<T>
    return cm.name
  }
}

  // receives a table type schema and a new alias. Returns a new table type schema with the new alias
const setAlias = <T extends EnumType>(m: Columns<T>, a?: string): Columns<T> => {
  let previous: any = m[UNLIKELY_TABLE_NAME]
  return table<T>({ ...previous, alias: a })
}

// receives a table type schema and a new quote. Returns a new table type schema with the new quote
const setQuote = <T extends EnumType>(m: Columns<T>, q?: string): Columns<T> => {
  let previous: any = m[UNLIKELY_TABLE_NAME]
  return table<T>({ ...previous, quote: q })
}

export type {
  ColumnMeta,
  Columns
}

export {
  as,
  columns,
  getAlias,
  getAs,
  getQuote,
  name,
  setAlias,
  setQuote,
  table
}
