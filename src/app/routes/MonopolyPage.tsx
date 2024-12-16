import { Slider } from "@mui/material"
import React, { useState } from "react"
import { runGame, Square } from "../monopoly/Monopoly"

interface MonopolyBoardComponentProps {
  currentSquare: Square // The current square to draw the marker on
}

interface BoardDimensions {
  width: number
  height: number
  originX: number // Bottom-left x coordinate
  originY: number // Bottom-left y coordinate
}

const getSquarePositions = ({
  width,
  height,
  originX,
  originY,
}: BoardDimensions) => {
  const squareWidth = width / 10 // 10 squares on each side, so 1/10th of width
  const squareHeight = height / 10

  return {
    [Square.GO]: { x: originX + width, y: originY },
    [Square.MEDITERRANEAN_AVENUE]: {
      x: originX + width - squareWidth,
      y: originY,
    },
    [Square.COMMUNITY_CHEST_1]: {
      x: originX + width - 2 * squareWidth,
      y: originY,
    },
    [Square.BALTIC_AVENUE]: {
      x: originX + width - 3 * squareWidth,
      y: originY,
    },
    [Square.INCOME_TAX]: { x: originX + width - 4 * squareWidth, y: originY },
    [Square.READING_RAILROAD]: {
      x: originX + width - 5 * squareWidth,
      y: originY,
    },
    [Square.ORIENTAL_AVENUE]: {
      x: originX + width - 6 * squareWidth,
      y: originY,
    },
    [Square.CHANCE_1]: { x: originX + width - 7 * squareWidth, y: originY },
    [Square.VERMONT_AVENUE]: {
      x: originX + width - 8 * squareWidth,
      y: originY,
    },
    [Square.CONNECTICUT_AVENUE]: {
      x: originX + width - 9 * squareWidth,
      y: originY,
    },
    [Square.JAIL]: { x: originX, y: originY },

    [Square.ST_CHARLES_PLACE]: { x: originX, y: originY + squareHeight },
    [Square.ELECTRIC_COMPANY]: { x: originX, y: originY + 2 * squareHeight },
    [Square.STATES_AVENUE]: { x: originX, y: originY + 3 * squareHeight },
    [Square.VIRGINIA_AVENUE]: { x: originX, y: originY + 4 * squareHeight },
    [Square.PENNSYLVANIA_RAILROAD]: {
      x: originX,
      y: originY + 5 * squareHeight,
    },
    [Square.ST_JAMES_PLACE]: { x: originX, y: originY + 6 * squareHeight },
    [Square.COMMUNITY_CHEST_2]: { x: originX, y: originY + 7 * squareHeight },
    [Square.TENNESSEE_AVENUE]: { x: originX, y: originY + 8 * squareHeight },
    [Square.NEW_YORK_AVENUE]: { x: originX, y: originY + 9 * squareHeight },
    [Square.FREE_PARKING]: { x: originX, y: originY + height },

    [Square.KENTUCKY_AVENUE]: { x: originX + squareWidth, y: originY + height },
    [Square.CHANCE_2]: { x: originX + 2 * squareWidth, y: originY + height },
    [Square.INDIANA_AVENUE]: {
      x: originX + 3 * squareWidth,
      y: originY + height,
    },
    [Square.ILLINOIS_AVENUE]: {
      x: originX + 4 * squareWidth,
      y: originY + height,
    },
    [Square.B_AND_O_RAILROAD]: {
      x: originX + 5 * squareWidth,
      y: originY + height,
    },
    [Square.ATLANTIC_AVENUE]: {
      x: originX + 6 * squareWidth,
      y: originY + height,
    },
    [Square.VENTNOR_AVENUE]: {
      x: originX + 7 * squareWidth,
      y: originY + height,
    },
    [Square.WATER_WORKS]: { x: originX + 8 * squareWidth, y: originY + height },
    [Square.MARVIN_GARDENS]: {
      x: originX + 9 * squareWidth,
      y: originY + height,
    },
    [Square.GO_TO_JAIL]: { x: originX + width, y: originY + height },

    [Square.PACIFIC_AVENUE]: {
      x: originX + width,
      y: originY + 9 * squareHeight,
    },
    [Square.NORTH_CAROLINA_AVENUE]: {
      x: originX + width,
      y: originY + 8 * squareHeight,
    },
    [Square.COMMUNITY_CHEST_3]: {
      x: originX + width,
      y: originY + 7 * squareHeight,
    },
    [Square.PENNSYLVANIA_AVENUE]: {
      x: originX + width,
      y: originY + 6 * squareHeight,
    },
    [Square.SHORT_LINE]: { x: originX + width, y: originY + 5 * squareHeight },
    [Square.CHANCE_3]: { x: originX + width, y: originY + 4 * squareHeight },
    [Square.PARK_PLACE]: { x: originX + width, y: originY + 3 * squareHeight },
    [Square.LUXURY_TAX]: { x: originX + width, y: originY + 2 * squareHeight },
    [Square.BOARDWALK]: { x: originX + width, y: originY + squareHeight },
  }
}

const boardDimensions: BoardDimensions = {
  width: 600,
  height: 600,
  originX: 50,
  originY: -50,
}
const squarePositions = getSquarePositions(boardDimensions)

export const MonopolyBoardComponent: React.FC<MonopolyBoardComponentProps> = ({
  currentSquare,
}) => {
  const markerPosition = squarePositions[currentSquare] || { x: 0, y: 0 }

  return (
    <div style={{ position: "relative", width: "700px", height: "700px" }}>
      {/* Monopoly board image */}
      <img
        src="resources/monopoly-board.jpg"
        alt="Monopoly Board"
        style={{
          width: "700px",
          height: "700px",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Marker */}
      <div
        className="marker-icon"
        style={{
          position: "absolute",
          top: boardDimensions.height - markerPosition.y,
          left: markerPosition.x,
          transform: "translate(-50%, -50%)",
          fontSize: "30px",
          color: "red",
        }}
      >
        🐶
      </div>
    </div>
  )
}
export function MonopolyPage() {
  const [step, setStep] = useState(0)

  const [history] = useState(runGame(100))

  const square = history[step]
  return (
    <div>
      <MonopolyBoardComponent currentSquare={square} />
      <Slider
        style={{ margin: "40px" }}
        min={0}
        max={history.length}
        onChange={(_, value) => setStep(value as number)}
      >
        Square
      </Slider>
    </div>
  )
}
