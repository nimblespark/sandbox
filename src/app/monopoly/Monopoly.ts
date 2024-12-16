/**
 * Represents the two possible strategies:
 *
 * Strategy A)  If you have a Get Out of Jail Free card, you must use it immediately.  If you don’t have the card, then you should immediately assume you would have paid the $50 fine and gotten out of jail immediately.
 *
 * Strategy B) If you have a Get Out of Jail Free card, you must use it immediately.  If you don’t have the card, then try to roll doubles for your next three turns to see if you can get out of jail that way.  If you have not gotten out of jail after three turns, assume you would have paid the $50 fine on the fourth term and get out of jail on that turn.
 */
export enum Strategy {
  A,
  B,
}

/**
 * Represents all of the possible monopolhy squares
 */
export enum Square {
  GO,
  MEDITERRANEAN_AVENUE,
  COMMUNITY_CHEST_1,
  BALTIC_AVENUE,
  INCOME_TAX,
  READING_RAILROAD,
  ORIENTAL_AVENUE,
  CHANCE_1,
  VERMONT_AVENUE,
  CONNECTICUT_AVENUE,
  JAIL,
  ST_CHARLES_PLACE,
  ELECTRIC_COMPANY,
  STATES_AVENUE,
  VIRGINIA_AVENUE,
  PENNSYLVANIA_RAILROAD,
  ST_JAMES_PLACE,
  COMMUNITY_CHEST_2,
  TENNESSEE_AVENUE,
  NEW_YORK_AVENUE,
  FREE_PARKING,
  KENTUCKY_AVENUE,
  CHANCE_2,
  INDIANA_AVENUE,
  ILLINOIS_AVENUE,
  B_AND_O_RAILROAD,
  ATLANTIC_AVENUE,
  VENTNOR_AVENUE,
  WATER_WORKS,
  MARVIN_GARDENS,
  GO_TO_JAIL,
  PACIFIC_AVENUE,
  NORTH_CAROLINA_AVENUE,
  COMMUNITY_CHEST_3,
  PENNSYLVANIA_AVENUE,
  SHORT_LINE,
  CHANCE_3,
  PARK_PLACE,
  LUXURY_TAX,
  BOARDWALK,
}

/**
 * Represents the Community Chest Cards
 */
enum CommunityChest {
  ADVANCE_TO_GO,
  BANK_ERROR_IN_YOUR_FAVOR,
  DOCTORS_FEE,
  SALE_OF_STOCK,
  GET_OUT_OF_JAIL_FREE,
  GO_TO_JAIL,
  HOLIDAY_FUND_MATURES,
  INCOME_TAX_REFUND,
  BIRTHDAY,
  LIFE_INSURANCE_MATURES,
  HOSPITAL_FEES,
  SCHOOL_FEES,
  CONSULTANCY_FEE,
  STREET_REPAIR,
  BEAUTY_CONTEST,
  INHERITANCE,
}

/**
 * Represents the Chance Cards
 */
enum Chance {
  ADVANCE_TO_BOARDWALK,
  ADVANCE_TO_GO,
  ADVANCE_TO_ILLINOIS_AVENUE,
  ADVANCE_TO_ST_CHARLES_PLACE,
  ADVANCE_TO_NEAREST_RAILROAD_1,
  ADVANCE_TO_NEAREST_RAILROAD_2,
  ADVANCE_TO_NEAREST_UTILITY,
  BANK_DIVIDEND,
  GET_OUT_OF_JAIL_FREE,
  GO_BACK_THREE_SPACES,
  GO_TO_JAIL,
  GENERAL_REPAIRS,
  SPEEDING_FINE,
  TAKE_TRIP_TO_READING_RAILROAD,
  ELECTED_CHAIRMAN,
  BUILDING_LOAN_MATURES,
}

/**
 * Recursively finds the next utility
 * @param square
 * @returns the square with the nearest utility
 */
function findNearestUtility(square: Square): Square {
  if (square === Square.WATER_WORKS || square === Square.ELECTRIC_COMPANY)
    return square
  else return findNearestUtility((square + 1) % 40)
}

/**
 * Recursively finds the next railroad
 * @param square
 * @returns the square with the nearest railroad
 */
function findNearestRailroad(square: Square): Square {
  if (
    square === Square.B_AND_O_RAILROAD ||
    square === Square.READING_RAILROAD ||
    square === Square.PENNSYLVANIA_RAILROAD ||
    square === Square.SHORT_LINE
  )
    return square
  else return findNearestRailroad((square + 1) % 40)
}

/**
 * Models the rolling of a pair of dice
 * @returns the number rolled by the dice (2 to 12)
 */
export function rollDice() {
  const firstDie = Math.floor(Math.random() * 6) + 1
  const secondDie = Math.floor(Math.random() * 6) + 1
  //console.log(firstDie, secondDie)

  return { total: firstDie + secondDie, isDoubles: firstDie === secondDie }
}

/**
 * The main function that runs a monopoly game
 * @param turns # of turns
 * @param strategy the strategy used to get out of jail
 * @returns the list of squares landed on in order
 */
