import { Result } from "../../entity/Result"
import { Match } from "../../entity/Match"
import { withAuth } from "../../authentication"

export const typeDefs = `
  type Result {
    id: Int
    team1Score: Int
    team2Score: Int
    match: Match
  }

  input ResultInput {
    team1Score: Int
    team2Score: Int
    matchId: Int
  }
`

export const query = `
  results: [Result]
  result(id: Int!): Result
`

export const mutation = `
  createResult(data: ResultInput!): Result
`

export const resolvers = {
  Query: {
    results: withAuth(() => Result.find()),
    result: withAuth((_, { id }) => Result.findOne({ id }))
  },
  Mutation: {
    createResult: withAuth(async (_, { data }) => {
      const match: Match = await Match.findOneById(data.matchId)
      if (match == null) {
        throw new Error(`Match ${data.matchId} not found`)
      }
      const result: Result = await Result.findOne({ match: match.id })
      if (result == null) {
        const newResult = Result.create({
          team1Score: data.team1Score,
          team2Score: data.team2Score,
          match: { ...match }
        })
        return newResult.save()
      } else {
        Result.update(
          { id: result.id, match: match.id },
          { team1Score: data.team1Score, team2Score: data.team2Score }
        )
        return Result.findOneById(result.id)
      }
    })
  }
}
