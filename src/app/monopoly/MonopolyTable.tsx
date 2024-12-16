import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarProps,
} from "@mui/x-data-grid"
import { historyToProbabilities, runGame, Square, Strategy } from "./Monopoly"
import { useState } from "react"
import { Switch, TextField } from "@mui/material"

function CustomToolbar(props: GridToolbarProps) {
  console.log(props)
  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={props.csvOptions} />
    </GridToolbarContainer>
  )
}

export function MonopolyTable() {
  const [sample, setSample] = useState(1000)
  const [strategy, setStrategy] = useState(true)
  const squareNames = Object.values(Square) as string[]

  // Generate the data and format for the datatable
  var data = historyToProbabilities(
    runGame(sample, strategy ? Strategy.A : Strategy.B)
  ).map((timesLanded, square) => ({
    id: square,
    square: squareNames[square],
    timesLanded: timesLanded,
    percentage: `${Math.floor((timesLanded / sample) * 1000) / 10}%`,
  }))

  const columns: GridColDef[] = [
    { field: "square", headerName: "Square", width: 200 },
    { field: "timesLanded", headerName: "Count", width: 80 },
    { field: "percentage", headerName: "%", width: 80 },
  ]

  return (
    <>
      <DataGrid
        slotProps={{
          toolbar: {
            csvOptions: {
              fileName: `${sample} ${strategy ? "A" : "B"}`,
            },
          },
        }}
        slots={{
          toolbar: CustomToolbar,
        }}
        columns={columns}
        //columnGroupingModel={columnGroupingModel}
        rows={data}
      />
      Sample
      <TextField
        type="number"
        onChange={(ev) => setSample(Number(ev.currentTarget.value))}
      />
      Use Strategy A
      <Switch
        checked={strategy}
        onChange={(_, checked) => setStrategy(checked)}
      />
    </>
  )
}
