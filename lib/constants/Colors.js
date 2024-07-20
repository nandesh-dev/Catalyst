export const Colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "sky",
  "blue",
  "purple",
  "pink",
]

export function generateRandomColor() {
  return Colors[Math.floor(Math.random() * Colors.length)]
}
