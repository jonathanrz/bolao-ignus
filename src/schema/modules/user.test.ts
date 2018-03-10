import { graphql } from "graphql"
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools"
import { typeDefs, resolvers } from "./user"

const schema = makeExecutableSchema({ typeDefs, resolvers })

const execute = query => graphql(schema, query)

setupDatabaseHooks(global)

const createUser = async email => {
  const result = await execute(`
      mutation {
        createUser(data: {
          email: "${email}"
        }) {
          id
          email
        }
      }
    `)

  if (result.errors && result.errors[0]) {
    throw result.errors[0]
  }

  return result.data.createUser
}

describe("User module", () => {
  it("creates an user", async () => {
    const user = await createUser("example@email.com")

    expect(user.id).not.toBeUndefined()
    expect(user.email).toBe("example@email.com")
  })

  it("throws an error if email already exists", async () => {
    const user1 = await createUser("example@email.com")
    return expect(createUser("example@email.com")).rejects.toBeTruthy()
  })

  it("gets an user by id", async () => {
    const user = await createUser("example@email.com")

    const result = await execute(`
      {
        user(id: ${user.id}) {
          id
          email
        }
      }
    `)

    expect(result.data.user).toEqual(user)
  })

  it("lists all users", async () => {
    const users = [
      await createUser("example1@email.com"),
      await createUser("example2@email.com")
    ]

    const result = await execute(`
      {
        users {
          id
          email
        }
      }
    `)

    expect(result.data.users).toEqual(users)
  })
})
