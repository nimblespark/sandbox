type ChordTone = 1 | 3 | 5 | 7
export enum Inversion {
  Root,
  First,
  Second,
  Third,
}
export namespace Inversion {
  export function toN(inversion: Inversion): ChordTone {
    switch (inversion) {
      case Inversion.Root:
        return 1
      case Inversion.First:
        return 3
      case Inversion.Second:
        return 5
      case Inversion.Third:
        return 7
    }
  }
}
