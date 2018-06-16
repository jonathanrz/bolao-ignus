import { createTeam } from "./testBuilders"

const catchErrorMessage = err => Promise.reject(err.message)

declare var bootApp: any
declare var execute: any

bootApp(global)

describe("createTeam mutation", () => {
  it("creates a team", async () => {
    const team = await createTeam({
      initials: "BRA",
      name: "Brasil"
    })

    expect(team.id).not.toBeUndefined()
    expect(team.initials).toBe("BRA")
    expect(team.name).toBe("Brasil")
  })

  it("throws an error if team already exists", () => {
    const teamData = { initials: "BRA", name: "Brasil" }

    return expect(
      Promise.all([
        createTeam(teamData), // force line break
        createTeam(teamData)
      ]).catch(catchErrorMessage)
    ).rejects.toBe(
      'duplicate key value violates unique constraint "uk_team_initials"'
    )
  })
})

describe("team query", () => {
  it("gets a team by id", async () => {
    const team = await createTeam({
      initials: "BRA",
      name: "Brasil"
    })

    const result = await execute(`
      {
        team(id: ${team.id}) {
          id
          initials
          name
        }
      }
    `)

    expect(result.team).toEqual(team)
  })
})

describe("team query", () => {
  it("lists all teams", async () => {
    const teams = [
      await createTeam({ initials: "BRA", name: "Brasil" }),
      await createTeam({ initials: "ARG", name: "Argentina" })
    ]

    const result = await execute(`
      {
        teams {
          id
          initials
          name
        }
      }
    `)

    expect(result.teams).toEqual(teams)
  })
})
