import {
  Card,
  CardContent,
  CardHeader,
  Fab,
  IconButton,
  List,
} from "@mui/material"
import { BasicPage } from "../BasicPage"
import { Add, Edit } from "@mui/icons-material"
import { useState } from "react"

import { ShiftDialog, defaultShift } from "../ShiftDialog"
import { Shift } from "../types"

export function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [addShift, setAddShift] = useState<boolean>(false)
  const [editShift, setEditShift] = useState<number | null>(null)

  function handleEditShift(shift: Shift) {
    var shiftsCopy = [...shifts]
    shiftsCopy[editShift!] = shift
    setShifts(shiftsCopy)

    setEditShift(null)
  }

  function handleAddShift(shift: Shift) {
    setShifts([...shifts, shift])
    setAddShift(false)
  }
  return (
    <BasicPage title="Shifts">
      <List>
        {shifts.map((shift, i) => {
          return (
            <>
              <CardHeader
                title={
                  shift.day.format("dddd, MMMM D") +
                  " - " +
                  shift.endTime.diff(shift.startTime, "hours") +
                  " hours"
                }
                action={
                  <IconButton onClick={() => setEditShift(i)}>
                    <Edit />
                  </IconButton>
                }
              />

              <CardContent>
                {shift.startTime.format("h:mm a") +
                  " to " +
                  shift.endTime.format("h:mm a")}
              </CardContent>
            </>
          )
        })}
      </List>

      <Fab
        color="primary"
        sx={{
          position: "absolute",
          right: 16,
          bottom: 16,
        }}
        onClick={() => {
          setAddShift(true)
        }}
      >
        <Add />
      </Fab>
      {/* Add Shift */}
      <ShiftDialog
        open={addShift}
        onClose={() => {
          setAddShift(false)
        }}
        _handleSubmit={handleAddShift}
      />
      {/* Edit Shit */}
      <ShiftDialog
        open={!(editShift === null)}
        onClose={() => {
          setEditShift(null)
        }}
        shift={editShift !== null ? shifts[editShift] : undefined}
        _handleSubmit={handleEditShift}
      />
    </BasicPage>
  )
}
