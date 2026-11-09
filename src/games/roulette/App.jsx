'use client';
import React, { useState } from 'react';
import Step1Players from './components/Step1Players';
import Step2RouletteItems from './components/Step2RouletteItems';
import Step3RouletteGame from './components/Step3RouletteGame';
import { PRESET_OPTIONS, COLOR_PALETTE } from './utils/constants';

export default function App() {
  const [step, setStep] = useState(1);
  const [players, setPlayers] = useState(['플레이어 1', '플레이어 2']);
  const [items, setItems] = useState([]);

  return (
    <div className="w-full text-slate-100 flex flex-col justify-center py-6 px-3 sm:px-4">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -left-40 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 -right-40 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto flex-1 flex flex-col justify-center">
        {/* Step Views */}
        <main className="flex-1 flex flex-col justify-center">
          {step === 1 && (
            <Step1Players
              players={players}
              setPlayers={setPlayers}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <Step2RouletteItems
              items={items}
              setItems={setItems}
              playersCount={players.length}
              onBack={() => setStep(1)}
              onStartGame={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <Step3RouletteGame
              players={players}
              items={items}
              onRestartAll={() => setStep(1)}
              onEditItems={() => setStep(2)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
