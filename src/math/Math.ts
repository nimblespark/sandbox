export type Data = {
  percentage: number
  amount: number
}

export function generateNullGraph(
  simulationCount: number,
  nullHypothesis: number,
  sampleSize: number
): Data[] {
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
  //console.log({ data })
  return data
}

export function asPercentage(num: number): string {
  return Math.round(num * 10000) / 100 + "%"
}
