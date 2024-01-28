import { useState } from 'react'


const Button = (props) => {
  return (
    <>
      <button onClick={props.handleClick}>
        {props.text}
      </button>
    </>
  )
}

const StatisticLine = (props) => {
  return (
    <>
      <tr><td>{props.text}</td><td>{props.value}</td></tr>
    </>
  )
}

const Statistics = (props) => {
  let good = props.good
  let neutral = props.neutral
  let bad = props.bad
  let all = good + neutral + bad

  if (all > 0) {
    const average = (g, n, b) => {
      let good = g
      let neutral = n
      let bad = b
      let avg = (good - bad) / (good + neutral + bad)
      if (isNaN(avg)) {
        return avg = 0
      } 
      else {
        return avg
      }
    }
    const positive = (g, n, b) => {
      let all = g + n + b
      let positivePercent = (g / all) * 100

      if (isNaN(positivePercent)) {
        return positivePercent = 0
      } 
      else {
        return `${positivePercent}%`
      }
    }
    return (
      <div>
        <table>
          <tbody>
            <StatisticLine text='good' value={good}/>
            <StatisticLine text='neutral' value={neutral}/>
            <StatisticLine text='bad' value={bad}/>
            <StatisticLine text='all' value={all}/>
            <StatisticLine text='average' value={average(good, neutral, bad)}/>
            <StatisticLine text='positive' value={positive(good, neutral, bad)}/>
          </tbody>
        </table>
      </div>
    )
  }
  else {
    return <><p>No feedback given</p></>
  }
}

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodFunction = () => setGood(good + 1)
  const neutralFunction = () => setNeutral(neutral + 1)
  const badFunction = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button handleClick={goodFunction} text='good' />
        <Button handleClick={neutralFunction} text='neutral' />
        <Button handleClick={badFunction} text='bad' />
      </div>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App