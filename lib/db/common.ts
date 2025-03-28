import * as _ from 'lodash-es'
import dot from 'dot-object'

export function parseData(data: any) {
  const parsedData = dot.dot(data)
  return _.omitBy(parsedData, o => _.isPlainObject(o) && _.isEmpty(o))
}
