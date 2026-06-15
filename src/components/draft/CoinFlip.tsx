import { useState } from 'react';
import type { PlayerId } from '../../types';

interface Props {
  onWinner: (winner: PlayerId) => void;
}

type Choice = 'heads' | 'tails';

export default function CoinFlip({ onWinner }: Props) {
  const [edChoice, setEdChoice] = useState<Choice | null>(null);
  const [ajChoice, setAjChoice] = useState<Choice | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<Choice | null>(null);
  const [winner, setWinner] = useState<PlayerId | null>(null);

  const canFlip = edChoice !== null && ajChoice !== null && edChoice !== ajChoice;

  function flip() {
    if (!canFlip) return;
    setFlipping(true);
    setTimeout(() => {
      const landed: Choice = Math.random() > 0.5 ? 'heads' : 'tails';
      const w: PlayerId = landed === edChoice ? 'ed' : 'aj';
      setResult(landed);
      setWinner(w);
      setFlipping(false);
    }, 2000);
  }

  if (winner && result) {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <div className="text-7xl animate-bounce">{result === 'heads' ? '👑' : '🦅'}</div>
        <p className="text-2xl font-bold text-white">
          {result === 'heads' ? 'Heads!' : 'Tails!'}
        </p>
        <p className="text-4xl font-black text-yellow-400">
          {winner === 'ed' ? 'Ed' : 'AJ'} picks first!
        </p>
        <button
          onClick={() => onWinner(winner)}
          className="mt-4 px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl text-lg transition-colors"
        >
          Begin Draft →
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <h2 className="text-2xl font-bold text-white">Coin Flip — who picks first?</h2>
      <p className="text-slate-400 text-sm">Each person calls a side. They must be different.</p>

      <div className="grid grid-cols-2 gap-8 w-full max-w-sm">
        {(['ed', 'aj'] as PlayerId[]).map((player) => {
          const choice = player === 'ed' ? edChoice : ajChoice;
          const setChoice = player === 'ed' ? setEdChoice : setAjChoice;
          return (
            <div key={player} className="flex flex-col items-center gap-3">
              <p className="text-lg font-semibold text-white capitalize">{player === 'ed' ? 'Ed' : 'AJ'}</p>
              {(['heads', 'tails'] as Choice[]).map((side) => (
                <button
                  key={side}
                  onClick={() => setChoice(side)}
                  className={`w-full py-2 rounded-lg font-semibold capitalize transition-colors ${
                    choice === side
                      ? 'bg-yellow-400 text-black'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {side === 'heads' ? '👑 Heads' : '🦅 Tails'}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {edChoice && ajChoice && edChoice === ajChoice && (
        <p className="text-red-400 text-sm">Both chose {edChoice} — pick different sides!</p>
      )}

      {flipping ? (
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl animate-spin">🪙</div>
          <p className="text-slate-300 animate-pulse">Flipping…</p>
        </div>
      ) : (
        <button
          onClick={flip}
          disabled={!canFlip}
          className={`px-8 py-3 rounded-xl font-bold text-lg transition-colors ${
            canFlip
              ? 'bg-yellow-400 hover:bg-yellow-300 text-black'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Flip the coin!
        </button>
      )}
    </div>
  );
}
