import { User } from "../../entity/User"

export const typeDefs = `
  type User {
    id: Int
    email: String
  }

  type Query {
    user(id: Int!): User
    users: [User]
  }

  type Mutation {
    createUser(data: UserInput!): User
  }

  input UserInput {
    email: String!
  }
`

export const resolvers = {
  Query: {
    user: (_, { id }) => User.findOneById(id),
    users: () => User.find()
  },
  Mutation: {
    createUser: (_, { data }) => User.create({ ...data }).save()
  }
}
