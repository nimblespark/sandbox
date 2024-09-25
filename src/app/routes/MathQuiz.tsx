import { BarChart } from "@mui/x-charts"
import { BasicPage } from "../BasicPage"
import { asPercentage, generateNullGraph } from "../../math/Math"

import { Typography } from "@mui/material"
import { Quiz } from "../../math/Quiz"

export function MathQuiz() {
  const nouns = [
    "people",
    "birds",
    "stuffed animals",
    "clouds",
    "girls named Vivian",
    "clowns",
  ]

  const adjectives = [
    "hairy",
    "white",
    "just straight ugly",
    "edible",
    "downright evil",
    "mentally insane",
  ]

  const places = [
    "inside your bathroom",
    "to the park",
    "to Mexico",
    "to hell",
    "to a Trump rally",
    "to highschool prom",
  ]

  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const place = places[Math.floor(Math.random() * places.length)]

  const sampleSize = Math.round(Math.random() * 1000)

  const successes = Math.round(Math.random() * sampleSize)

  const sampleProportion = successes / sampleSize
  const nullHypothesis = Math.min(
    100,
    Math.max(
      0,
      Math.round(((Math.random() - 0.5) / 10 + sampleProportion) * 100) / 100
    )
  )

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
              // colorMap: {
              //   type: "piecewise",
              //   thresholds:
              //     sampleProportion > nullHypothesis
              //       ? [0, sampleProportion]
              //       : [sampleProportion + 0.0000001],
              //   colors: ["red", "blue", "red"],
              // },
            },
          ]}
          series={[{ dataKey: "amount" }]}
          width={800}
          height={300}
        />
        <Quiz
          questions={[
            {
              name: "sample proportion",
              correct: Math.round(sampleProportion * 100) / 100,
            },
            {
              name: "null value",
              correct: Math.round(nullHypothesis * 100) / 100,
            },
            { name: "p-value", correct: pValue },
          ]}
        />
      </div>
    </BasicPage>
  )
}
