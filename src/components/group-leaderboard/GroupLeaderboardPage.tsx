import { useState } from 'react';
import { useGroupDraft } from '../../hooks/useGroupDraft';
import { useTournament } from '../../hooks/useTournament';
import { useGroupLeaderboard } from '../../hooks/useGroupLeaderboard';
import { useGroupPrizes } from '../../hooks/useGroupPrizes';
import type { PrizeWinner } from '../../hooks/useGroupPrizes';
import { GROUP_PLAYER_MAP } from '../../data/groupPlayers';
import type { GroupPlayerScore } from '../../types';

// ── Prize panel ───────────────────────────────────────────────────────────────

const PRIZE_DEFS = [
  {
    key: 'mostGoals' as const,
    emoji: '🎯',
    title: 'Most Goals',
    subtitle: 'Whole tournament',
  },
  {
    key: 'mostConcededGroup' as const,
    emoji: '🫣',
    title: 'Most Conceded',
    subtitle: 'Group stage only',
  },
];

function PrizeCard({ def, winner }: { def: typeof PRIZE_DEFS[0]; winner: PrizeWinner }) {
  const hasData = winner.teamId !== null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg mr-1">{def.emoji}</span>
          <span className="text-white font-bold text-sm">{def.title}</span>
        </div>
        <span className="text-xs text-amber-400 font-semibold bg-amber-400/10 border border-amber-400/20 rounded-full px-2 py-0.5">
          5 pints 🍺
        </span>
      </div>
      <p className="text-xs text-slate-500">{def.subtitle}</p>
      {hasData ? (
        <div className="mt-1">
          <p className="text-white font-semibold text-sm">
            {winner.teamFlag} {winner.teamName}
          </p>
          <p className="text-yellow-400 font-black text-lg">{winner.statValue}</p>
          <p className="text-slate-400 text-xs mt-1">
            → <span className="text-slate-300">{winner.ownerName}</span>'s team
          </p>
        </div>
      ) : (
        <p className="text-slate-600 text-sm mt-1 italic">No data yet</p>
      )}
    </div>
  );
}

// ── Player leaderboard card ───────────────────────────────────────────────────

interface CardProps {
  score: GroupPlayerScore;
  rank: number;
  isLeading: boolean;
}

function GroupPlayerCard({ score, rank, isLeading }: CardProps) {
  const [expanded, setExpanded] = useState(false);
  const player = GROUP_PLAYER_MAP[score.player];
  const border = isLeading ? player.borderClass : 'border-slate-700';

  return (
    <div className={`rounded-2xl border-2 ${border} bg-slate-800 overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isLeading && <span className="text-yellow-400">👑</span>}
              <span className="text-xs text-slate-500">#{rank}</span>
            </div>
            <h2 className={`text-xl font-black ${player.textClass}`}>{score.displayName}</h2>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-white">{score.totalPoints}</p>
            <p className="text-xs text-slate-500">points</p>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          {[
            { label: 'GF', value: score.goalsFor, colour: 'text-green-400' },
            { label: 'GA', value: score.goalsAgainst, colour: 'text-red-400' },
            {
              label: 'GD',
              value: score.goalDifference >= 0 ? `+${score.goalDifference}` : `${score.goalDifference}`,
              colour: score.goalDifference >= 0 ? 'text-green-400' : 'text-red-400',
            },
          ].map(({ label, value, colour }) => (
            <div key={label} className="flex-1 bg-slate-700/50 rounded-lg p-2 text-center">
              <p className={`text-base font-bold ${colour}`}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 text-xs text-slate-500 hover:text-slate-300 border-t border-slate-700 transition-colors text-left"
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
                    {t.isChampion && <span className="text-yellow-400 font-bold">🏆 +5</span>}
                  </td>
                  <td className="px-2 py-1.5 text-center">{t.played}</td>
                  <td className="px-2 py-1.5 text-center">{t.won}</td>
                  <td className="px-2 py-1.5 text-center">{t.drawn}</td>
                  <td className="px-2 py-1.5 text-center">{t.lost}</td>
                  <td className="px-2 py-1.5 text-center">
                    {t.goalDifference >= 0 ? `+${t.goalDifference}` : t.goalDifference}
                  </td>
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GroupLeaderboardPage() {
  const { state: draftState } = useGroupDraft();
  const { data: tournamentData, loading, error, refresh, clearCache } = useTournament();
  const scores = useGroupLeaderboard(draftState, tournamentData);
  const prizes = useGroupPrizes(draftState, tournamentData);

  if (draftState.phase !== 'complete') {
    return (
      <div className="flex flex-col items-center py-20 text-center px-4 gap-4">
        <div className="text-5xl">📋</div>
        <h2 className="text-xl font-bold text-white">Leaderboard locked</h2>
        <p className="text-slate-400 text-sm">Run the group sweepstake draw first to see standings.</p>
      </div>
    );
  }

  const matchesPlayed = tournamentData.fixtures.filter((f) => f.status === 'FINISHED').length;
  const lastUpdated = tournamentData.fetchedAt
    ? new Date(tournamentData.fetchedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null;

  const leader = scores[0];
  const isAllTied = scores.length > 1 && scores.every((s) => s.totalPoints === leader.totalPoints);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg px-4 py-3 flex items-center justify-between">
          <p className="text-red-400 text-sm">⚠ {error}</p>
          <button onClick={clearCache} className="text-red-400 hover:text-red-300 text-xs underline ml-4">
            Clear cache & retry
          </button>
        </div>
      )}

      {/* ── Special prizes ── */}
      {prizes && (
        <div>
          <h3 className="text-white font-bold mb-3">Special Prizes</h3>
          <div className="grid grid-cols-2 gap-3">
            {PRIZE_DEFS.map((def) => (
              <PrizeCard key={def.key} def={def} winner={prizes[def.key]} />
            ))}
          </div>
        </div>
      )}

      {/* ── Standings ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-slate-500 text-xs">
            {matchesPlayed > 0
              ? `Based on ${matchesPlayed} match${matchesPlayed === 1 ? '' : 'es'} played`
              : 'No matches played yet'}
          </p>
          <div className="flex items-center gap-3">
            {lastUpdated && !loading && <span className="text-slate-600 text-xs">Updated {lastUpdated}</span>}
            {loading && <span className="text-slate-600 text-xs animate-pulse">Updating…</span>}
            <button onClick={refresh} disabled={loading} className="text-slate-500 hover:text-slate-300 text-xs disabled:opacity-40">
              ↻ Refresh
            </button>
          </div>
        </div>

        {scores.length > 0 && (
          <div className="text-center py-2 mb-4">
            {!isAllTied ? (
              <p className="text-2xl font-black text-yellow-400">{leader.displayName} leads 👑</p>
            ) : (
              <p className="text-2xl font-bold text-white">All square ⚖️</p>
            )}
          </div>
        )}

        <div className="space-y-4">
          {scores.map((score, i) => (
            <GroupPlayerCard key={score.player} score={score} rank={i + 1} isLeading={i === 0 && !isAllTied} />
          ))}
        </div>

        {scores.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm">Scores will appear once matches are played.</p>
          </div>
        )}
      </div>
    </div>
  );
}
