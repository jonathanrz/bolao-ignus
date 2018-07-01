import { find } from "lodash"

import { matchPoints } from "../../utils/points"

import { Hunch } from "../../entity/Hunch"
import { Result } from "../../entity/Result"
import { withAuth } from "../../authentication"

export const typeDefs = ``

export const query = `
  points(userId: Int!): Int
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
    })
  },
  Mutation: {}
}
