import { useState } from 'react';
import type { PlayerScore } from '../../types';

interface Props {
  score: PlayerScore;
  rank: number;
  isLeading: boolean;
}

export default function PlayerCard({ score, rank, isLeading }: Props) {
  const [expanded, setExpanded] = useState(false);
  const accent = score.player === 'ed' ? 'border-blue-500' : 'border-rose-500';
  const headingColour = score.player === 'ed' ? 'text-blue-400' : 'text-rose-400';

  return (
    <div className={`rounded-2xl border-2 ${isLeading ? accent : 'border-slate-700'} bg-slate-800 overflow-hidden`}>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isLeading && <span className="text-yellow-400 text-lg">👑</span>}
              <span className="text-xs text-slate-500">#{rank}</span>
            </div>
            <h2 className={`text-2xl font-black ${headingColour}`}>{score.displayName}</h2>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-white">{score.totalPoints}</p>
            <p className="text-xs text-slate-500">points</p>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          {[
            { label: 'GF', value: score.goalsFor, colour: 'text-green-400' },
            { label: 'GA', value: score.goalsAgainst, colour: 'text-red-400' },
            { label: 'GD', value: score.goalDifference >= 0 ? `+${score.goalDifference}` : `${score.goalDifference}`, colour: score.goalDifference >= 0 ? 'text-green-400' : 'text-red-400' },
          ].map(({ label, value, colour }) => (
            <div key={label} className="flex-1 bg-slate-700/50 rounded-lg p-2 text-center">
              <p className={`text-lg font-bold ${colour}`}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-2 text-xs text-slate-500 hover:text-slate-300 border-t border-slate-700 transition-colors text-left"
      >
        {expanded ? '▲ Hide' : '▼ Show'} team breakdown ({score.teamBreakdown.length} teams)
      </button>

      {expanded && (
        <div className="border-t border-slate-700">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-700">
                <th className="text-left px-4 py-2">Team</th>
                <th className="px-2 py-2">P</th>
                <th className="px-2 py-2">W</th>
                <th className="px-2 py-2">D</th>
                <th className="px-2 py-2">L</th>
                <th className="px-2 py-2">GD</th>
                <th className="px-2 py-2 font-bold text-white">Pts</th>
              </tr>
            </thead>
            <tbody>
              {score.teamBreakdown.map((t) => (
                <tr key={t.teamId} className="border-b border-slate-700/50 text-slate-300">
                  <td className="px-4 py-1.5 flex items-center gap-2">
                    <span>{t.flag}</span>
                    <span>{t.teamName}</span>
                    {t.isChampion && <span className="text-yellow-400 text-xs font-bold">🏆 +5</span>}
                  </td>
                  <td className="px-2 py-1.5 text-center">{t.played}</td>
                  <td className="px-2 py-1.5 text-center">{t.won}</td>
                  <td className="px-2 py-1.5 text-center">{t.drawn}</td>
                  <td className="px-2 py-1.5 text-center">{t.lost}</td>
                  <td className="px-2 py-1.5 text-center">{t.goalDifference >= 0 ? `+${t.goalDifference}` : t.goalDifference}</td>
                  <td className="px-2 py-1.5 text-center font-bold text-white">{t.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
