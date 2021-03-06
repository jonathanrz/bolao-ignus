import * as jwt from "jwt-simple"
import { User } from "../../entity/User"

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME!!!"
const canCreateUser = process.env.NODE_ENV === "test"

export const typeDefs = `
  type User {
    id: Int
    name: String!
    email: String!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }
`

export const query = `
  me: User
  user(id: Int!): User
  users: [User]
`

export const mutation = `
  ${canCreateUser ? "createUser(data: UserInput!): User" : ""}
  login(email: String!, password: String!): String
`

const mutations: any = {
  login: async (_, { email, password }) => {
    const user = await User.findOne({ email })

    if (user && (await user.validatePassword(password))) {
      return jwt.encode({ id: user.id }, JWT_SECRET)
    }

    throw new Error("Unauthorized")
  }
}

if (canCreateUser) {
  mutations.createUser = (_, { data }) => User.create({ ...data }).save()
}

export const resolvers = {
  Query: {
    user: (_, { id }) => User.findOneById(id),
    users: () => User.find(),
    me: (_, __, { user }) => user
  },
  Mutation: mutations
}
