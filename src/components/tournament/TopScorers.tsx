import type { Scorer, TournamentData } from '../../types';
import { API_ID_TO_TEAM_ID, TEAM_MAP } from '../../data/teams';

interface Props {
  scorers: Scorer[];
  fixtures: TournamentData['fixtures'];
}

function getFlag(teamApiId: number): string {
  const id = API_ID_TO_TEAM_ID[teamApiId];
  return id ? (TEAM_MAP[id]?.flag ?? '') : '';
}

function cleanSheets(fixtures: TournamentData['fixtures']): Array<{ name: string; flag: string; count: number }> {
  const counts = new Map<number, number>();
  for (const f of fixtures) {
    if (f.status !== 'FINISHED') continue;
    const { home, away } = f.score.fullTime;
    if (home === null || away === null) continue;
    if (away === 0) {
      counts.set(f.homeTeam.id, (counts.get(f.homeTeam.id) ?? 0) + 1);
    }
    if (home === 0) {
      counts.set(f.awayTeam.id, (counts.get(f.awayTeam.id) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([id, count]) => {
      const teamId = API_ID_TO_TEAM_ID[id];
      const team = teamId ? TEAM_MAP[teamId] : null;
      return { name: team?.name ?? `Team ${id}`, flag: team?.flag ?? '', count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export default function TopScorers({ scorers, fixtures }: Props) {
  const sheets = cleanSheets(fixtures);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Top Scorers */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">⚽ Top Scorers</h3>
        {!scorers.length ? (
          <p className="text-slate-600 text-sm">No data yet.</p>
        ) : (
          <div className="space-y-2">
            {scorers.slice(0, 10).map((s, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-800 rounded-lg px-3 py-2">
                <span className="text-slate-500 text-xs w-4">{i + 1}</span>
                <span className="text-sm flex-1 text-white">{s.player.name}</span>
                <span className="text-xs text-slate-400">{getFlag(s.team.id)} {s.team.name}</span>
                <span className="text-sm font-bold text-yellow-400 w-6 text-right">{s.goals}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Assists */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">🎯 Top Assists</h3>
        {!scorers.length ? (
          <p className="text-slate-600 text-sm">No data yet.</p>
        ) : (
          <div className="space-y-2">
            {[...scorers]
              .filter((s) => (s.assists ?? 0) > 0)
              .sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0))
              .slice(0, 10)
              .map((s, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-800 rounded-lg px-3 py-2">
                  <span className="text-slate-500 text-xs w-4">{i + 1}</span>
                  <span className="text-sm flex-1 text-white">{s.player.name}</span>
                  <span className="text-xs text-slate-400">{getFlag(s.team.id)} {s.team.name}</span>
                  <span className="text-sm font-bold text-blue-400 w-6 text-right">{s.assists}</span>
                </div>
              ))}
            {scorers.filter((s) => (s.assists ?? 0) > 0).length === 0 && (
              <p className="text-slate-600 text-sm">No assists recorded yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Clean Sheets */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">🧤 Clean Sheets</h3>
        {!sheets.length ? (
          <p className="text-slate-600 text-sm">No data yet.</p>
        ) : (
          <div className="space-y-2">
            {sheets.map((s, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-800 rounded-lg px-3 py-2">
                <span className="text-slate-500 text-xs w-4">{i + 1}</span>
                <span className="text-lg">{s.flag}</span>
                <span className="text-sm flex-1 text-white">{s.name}</span>
                <span className="text-sm font-bold text-green-400 w-6 text-right">{s.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
