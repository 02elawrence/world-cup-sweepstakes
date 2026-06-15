import { useState } from 'react';
import { useS2Draft } from '../../hooks/useS2Draft';
import { useTournament } from '../../hooks/useTournament';
import { useS2Leaderboard } from '../../hooks/useS2Leaderboard';
import { useS2Wildcard } from '../../hooks/useS2Wildcard';
import { S2_PLAYER_MAP } from '../../data/s2Players';
import type { S2PlayerScore } from '../../types';
import type { WildcardStatus } from '../../hooks/useS2Wildcard';

// ── Wildcard banner ────────────────────────────────────────────────────────────

function WildcardBanner({ status }: { status: WildcardStatus }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl border-2 p-4 ${
        status.triggered
          ? 'border-purple-500 bg-purple-500/10'
          : 'border-slate-600 bg-slate-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🃏</span>
            <span className="text-white font-bold">Wildcard Pot</span>
            <span
              className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                status.triggered
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {status.triggered ? '✓ TRIGGERED' : 'Pending…'}
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            {status.triggered
              ? '£50 split equally — everyone gets £5'
              : 'No wildcard condition met yet — £50 rolls to the winner'}
          </p>
        </div>
        <span className="text-yellow-400 font-black text-xl shrink-0">£50</span>
      </div>

      {status.achievements.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-xs text-purple-400 hover:text-purple-300"
          >
            {expanded ? '▲ Hide' : '▼ Show'} achievements ({status.achievements.length})
          </button>
          {expanded && (
            <ul className="mt-2 space-y-1">
              {status.achievements.map((a, i) => {
                const typeLabel: Record<string, string> = {
                  beat_pot1: '🏆 Beat Pot 1',
                  reached_last16: '📋 Reached Last 16',
                  scored_3_vs_pot1: '⚽ 3+ goals vs Pot 1',
                };
                return (
                  <li key={i} className="text-xs text-slate-300 flex gap-2">
                    <span>{a.teamFlag} {a.teamName}</span>
                    <span className="text-purple-400">{typeLabel[a.type]}</span>
                    <span className="text-slate-500">{a.detail}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

// ── Player card ────────────────────────────────────────────────────────────────

function S2PlayerCard({
  score,
  rank,
  isLeading,
  maxGoals,
}: {
  score: S2PlayerScore;
  rank: number;
  isLeading: boolean;
  maxGoals: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const player = S2_PLAYER_MAP[score.player];
  const border = isLeading ? player.borderClass : 'border-slate-700';

  const { isChampion, isRunnerUp, isSemiFinalist, isMostGoals, prizeTotal } = score.prizes;

  const prizeBadges = [
    isChampion    && { label: '🏆 Champion', cls: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
    isRunnerUp    && { label: '🥈 Runner-up', cls: 'bg-slate-400/20 text-slate-300 border-slate-400/40' },
    isSemiFinalist && { label: '🥉 Semi-final', cls: 'bg-amber-700/20 text-amber-400 border-amber-700/40' },
    isMostGoals   && { label: '⚽ Most Goals', cls: 'bg-green-500/20 text-green-400 border-green-500/40' },
  ].filter(Boolean) as { label: string; cls: string }[];

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
            {prizeBadges.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {prizeBadges.map((b) => (
                  <span key={b.label} className={`text-xs rounded-full px-2 py-0.5 border ${b.cls}`}>
                    {b.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-right shrink-0 ml-2">
            <p className="text-4xl font-black text-yellow-400">
              {prizeTotal > 0 ? `£${prizeTotal}` : '—'}
            </p>
            <p className="text-xs text-slate-500">prize</p>
          </div>
        </div>

        {/* Goals bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Goals scored (all teams)</span>
            <span className="text-green-400 font-bold">{score.totalGoals}</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: maxGoals > 0 ? `${(score.totalGoals / maxGoals) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 text-xs text-slate-500 hover:text-slate-300 border-t border-slate-700 transition-colors text-left"
      >
        {expanded ? '▲ Hide' : '▼ Show'} teams ({score.teamBreakdown.length})
      </button>

      {expanded && (
        <div className="border-t border-slate-700">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-700">
                <th className="text-left px-4 py-2">Team</th>
                <th className="px-2 py-2">Stage</th>
                <th className="px-2 py-2 text-right pr-4">Goals</th>
              </tr>
            </thead>
            <tbody>
              {score.teamBreakdown.map((t) => (
                <tr key={t.teamId} className="border-b border-slate-700/50 text-slate-300">
                  <td className="px-4 py-2 flex items-center gap-2">
                    <span>{t.flag}</span>
                    <span>{t.teamName}</span>
                    {t.isWildcard && (
                      <span className="text-purple-400 text-xs border border-purple-500/30 rounded-full px-1">🃏</span>
                    )}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {t.stage ? (
                      <span className={t.eliminated ? 'text-slate-500 line-through' : 'text-slate-300'}>
                        {t.stage}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-green-400">{t.goalsFor}</td>
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

export default function S2LeaderboardPage() {
  const { state: draftState } = useS2Draft();
  const { data: tournamentData, loading, error, refresh, clearCache } = useTournament();
  const wildcardStatus = useS2Wildcard(tournamentData);
  const scores = useS2Leaderboard(draftState, tournamentData, wildcardStatus);

  const matchesPlayed = tournamentData.fixtures.filter((f) => f.status === 'FINISHED').length;
  const lastUpdated = tournamentData.fetchedAt
    ? new Date(tournamentData.fetchedAt).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const leader = scores[0];
  const maxGoals = scores.length > 0 ? Math.max(...scores.map((s) => s.totalGoals)) : 0;
  const topPrize = leader?.prizes.prizeTotal ?? 0;
  const isAllTied = scores.length > 1 && scores.every((s) => s.prizes.prizeTotal === topPrize && topPrize === 0);

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

      {/* Prize pot summary */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Total pot</span>
          <span className="text-white font-black text-xl">£250</span>
        </div>
        <div className="flex gap-2 mt-2 text-xs text-slate-500 flex-wrap">
          <span className="text-yellow-400">£100</span> Winner ·
          <span className="text-slate-300 ml-1">£40</span> Runner-up ·
          <span className="text-slate-300 ml-1">£20+£20</span> Semis ·
          <span className="text-slate-300 ml-1">£20</span> Goals ·
          <span className="text-purple-400 ml-1">£50</span> Wildcard
        </div>
      </div>

      {/* Wildcard status */}
      <WildcardBanner status={wildcardStatus} />

      {/* Standings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-slate-500 text-xs">
            {matchesPlayed > 0
              ? `Based on ${matchesPlayed} match${matchesPlayed === 1 ? '' : 'es'} played`
              : 'No matches played yet'}
          </p>
          <div className="flex items-center gap-3">
            {lastUpdated && !loading && (
              <span className="text-slate-600 text-xs">Updated {lastUpdated}</span>
            )}
            {loading && <span className="text-slate-600 text-xs animate-pulse">Updating…</span>}
            <button
              onClick={refresh}
              disabled={loading}
              className="text-slate-500 hover:text-slate-300 text-xs disabled:opacity-40"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {scores.length > 0 && !isAllTied && topPrize > 0 && (
          <div className="text-center py-2 mb-4">
            <p className="text-2xl font-black text-yellow-400">{leader.displayName} leads 👑</p>
          </div>
        )}

        {scores.length > 0 && (isAllTied || topPrize === 0) && (
          <div className="text-center py-2 mb-4">
            <p className="text-xl font-bold text-slate-300">Tournament underway ⚽</p>
          </div>
        )}

        <div className="space-y-4">
          {scores.map((score, i) => (
            <S2PlayerCard
              key={score.player}
              score={score}
              rank={i + 1}
              isLeading={i === 0 && topPrize > 0 && !isAllTied}
              maxGoals={maxGoals}
            />
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
