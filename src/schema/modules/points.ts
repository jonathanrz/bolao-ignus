import { find } from "lodash"

import { matchPoints } from "../../utils/points"

import { User } from "../../entity/User"
import { Hunch } from "../../entity/Hunch"
import { Result } from "../../entity/Result"
import { withAuth } from "../../authentication"

export const typeDefs = `
  type UserPoint {
    name: String!
    points: Int!
  }
`

export const query = `
  points: [UserPoint!]!
  userPoints(userId: Int!): UserPoint!
  hunchPoints(hunchId: Int!): UserPoint!
`

export const mutation = ``

export const resolvers = {
  Query: {
    points: withAuth(async () => {
      const users = await User.find()
      const results = await Result.find()
      const points = []
      for (const user of users) {
        const hunchs = await Hunch.find({ where: { user: user.id } })

        let userPoints = 0
        results.forEach(result => {
          const hunch = find(hunchs, { match: result.match })
          if (hunch) {
            userPoints += matchPoints(result, hunch)
          }
        })
        points.push({ name: user.name, points: userPoints })
      }

      return points
    }),
    userPoints: withAuth(async (_, __, { user }) => {
      const results = await Result.find()
      const hunchs = await Hunch.find({ where: { user: user.id } })

      let points = 0
      results.forEach(result => {
        const hunch = find(hunchs, { match: result.match })
        if (hunch) {
          points += matchPoints(result, hunch)
        }
      })

      return { name: user.name, points }
    }),
    hunchPoints: withAuth(async (_, { hunchId }, { user }) => {
      const hunch = await Hunch.findOne({ id: hunchId, user: user.id })
      const result = await Result.findOne({ match: hunch.match.id })
      if (!result) {
        return -1
      }

      return { name: user.name, points: matchPoints(result, hunch) }
    })
  },
  Mutation: {}
}
