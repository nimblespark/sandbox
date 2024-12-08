import { BarChart } from "@mui/x-charts"
import { historyToProbabilities, runGame, Square } from "../Monopoly"
import { Tab, Tabs } from "@mui/material"
import { useState } from "react"
import { MonopolyTable } from "../MonopolyTable"

export function MonopolyResultsPage() {
  const [tab, setTab] = useState(1)
  const data = historyToProbabilities(runGame(1000))
  const squareNames = Object.values(Square) as string[]

  const dataset = data.map((timesLanded, square) => ({
    square: squareNames[square],
    timesLanded: timesLanded,
  }))

  dataset.sort((a, b) => b.timesLanded - a.timesLanded)
  return (
    <>
      <Tabs value={tab} onChange={(_, value) => setTab(value)}>
        <Tab label="Table" value={1} />
        <Tab label="Chart" value={2} />
      </Tabs>
      {tab === 2 && (
        <BarChart
          margin={{ left: 200 }}
          dataset={dataset}
          series={[{ dataKey: "timesLanded" }]}
          yAxis={[{ scaleType: "band", dataKey: "square" }]}
          layout="horizontal"
          height={800}
        />
      )}
      {tab === 1 && <MonopolyTable />}
    </>
  )
}
