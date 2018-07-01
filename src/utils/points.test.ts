import { matchPoints } from "./points"

describe("match points", () => {
  it("returns 0 if hunch not found", () => {
    const points = matchPoints({}, null)

    expect(points).toBe(0)
  })
})
