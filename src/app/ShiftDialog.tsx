import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import { Shift } from "./types"
import { DatePicker, TimePicker } from "@mui/x-date-pickers"
import { Controller, useForm } from "react-hook-form"
import dayjs from "dayjs"

type Props = {
  open: boolean
  onClose: () => void
  _handleSubmit: (shift: Shift) => void
  shift?: Shift
}

export const defaultShift: Shift = {
  day: dayjs(),
  startTime: dayjs(),
  endTime: dayjs(),
}

export function ShiftDialog({ open, onClose, shift, _handleSubmit }: Props) {
  const { control, handleSubmit } = useForm({
    defaultValues: shift ? shift : defaultShift,
  })
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{shift ? "Edit" : "Add"} Shift</DialogTitle>
      <DialogContent>
        <Controller
          name="day"
          control={control}
          render={({ field }) => {
            return <DatePicker value={field.value} onChange={field.onChange} />
          }}
        />
        <div>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => {
              return (
                <TimePicker value={field.value} onChange={field.onChange} />
              )
            }}
          />
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => {
              return (
                <TimePicker value={field.value} onChange={field.onChange} />
              )
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(_handleSubmit)}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}
