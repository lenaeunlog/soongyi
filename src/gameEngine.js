export const MAX_DAYS = 7

export const initialStats = {
  intellect: 20,
  fluency: 10,
  energy: 60,
  gold: 50
}

export function applyAction(stats, action, correct) {
  const mult = correct * 0.3 + 0.2

  const next = { ...stats }

  if (action === 'lit') {
    next.intellect += Math.round(25 * mult)
    next.energy -= 10
  }

  if (action === 'talk') {
    next.fluency += Math.round(25 * mult)
    next.energy -= 10
  }

  if (action === 'work') {
    next.gold += 50
    next.energy -= 15
  }

  if (action === 'rest') {
    next.energy = Math.min(100, next.energy + 35)
    next.gold -= 30
  }

  next.energy = Math.max(0, Math.min(100, next.energy))

  return next
}

export function checkEnding(stats) {
  if (
    stats.intellect >= 90 &&
    stats.fluency >= 90 &&
    stats.energy >= 50
  ) return 'success'

  if (stats.intellect >= 70 || stats.fluency >= 70) return 'neutral'

  return 'fail'
}
