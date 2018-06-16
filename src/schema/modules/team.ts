import { Team } from "../../entity/Team"
import { withAuth } from "../../authentication"

export const typeDefs = `
  type Team {
    id: Int
    initials: String!
    name: String!
  }

  input TeamInput {
    initials: String!
    name: String!
  }
`

export const query = `
  team(id: Int!): Team
  teams: [Team]
`

export const mutation = `
  createTeam(data: TeamInput!): Team
`

export const resolvers = {
  Query: {
    team: withAuth((_, { id }) => Team.findOneById(id)),
    teams: withAuth(() => Team.find())
  },
  Mutation: {
    createTeam: withAuth((_, { data }) => Team.create({ ...data }).save())
  }
}
