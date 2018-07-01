import { find } from "lodash"

import { matchPoints } from "../../utils/points"

import { Hunch } from "../../entity/Hunch"
import { Result } from "../../entity/Result"
import { withAuth } from "../../authentication"

export const typeDefs = ``

export const query = `
  points(userId: Int!): Int!
  hunchPoints(hunchId: Int!): Int!
`

export const mutation = ``

export const resolvers = {
  Query: {
    points: withAuth(async (_, __, { user }) => {
      const results = await Result.find()
      const hunchs = await Hunch.find({ where: { user: user.id } })

      let points = 0
      results.forEach(result => {
        const hunch = find(hunchs, { match: result.match })
        if (hunch) {
          points += matchPoints(result, hunch)
        }
      })

      return points
    }),
    hunchPoints: withAuth(async (_, { hunchId }, { user }) => {
      const hunch = await Hunch.findOne({ id: hunchId, user: user.id })
      const result = await Result.findOne({ match: hunch.match.id })
      if (!result) {
        throw new Error(`Match ${hunch.match.id} doesn't have a result`)
      }

      return matchPoints(result, hunch)
    })
  },
  Mutation: {}
}
