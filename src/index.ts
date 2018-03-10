import "reflect-metadata"
import { GraphQLServer } from "graphql-yoga"
import { createConnection } from "typeorm"
import { schema } from "./schema"

const PORT: number = parseInt(process.env.port, 10) || 4000

createConnection().then(() => {
  const server = new GraphQLServer({ schema })
  server.start({ port: PORT }, () =>
    console.log(`Server is running on localhost:${PORT}`)
  )
})
