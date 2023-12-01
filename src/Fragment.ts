import { Bind } from './Bind'


class Fragment {

  name?: string
  // @ts-ignore
  sql: () => string
  strings: Array<string> = []
  values: Array<any> = []

  constructor (strings: Array<string> = [], values: Array<any> = []) {

    let { ss, vs } = strings
      // tuple of string and value
      .map((x, i) => [x, values[i]])
      // move to the string the no bind and no fragment values
      .map(([s, v]) => v && !(v instanceof Bind) && !(v instanceof Fragment) ? [s + v, undefined] : [s, v])
      // extract binds and fragments
      .flatMap(([s, v]) => {
        if(v instanceof Bind) return [[s, v.value]]
        // value is a fragment, so merge it with the current fragment
        else if(v instanceof Fragment) {
          let zip = v.strings.map((x, i) => [x, v.values[i]])
          return [[s, undefined],...zip]
        }
        // otherwise just return it
        else return [[s, v]]
      })
      // split strings and values
      .reduce<{ ss: Array<string>, vs: Array<any>, sa: string }>((acc, [s, v], i, a) => {
        // if value is undefined, so save it to concat to the next one
        if(v === undefined) {
          // if the last item, the value will always be undefined, so discard it and save the string
          if(i == a.length - 1) return { ...acc, ss: acc.ss.concat(acc.sa + s) }
          return { ...acc, sa: acc.sa + s  }
        } else {
          let na = { ss: acc.ss.concat(acc.sa + s), vs: acc.vs.concat(v), sa: '' }
          return na
        }
      }, { ss: [], vs: [], sa: '' })

    this.strings = ss
    this.values = vs

  }

  concat (fragment: Fragment | string): Fragment {

    fragment = (fragment instanceof Fragment) ? fragment : new Fragment([fragment])

    let r = new Fragment()

    let cur = this.strings.slice(-1)[0] || ''
    let concated = fragment.strings[0] || ''
    let junction = cur + concated

    r.strings = this.strings.slice(0, -1).concat(junction).concat(fragment.strings.slice(1))
    r.values = this.values.concat(fragment.values)

    return r
  }

  // for node-postgres module
  get text() {
    return this.strings.reduce((a, x, i) => a + '$' + i + x)
  }

  // pg requires a name for prepared statements
  setPreparedStatementName (name: string) {
    this.name = name
    return this
  }

}

// for mysql and mysql2 modules
Object.defineProperty(Fragment.prototype, 'sql', {
  enumerable: true,
  get() {
    return this.strings.join('?')
  }
})

export { Fragment }
