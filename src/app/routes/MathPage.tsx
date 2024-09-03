import { BasicPage } from "../BasicPage"
import * as React from "react"
import { BarChart } from "@mui/x-charts/BarChart"
import { useState } from "react"
import { Button, Slider, Typography } from "@mui/material"

type Data = {
  percentage: number
  amount: number
}

export function MathPage() {
  const [dataset, setDataset] = useState<Data[]>([])
  const [pValue, setPValue] = useState<number>(0)
  const [sum, setSum] = useState(0)
  const [nullHypothesis, setNullHypothesis] = useState(0.5)
  const [sampleProportion, setSampleProportion] = useState(0.3)
  const [sampleSize, setSampleSize] = useState(10)

  const threshold = 0.05
  const simulationCount = 1000

  function generateNullGraph(nullHypothesis: number, sampleSize: number) {
    const data: Data[] = []
    for (let i = 0; i < 101; i++) data.push({ percentage: i / 100, amount: 0 })
    for (let i = 0; i < simulationCount; i++) {
      var success = 0
      for (let i = 0; i < sampleSize; i++) {
        if (Math.random() < nullHypothesis) success++
      }
      data[Math.round((success / sampleSize) * 100)] = {
        ...data[Math.round((success / sampleSize) * 100)],
        amount: data[Math.round((success / sampleSize) * 100)].amount + 1,
      }
    }
    console.log({ data })
    setDataset(data)
    let sum = 0
    data
      .filter((item) =>
        sampleProportion > nullHypothesis
          ? item.percentage >= sampleProportion
          : item.percentage <= sampleProportion
      )
      .forEach((data) => (sum += data.amount))
    setPValue(sum / simulationCount)
    setSum(sum)
  }

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
          xAxis={[{ scaleType: "band", dataKey: "percentage" }]}
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
              onChange={(_, value) => setNullHypothesis(value as number)}
            />
            Null Hypothesis
          </div>
          <div style={{ margin: 20 }}>
            <Typography fontSize={25}>
              {Math.round(sampleProportion * 100)}%
            </Typography>
            <Slider
              max={1}
              step={0.01}
              value={sampleProportion}
              onChange={(_, value) => setSampleProportion(value as number)}
            />
            Sample proportion
          </div>
          <div style={{ margin: 20, width: 400 }}>
            <Typography fontSize={25}>{sampleSize}</Typography>
            <Slider
              min={1}
              max={10000}
              step={1}
              value={sampleSize}
              onChange={(_, value) => setSampleSize(value as number)}
            />
            Sample size
          </div>
        </div>
        <div>
          Out of the {simulationCount} simulations run, {sum} ended with a
          sample proportion of {sampleProportion} or{" "}
          {sampleProportion > nullHypothesis ? "higher" : "lower"}
        </div>
        <div>P-value is {pValue} </div>
        That is
        {pValue < threshold
          ? ` less than the threshold of ${threshold} and is therefore statistically significant`
          : ` more than the threshold of ${threshold} and is therefore NOT statistically significant`}
        <Button onClick={() => generateNullGraph(nullHypothesis, sampleSize)}>
          Generate
        </Button>
      </div>
    </BasicPage>
  )
}
