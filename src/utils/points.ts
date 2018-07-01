export function matchPoints(result, hunch) {
  if (!result || !hunch) {
    return 0
  }

  if (
    hunch.team1Score === result.team1Score &&
    hunch.team2Score === result.team2Score
  ) {
    return 5
  }

  let points = 0

  const resultDiff = result.team1Score - result.team2Score
  const hunchDiff = hunch.team1Score - hunch.team2Score

  // winner or draw
  if (
    resultDiff === hunchDiff ||
    (resultDiff < 0 && hunchDiff < 0) ||
    (resultDiff > 0 && hunchDiff > 0)
  ) {
    points += 2
  }

  // goal difference
  if (Math.abs(resultDiff) === Math.abs(hunchDiff)) {
    points += 1
  }

  // one of the scores
  if (
    result.team1Score === hunch.team1Score ||
    result.team2Score === hunch.team2Score
  ) {
    points += 1
  }

  return points
}
