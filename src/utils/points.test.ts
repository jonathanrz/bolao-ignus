import { matchPoints } from "./points"
import { Result } from "../entity/Result"
import { Hunch } from "../entity/Hunch"
import { Match } from "../entity/Match"

const defaultMatch = new Match()
defaultMatch.id = 1

const buildResult = (score1, score2, match = defaultMatch): Result => {
  const result = new Result()
  result.team1Score = score1
  result.team2Score = score2
  result.match = match
  return result
}
const buildHunch = (score1, score2, match = defaultMatch): Hunch => {
  const hunch = new Hunch()
  hunch.team1Score = score1
  hunch.team2Score = score2
  hunch.match = match
  return hunch
}

describe("match points", () => {
  it("returns 0 if hunch not found", () => {
    const points = matchPoints({}, null)

    expect(points).toBe(0)
  })

  it("returns 5 if hunch is equal result", () => {
    expect(matchPoints(buildResult(0, 0), buildHunch(0, 0))).toBe(5)
    expect(matchPoints(buildResult(1, 0), buildHunch(1, 0))).toBe(5)
    expect(matchPoints(buildResult(0, 2), buildHunch(0, 2))).toBe(5)
  })

  it("returns 2 if winner is correct", () => {
    expect(matchPoints(buildResult(3, 1), buildHunch(1, 0))).toBe(2)
    expect(matchPoints(buildResult(2, 5), buildHunch(0, 2))).toBe(2)
  })

  it("returns 1 if goal difference is correct", () => {
    expect(matchPoints(buildResult(0, 1), buildHunch(1, 0))).toBe(1)
  })

  it("returns 3 if hunch and result is draw", () => {
    expect(matchPoints(buildResult(0, 0), buildHunch(1, 1))).toBe(3)
  })

  it("returns 3 if winner and goal difference is correct", () => {
    expect(matchPoints(buildResult(2, 0), buildHunch(4, 2))).toBe(3)
    expect(matchPoints(buildResult(1, 2), buildHunch(0, 1))).toBe(3)
  })

  it("returns 1 if one of the scores is correct", () => {
    expect(matchPoints(buildResult(1, 0), buildHunch(1, 3))).toBe(1)
  })

  it("returns 2 if one of the scores and the goal difference is correct", () => {
    expect(matchPoints(buildResult(1, 0), buildHunch(1, 2))).toBe(2)
  })

  it("returns 3 if winner and one of the scores is correct", () => {
    expect(matchPoints(buildResult(2, 0), buildHunch(3, 0))).toBe(3)
  })
})
