import { Hunch } from "../../entity/Hunch"
import { Match } from "../../entity/Match"
import { User } from "../../entity/User"
import { withAuth } from "../../authentication"

export const typeDefs = `
  type Hunch {
    id: Int
    team1Score: Int
    team2Score: Int
    match: Match
    user: User
  }

  input HunchInput {
    team1Score: Int
    team2Score: Int
    matchId: Int
  }
`

export const query = `
  hunchs: [Hunch]
  hunch(id: Int!): Hunch
`

export const mutation = `
  createHunch(data: HunchInput!): Hunch
`

export const resolvers = {
  Query: {
    hunchs: withAuth(() => Hunch.find()),
    hunch: withAuth((_, { id }) => Hunch.findOneById(id))
  },
  Mutation: {
    createHunch: withAuth(async (_, { data }, { user }) => {
      const match: Match = await Match.findOneById(data.matchId)
      if (match == null) {
        throw new Error(`Match ${data.matchId} not found`)
      }
      const hunch: Hunch = await Hunch.findOne({
        match: match.id,
        user: user.id
      })
      if (hunch == null) {
        const newHunch = Hunch.create({
          team1Score: data.team1Score,
          team2Score: data.team2Score,
          match: { ...match },
          user: { ...user }
        })
        return newHunch.save()
      } else {
        Hunch.update(
          { id: hunch.id, match: match.id, user: user.id },
          { team1Score: data.team1Score, team2Score: data.team2Score }
        )
        return Hunch.findOneById(hunch.id)
      }
    })
  }
}
