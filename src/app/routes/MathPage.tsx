import { BasicPage } from "../BasicPage"
import * as React from "react"
import { BarChart } from "@mui/x-charts/BarChart"
import { useEffect, useState } from "react"
import { Button, Slider, Typography } from "@mui/material"
import { Data, generateNullGraph } from "../../math/Math"

export function MathPage() {
  const [dataset, setDataset] = useState<Data[]>([])

  const [sum, setSum] = useState(0)
  const [nullHypothesis, setNullHypothesis] = useState(0.5)

  const [sampleSize, setSampleSize] = useState(10)
  const [successes, setSuccesses] = useState(0)

  const maxSampleSize = 1000

  const threshold = 0.05
  const simulationCount = 1000

  const sampleProportion = successes / sampleSize

  const pValue = sum / simulationCount

  useEffect(() => {
    let s = 0
    dataset
      .filter((item) =>
        sampleProportion > nullHypothesis
          ? item.percentage >= sampleProportion
          : item.percentage <= sampleProportion
      )
      .forEach((data) => (s += data.amount))

    setSum(s)
  }, [sampleProportion, nullHypothesis, dataset])

  return (
    <BasicPage title="Math">
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          padding: "10px",
        }}
      >
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
                    : [sampleProportion + 0.0000001],
                colors: ["red", "blue", "red"],
              },
            },
          ]}
          series={[{ dataKey: "amount" }]}
          width={800}
          height={300}
        />
        <div style={{ display: "flex", textAlign: "center" }}>
          <div style={{ margin: 20 }}>
            <Typography fontSize={25}>
              {Math.round(nullHypothesis * 100)}%
            </Typography>
            <Slider
              max={1}
              step={0.01}
              value={nullHypothesis}
              onChange={(_, value) => {
                setNullHypothesis(value as number)
                generateNullGraph(simulationCount, nullHypothesis, sampleSize)
              }}
            />
            Null Hypothesis
          </div>

          <div style={{ margin: 20, width: 400 }}>
            <Typography fontSize={25}>{sampleSize}</Typography>
            <Slider
              min={1}
              max={maxSampleSize}
              step={1}
              value={sampleSize}
              onChange={(_, value) => {
                setDataset(
                  generateNullGraph(simulationCount, nullHypothesis, sampleSize)
                )
                setSampleSize(value as number)
              }}
              onChangeCommitted={() => {
                if (successes > sampleSize) setSuccesses(sampleSize)
              }}
            />
            Sample size
            <div style={{ width: (sampleSize / maxSampleSize) * 400 }}>
              <Typography fontSize={25}>{successes}</Typography>
              <Slider
                max={sampleSize}
                step={1}
                value={successes}
                onChange={(_, value) => setSuccesses(value as number)}
              />
              Successes
            </div>
          </div>
        </div>
        <div>
          Out of the {simulationCount} simulations run, {sum} ended with a
          sample proportion of {Math.round(sampleProportion * 1000) / 10}% or{" "}
          {sampleProportion > nullHypothesis ? "higher" : "lower"}
        </div>
        <div>P-value is {pValue} </div>
        That is
        {pValue < threshold
          ? ` less than the threshold of ${threshold} and is therefore statistically significant`
          : ` more than the threshold of ${threshold} and is therefore NOT statistically significant`}
        <Button
          onClick={() =>
            setDataset(
              generateNullGraph(simulationCount, nullHypothesis, sampleSize)
            )
          }
        >
          Generate
        </Button>
      </div>
    </BasicPage>
  )
}
