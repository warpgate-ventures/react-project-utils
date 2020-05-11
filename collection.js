export const toObject = list => list.reduce((prev, f) => {
  return { ...prev, [f.id]: f }
}, {})

export const without = (list, cache) => list.filter(f => !cache[f.id])