export function runGame(turns: number, strategy?: Strategy) {
  /**
   * Models drawing a community chest card
   * @param square
   * @returns square to travel to
   */
  function drawCommunityChest(square: Square) {
    const card = communityChestCards.splice(
      Math.floor(Math.random() * chanceCards.length),
      1
    )[0]
    // console.log(
    //   "community chest card:",
    //   Object.values(CommunityChest)[card as number]
    // )
    switch (card) {
      case CommunityChest.ADVANCE_TO_GO:
        return Square.GO
      case CommunityChest.GET_OUT_OF_JAIL_FREE: {
        getOutOfJails++
        return square
      }
      case CommunityChest.GO_TO_JAIL:
        return Square.JAIL
      default:
        return square
    }
  }

  /**
   * Models drawing a chance card
   * @param square
   * @returns square to travel to
   */
  function drawChance(square: Square): Square {
    const card = chanceCards.splice(
      Math.floor(Math.random() * chanceCards.length),
      1
    )[0]
    // console.log("chance card:", Object.values(Chance)[card as number])
    switch (card) {
      case Chance.ADVANCE_TO_BOARDWALK:
        return Square.BOARDWALK
      case Chance.ADVANCE_TO_GO:
        return Square.GO
      case Chance.ADVANCE_TO_ILLINOIS_AVENUE:
        return Square.ILLINOIS_AVENUE
      case Chance.ADVANCE_TO_ST_CHARLES_PLACE:
        return Square.ST_CHARLES_PLACE
      case Chance.ADVANCE_TO_NEAREST_RAILROAD_1:
      case Chance.ADVANCE_TO_NEAREST_RAILROAD_2:
        return findNearestRailroad(square)
      case Chance.ADVANCE_TO_NEAREST_UTILITY:
        return findNearestUtility(square)
      case Chance.GET_OUT_OF_JAIL_FREE: {
        getOutOfJails++
        return square
      }
      case Chance.GO_BACK_THREE_SPACES:
        return (square - 3) % 40
      case Chance.GO_TO_JAIL:
        return Square.JAIL
      case Chance.TAKE_TRIP_TO_READING_RAILROAD:
        return Square.READING_RAILROAD
      default:
        return square
    }
  }

  /**
   * Models the portion of a turn after rolling the dice
   * @param diceTotal the number on the dice
   */
  function moveAndPlay(diceTotal: number) {
    // move to new square based on dice roll
    square = (square + diceTotal) % 40
    history.push(square)

    // find new square based on the square landed on
    const newSquare = evalSquare(square)
    if (square !== newSquare) history.push(newSquare)
    square = newSquare
  }

  /**
   * Evaluates what happens after landing on a square
   * @param square
   * @returns new square
   */
  function evalSquare(square: Square): Square {
    switch (square) {
      case Square.COMMUNITY_CHEST_1:
      case Square.COMMUNITY_CHEST_2:
      case Square.COMMUNITY_CHEST_3: {
        return drawCommunityChest(square)
      }
      case Square.CHANCE_1:
      case Square.CHANCE_2:
      case Square.CHANCE_3: {
        return drawChance(square)
      }
      case Square.GO_TO_JAIL:
        return Square.JAIL

      default:
        return square
    }
  }

  /**
   * Models the taking of a turn
   */
  function takeTurn() {
    let doubles = 0
    do {
      const dice = rollDice()
      if (dice.isDoubles) doubles++
      else doubles = 0
      if (doubles === 3) {
        square = Square.JAIL
        //  console.log("JAILLLLL lol")
        break
      }
      moveAndPlay(dice.total)
    } while (doubles > 0)
  }

  // initial state
  let square = 0
  let history = [0]
  let turnsInJail = 0
  let getOutOfJails = 0

  let chanceCards: number[] = []
  let communityChestCards: number[] = []

  for (let i = 0; i < turns; i++) {
    // if either card pile is empty, restock
    if (chanceCards.length === 0) {
      chanceCards = Object.values(Chance).filter(
        (card) => !isNaN(Number(card))
      ) as number[]
    }
    if (communityChestCards.length === 0) {
      communityChestCards = Object.values(CommunityChest).filter(
        (card) => !isNaN(Number(card))
      ) as number[]
    }

    // if in jail
    if (square === Square.JAIL) {
      turnsInJail++
      if (getOutOfJails > 0) {
        //   console.log("HAHAHA i can walk free cus i have this card")
        getOutOfJails--
        takeTurn()
      }

      // If it's the 4th turn in jail or the strategy is A, pay 50 to get out
      if (turnsInJail === 4 || strategy === Strategy.A) {
        //   console.log("screw this im paying the 50")
        square = (square + rollDice().total) % 40
        history.push(square)
      } else {
        //    console.log("trying for doubles")
        for (let i = 0; i < 3; i++) {
          const dice = rollDice()

          if (dice.isDoubles) {
            //       console.log("got doubles")
            square = (square + dice.total) % 40
            history.push(square)
            break
          }
        }
      }
    } else {
      takeTurn()
    }
  }
  // console.log({ history })
  return history
}

/**
 * Converts the history of the squares landed on to list of percentages for each square
 * @param history
 * @returns percentages for each square
 */
export function historyToProbabilities(history: number[]) {
  let probabilities: number[] = []
  for (let i = 0; i < 40; i++) {
    probabilities[i] = 0
  }
  // console.log(probabilities)
  history.forEach((square) => {
    probabilities[square]++
  })
  return probabilities
}
