import { expect, test } from "vitest"
import { rollDice, runGame } from "./monopoly/Monopoly"

test("roll dice", () => {
  const dice = rollDice()
  console.log(dice)
  expect(dice.total >= 2 && dice.total <= 12).toBe(true)
})

test("run game", () => {
  runGame(100)
})
