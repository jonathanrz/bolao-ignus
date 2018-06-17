import { Team } from "../../entity/Team"
import { Match } from "../../entity/Match"
import { withAuth } from "../../authentication"

export const typeDefs = `
  type Match {
    id: Int
    date: Int
    team1: Team
    team2: Team
  }

  input MatchInput {
    date: Int!
    team1Initials: String!
    team2Initials: String!
  }
`

export const query = `
  matchs: [Match]
  match(id: Int!): Match
`

export const mutation = `
  createMatch(data: MatchInput!): Match
  updateMatch(id: Int!, data: MatchInput!): Match
`

export const resolvers = {
  Query: {
    matchs: withAuth(() => Match.find()),
    match: withAuth((_, { id }) => Match.findOneById(id))
  },
  Mutation: {
    createMatch: withAuth(async (_, { data }) => {
      const team1: Team = await Team.findOne({ initials: data.team1Initials })
      if (team1 == null) {
        throw new Error(`Team ${data.team1Initials} not found`)
      }
      const team2: Team = await Team.findOne({ initials: data.team2Initials })
      if (team2 == null) {
        throw new Error(`Team ${data.team1Initials} not found`)
      }
      const match = Match.create({
        date: data.date,
        team1: { ...team1 },
        team2: { ...team2 }
      })
      return match.save()
    }),
    updateMatch: withAuth(async (_, { id, data }) => {
      const team1: Team = await Team.findOne({ initials: data.team1Initials })
      if (team1 == null) {
        throw new Error(`Team ${data.team1Initials} not found`)
      }
      const team2: Team = await Team.findOne({ initials: data.team2Initials })
      if (team2 == null) {
        throw new Error(`Team ${data.team1Initials} not found`)
      }
      Match.update(
        { id },
        {
          date: data.date,
          team1: { ...team1 },
          team2: { ...team2 }
        }
      )
      return Match.findOne({ id })
    })
  }
}
