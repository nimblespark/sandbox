export enum Accidental {
  Natural = 0,
  Sharp = 1,
  Flat = -1,
  DoubleSharp = 2,
  DoubleFlat = -2,
}
export namespace Accidental {
  export function toDisplayString(accidental: Accidental) {
    switch (accidental) {
      case Accidental.Natural:
        return ""
      case Accidental.DoubleFlat:
        return "bb"
      case Accidental.Flat:
        return "b"
      case Accidental.Sharp:
        return "#"
      case Accidental.DoubleSharp:
        return "##"
    }
  }
  export function fromString(str: string) {
    switch (str) {
      case "b":
        return Accidental.Flat
      case "bb":
        return Accidental.DoubleFlat
      case "#":
        return Accidental.Sharp
      case "##":
        return Accidental.DoubleSharp
      default:
        throw new Error(`Accidental was ${str}`)
    }
  }
  export function toABC(acc: Accidental) {
    switch (acc) {
      case Accidental.DoubleFlat:
        return "__"
      case Accidental.Flat:
        return "_"
      case Accidental.DoubleSharp:
        return "^^"
      case Accidental.Sharp:
        return "^"
      default:
        return ""
    }
  }
}
