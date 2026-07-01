export const formattedTime = (value: number): string => {
  const minutes = Math.floor(value / 60)
  const seconds = value % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
