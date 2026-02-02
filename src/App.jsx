import React, { useState } from 'react'
import { MAX_DAYS, initialStats, applyAction, checkEnding } from './gameEngine'
import { initAudio, playBgm, stopBgm } from './audioEngine'

export default function App() {

  const [screen, setScreen] = useState('start')
  const [day, setDay] = useState(1)
  const [stats, setStats] = useState(initialStats)
  const [correct, setCorrect] = useState(0)
  const [ending, setEnding] = useState(null)

  const startGame = () => {
    initAudio()
    playBgm("https://storage.googleapis.com/eunyeongsmusicfiles/Handel%20Water%20Music.mp3")
    setScreen('play')
  }

  const doAction = (type) => {

    const newStats = applyAction(stats, type, 4)
    setStats(newStats)

    if (day === MAX_DAYS) {
      const result = checkEnding(newStats)
      stopBgm()
      setEnding(result)
      setScreen('ending')
      return
    }

    setDay(d => d + 1)
  }

  const reset = () => {
    setStats(initialStats)
    setDay(1)
    setScreen('start')
    setEnding(null)
  }

  return (
    <div style={{ padding: 20 }}>

      {screen === 'start' && (
        <div style={{ textAlign:'center' }}>
          <h1>👑 Royal Ball Deluxe</h1>
          <button onClick={startGame}>
            Start Protocol
          </button>
        </div>
      )}

      {screen === 'play' && (
        <div>
          <h2>DAY {day} / 7</h2>

          <p>
            Int: {stats.intellect} |
            Flu: {stats.fluency} |
            Ene: {stats.energy} |
            Gold: {stats.gold}
          </p>

          <div style={{ display:'grid', gap:10 }}>

            <button onClick={() => doAction('lit')}>
              📚 Literature Training
            </button>

            <button onClick={() => doAction('talk')}>
              🗣 Royal Speaking
            </button>

            <button onClick={() => doAction('work')}>
              ☕ Imperial Cafe
            </button>

            <button onClick={() => doAction('rest')}>
              💆 Celestial Spa
            </button>

          </div>
        </div>
      )}

      {screen === 'ending' && (
        <div style={{ textAlign:'center' }}>

          {ending === 'success' && <h1>👑 SUCCESS ENDING</h1>}
          {ending === 'neutral' && <h1>📜 NEUTRAL ENDING</h1>}
          {ending === 'fail' && <h1>🐒 FAIL ENDING</h1>}

          <button onClick={reset}>
            Restart Protocol
          </button>

        </div>
      )}

    </div>
  )
}

      <AppInner />
    </ErrorBoundary>
  );
}
