import { Team } from "../../entity/Team"

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
    team: (_, { id }) => Team.findOneById(id),
    teams: () => Team.find()
  },
  Mutation: {
    createTeam: (_, { data }) => Team.create({ ...data }).save()
  }
}
