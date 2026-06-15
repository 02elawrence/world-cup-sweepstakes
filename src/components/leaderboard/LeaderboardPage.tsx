import { useDraft } from '../../hooks/useDraft';
import { useTournament } from '../../hooks/useTournament';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import PlayerCard from './PlayerCard';

export default function LeaderboardPage() {
  const { state: draftState } = useDraft();
  const { data: tournamentData, loading, error, refresh, clearCache } = useTournament();
  const scores = useLeaderboard(draftState, tournamentData);

  if (draftState.phase === 'idle' || draftState.phase === 'coin_flip') {
    return (
      <div className="flex flex-col items-center py-20 text-center px-4 gap-4">
        <div className="text-5xl">📋</div>
        <h2 className="text-xl font-bold text-white">Leaderboard locked</h2>
        <p className="text-slate-400 text-sm">Complete the draft first to see the sweepstake standings.</p>
      </div>
    );
  }

  const isTied = scores.length === 2 && scores[0].totalPoints === scores[1].totalPoints;
  const matchesPlayed = tournamentData.fixtures.filter(f => f.status === 'FINISHED').length;
  const lastUpdated = tournamentData.fetchedAt
    ? new Date(tournamentData.fetchedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
      {/* Error banner */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg px-4 py-3 flex items-center justify-between">
          <p className="text-red-400 text-sm">⚠ {error}</p>
          <button onClick={clearCache} className="text-red-400 hover:text-red-300 text-xs underline ml-4">
            Clear cache & retry
          </button>
        </div>
      )}

      {/* Meta bar */}
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-xs">
          {matchesPlayed > 0 ? `Based on ${matchesPlayed} match${matchesPlayed === 1 ? '' : 'es'} played` : 'No matches played yet'}
        </p>
        <div className="flex items-center gap-3">
          {lastUpdated && !loading && <span className="text-slate-600 text-xs">Updated {lastUpdated}</span>}
          {loading && <span className="text-slate-600 text-xs animate-pulse">Updating…</span>}
          <button onClick={refresh} disabled={loading} className="text-slate-500 hover:text-slate-300 text-xs disabled:opacity-40">
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Winner banner */}
      {scores.length > 0 && (
        <div className="text-center py-2">
          {!isTied ? (
            <p className="text-2xl font-black text-yellow-400">{scores[0].displayName} leads 👑</p>
          ) : (
            <p className="text-2xl font-bold text-white">All square ⚖️</p>
          )}
        </div>
      )}

      {/* Player cards */}
      {scores.map((score, i) => (
        <PlayerCard key={score.player} score={score} rank={i + 1} isLeading={i === 0 && !isTied} />
      ))}

      {scores.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-sm mb-3">Scores will appear once matches are played.</p>
          {!tournamentData.fetchedAt && (
            <button onClick={clearCache} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm">
              Load live data
            </button>
          )}
        </div>
      )}
    </div>
  );
}
