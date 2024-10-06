import _ from 'lodash'

export const sortedJSON = (object: object): object => {
  return _(object).toPairs().sortBy(0).fromPairs().value()
}
