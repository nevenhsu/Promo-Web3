import * as _ from 'lodash-es'
import { Types } from 'mongoose'
import dot from 'dot-object'

function transformObjectIds(obj: any): any {
  return _.cloneDeepWith(obj, value => {
    if (value instanceof Types.ObjectId) {
      return value.toString()
    }
  })
}

export function parseData(data: any) {
  const transformedData = transformObjectIds(data)
  const parsedData = dot.dot(transformedData)
  return _.omitBy(parsedData, o => _.isPlainObject(o) && _.isEmpty(o))
}
