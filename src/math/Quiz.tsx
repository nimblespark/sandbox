import { Check, Close, Error } from "@mui/icons-material"
import { Button, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

type Props = {
  questions: { name: string; correct: number }[]
}

export function Quiz({ questions }: Props) {
  const { control, handleSubmit } = useForm()
  const [correct, setCorrect] = useState<boolean | null>(null)

  // console.log(
  //   "default values",
  //   questions.reduce((a, v) => ({ ...a, [v.name]: 0 }), {})
  // )

  function _handleSubmit(data: Record<string, number>) {
    // console.log({ questions })
    // console.log({ data })
    setCorrect(
      questions.every(
        (question) => Number(data[question.name]) === question.correct
      )
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: 600 }}>
      {questions.map((question) => {
        return (
          <>
            <Typography>
              What is the {question.name}? (Round to 2 decimals if necessary)
            </Typography>
            <div>
              <Controller
                control={control}
                name={question.name}
                render={({ field }) => {
                  return (
                    <TextField
                      type="number"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )
                }}
              />
              <ViewSolutionButton solution={question.correct} />
            </div>
          </>
        )
      })}

      <Button onClick={handleSubmit(_handleSubmit)}>Submit</Button>
      {correct === true && <Check style={{ color: "green" }} />}
      {correct === false && <Close style={{ color: "red" }} />}
    </div>
  )
}

type ViewSolutionButtonProps = {
  solution: number
}

function ViewSolutionButton({ solution }: ViewSolutionButtonProps) {
  const [view, setView] = useState(false)
  return (
    <>
      {view === false && (
        <Button
          onClick={() => setView(true)}
          style={{ textTransform: "lowercase" }}
        >
          View solution
        </Button>
      )}
      {view === true && <>{solution}</>}
    </>
  )
}
