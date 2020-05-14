export const save = (key, value) => localStorage.setItem(key, value || '')
export const cache = (key) => localStorage.getItem(key)

