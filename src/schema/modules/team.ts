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
  updateTeam(id: Int!, data: TeamInput!): Team
`

export const resolvers = {
  Query: {
    teams: withAuth(() => Team.find()),
    team: withAuth((_, { id }) => Team.findOneById(id))
  },
  Mutation: {
    createTeam: withAuth((_, { data }) => Team.create({ ...data }).save()),
    updateTeam: withAuth((_, { id, data }, { user }) => {
      Team.update({ id }, { ...data })
      return Team.findOne({ id })
    })
  }
}
