import { createUser, createTeam } from "./testBuilders"

const catchErrorMessage = err => Promise.reject(err.message)

declare var bootApp: any
declare var execute: any

bootApp(global)

describe("createTeam mutation", () => {
  let context

  beforeEach(async () => {
    const user = await createUser()
    context = { user }
  })

  it("creates a team", async () => {
    const team = await createTeam(
      {
        initials: "BRA",
        name: "Brasil"
      },
      context
    )

    expect(team.id).not.toBeUndefined()
    expect(team.initials).toBe("BRA")
    expect(team.name).toBe("Brasil")
  })

  it("throws an error if team already exists", () => {
    const teamData = { initials: "BRA", name: "Brasil" }

    return expect(
      Promise.all([
        createTeam(teamData, context), // force line break
        createTeam(teamData, context)
      ]).catch(catchErrorMessage)
    ).rejects.toBe(
      'duplicate key value violates unique constraint "uk_team_initials"'
    )
  })
})

describe("team query", () => {
  let context

  beforeEach(async () => {
    const user = await createUser()
    context = { user }
  })

  it("gets a team by id", async () => {
    const team = await createTeam(
      {
        initials: "BRA",
        name: "Brasil"
      },
      context
    )

    const result = await execute(
      `
      {
        team(id: ${team.id}) {
          id
          initials
          name
        }
      }
    `,
      null,
      context
    )

    expect(result.team).toEqual(team)
  })
})

describe("team query", () => {
  let context

  beforeEach(async () => {
    const user = await createUser()
    context = { user }
  })

  it("lists all teams", async () => {
    const teams = [
      await createTeam({ initials: "BRA", name: "Brasil" }, context),
      await createTeam({ initials: "ARG", name: "Argentina" }, context)
    ]

    const result = await execute(
      `
      {
        teams {
          id
          initials
          name
        }
      }
    `,
      null,
      context
    )

    expect(result.teams).toEqual(teams)
  })
})
