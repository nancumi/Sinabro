'use client';
import React, { useState } from 'react'
import ParticipantSetup from './components/ParticipantSetup'
import GamePlay from './components/GamePlay'
import GameResult from './components/GameResult'

export default function App() {
  const [phase, setPhase] = useState('setup') // 'setup' | 'playing' | 'result'
  const [targetTime, setTargetTime] = useState(3)
  const [participants, setParticipants] = useState([])
  const [gameMode, setGameMode] = useState('first') // 'first' (1등 뽑기) | 'last' (꼴등 뽑기)
  const [gameResults, setGameResults] = useState([])

  const handleStartGame = ({ participants: selectedParticipants, gameMode: selectedMode }) => {
    // 1초 ~ 5초 사이 정수 목표 시간
    const randomTarget = Math.floor(Math.random() * 5) + 1
    setTargetTime(randomTarget)
    setParticipants(selectedParticipants)
    setGameMode(selectedMode)
    setPhase('playing')
  }

  const handleFinishGame = (results) => {
    setGameResults(results)
    setPhase('result')
  }

  const handleRestart = () => {
    setPhase('setup')
  }

  return (
    <div className="w-full bg-transparent text-slate-100 text-[12px] flex items-center justify-center p-0 selection:bg-indigo-500/30">
      <main className="w-full max-w-md mx-auto">
        {phase === 'setup' && (
          <ParticipantSetup onStartGame={handleStartGame} />
        )}

        {phase === 'playing' && (
          <GamePlay
            targetTime={targetTime}
            participants={participants}
            gameMode={gameMode}
            onFinishGame={handleFinishGame}
          />
        )}

        {phase === 'result' && (
          <GameResult
            results={gameResults}
            targetTime={targetTime}
            gameMode={gameMode}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  )
}
