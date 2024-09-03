import { BarChart } from "@mui/x-charts"
import { BasicPage } from "../BasicPage"
import { asPercentage, generateNullGraph } from "../../math/Math"
import { ReactElement, useEffect, useState } from "react"
import { Button, TextField, Typography } from "@mui/material"
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  useForm,
  UseFormStateReturn,
} from "react-hook-form"
import { FileDownload } from "@mui/icons-material"
import { Quiz } from "../../math/Quiz"

type FormData = {
  pValue: number
}

export function MathQuiz() {
  const [correct, setCorrect] = useState<boolean | null>(null)

  const nouns = [
    "people",
    "birds",
    "stuffed animals",
    "clouds",
    "girls named Vivian",
  ]

  const adjectives = ["hairy", "alive", "white", "just straight ugly"]

  const places = ["inside your bathroom", "to the park", "to Mexico"]

  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const place = places[Math.floor(Math.random() * places.length)]

  const sampleSize = Math.round(Math.random() * 1000)

  const successes = Math.round(Math.random() * sampleSize)

  const sampleProportion = successes / sampleSize
  const nullHypothesis =
    Math.round(((Math.random() - 0.5) / 10 + sampleProportion) * 100) / 100

  const dataset = generateNullGraph(1000, nullHypothesis, sampleSize)

  var sum = 0
  dataset
    .filter((item) =>
      sampleProportion > nullHypothesis
        ? item.percentage >= sampleProportion
        : item.percentage <= sampleProportion
    )
    .forEach((data) => (sum += data.amount))

  const pValue = Math.round((sum / 1000) * 100) / 100

  return (
    <BasicPage title="Math Quiz">
      <div style={{ padding: 15 }}>
        <Typography>
          It is common knowledge that {asPercentage(nullHypothesis)} of {noun}{" "}
          are {adjective}. However, you went {place} and saw {sampleSize} {noun}
          . You noticed that {successes} were {adjective}. Below is a chart that
          represents the null distribution.
        </Typography>
        <BarChart
          dataset={dataset}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "percentage",
              colorMap: {
                type: "piecewise",
                thresholds:
                  sampleProportion > nullHypothesis
                    ? [0, sampleProportion]
                    : [sampleProportion],
                colors: ["red", "blue", "red"],
              },
            },
          ]}
          series={[{ dataKey: "amount" }]}
          width={800}
          height={300}
        />
        <Quiz
          questions={[
            { name: "p-value", correct: pValue },
            {
              name: "sample proportion",
              correct: Math.round(sampleProportion * 100) / 100,
            },
          ]}
        />
      </div>
    </BasicPage>
  )
}
