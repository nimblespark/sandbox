import { NoteNumber } from "./NoteNumber"

export type Letter = "A" | "B" | "C" | "D" | "E" | "F" | "G"
export namespace Letter {
  export const validLetters: Letter[] = ["A", "B", "C", "D", "E", "F", "G"]
  export function random(): Letter {
    return validLetters[Math.floor(Math.random() * 7)]
  }
  export function toNoteNumber(letter: Letter): NoteNumber {
    switch (letter) {
      case "C":
        return 0
      case "D":
        return 2
      case "E":
        return 4
      case "F":
        return 5
      case "G":
        return 7
      case "A":
        return 9
      case "B":
        return 11
    }
  }
  export function next(letter: Letter): Letter {
    switch (letter) {
      case "C":
        return "D"
      case "D":
        return "E"
      case "E":
        return "F"
      case "F":
        return "G"
      case "G":
        return "A"
      case "A":
        return "B"
      case "B":
        return "C"
    }
  }

  export function shift(number: number, letter: Letter): Letter {
    switch (number) {
      case 0:
        return letter
      default:
        return shift(number - 1, next(letter))
    }
  }
}
