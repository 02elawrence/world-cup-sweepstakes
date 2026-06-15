import type { Fixture } from '../../types';

interface Props {
  fixtures: Fixture[];
}

function statusBadge(status: Fixture['status']) {
  if (status === 'IN_PLAY' || status === 'PAUSED')
    return <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400 font-bold animate-pulse">LIVE</span>;
  if (status === 'FINISHED')
    return <span className="px-2 py-0.5 rounded text-xs bg-slate-600 text-slate-400">FT</span>;
  return null;
}

function formatDate(utcDate: string) {
  const d = new Date(utcDate);
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function scoreDisplay(fixture: Fixture) {
  const { home, away } = fixture.score.fullTime;
  if (home === null || away === null) return formatDate(fixture.utcDate);
  const pen = fixture.score.penalties;
  const penStr = pen && pen.home !== null ? ` (${pen.home}–${pen.away} pens)` : '';
  return `${home} – ${away}${penStr}`;
}

function groupByStage(fixtures: Fixture[]): Array<{ stage: string; fixtures: Fixture[] }> {
  const order = ['GROUP_STAGE', 'ROUND_OF_32', 'ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'THIRD_PLACE', 'FINAL'];
  const map = new Map<string, Fixture[]>();
  for (const f of fixtures) {
    const key = f.stage ?? 'OTHER';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(f);
  }
  return [...map.entries()]
    .sort(([a], [b]) => {
      const ia = order.indexOf(a); const ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    })
    .map(([stage, fs]) => ({
      stage: stage.replace(/_/g, ' '),
      fixtures: fs.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()),
    }));
}

export default function FixtureList({ fixtures }: Props) {
  if (!fixtures.length) {
    return <p className="text-slate-500 text-sm text-center py-12">Fixtures will appear here once available.</p>;
  }

  const grouped = groupByStage(fixtures);

  return (
    <div className="space-y-6">
      {grouped.map(({ stage, fixtures: stageFix }) => (
        <div key={stage}>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{stage}</h3>
          <div className="space-y-2">
            {stageFix.map((f) => (
              <div
                key={f.id}
                className={`flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3 ${
                  f.status === 'IN_PLAY' || f.status === 'PAUSED' ? 'border border-green-500/30' : ''
                }`}
              >
                <div className="flex items-center gap-2 w-2/5 justify-end">
                  <span className="text-sm text-white font-medium text-right">{f.homeTeam.name}</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-4">
                  <span className="text-sm font-bold text-white whitespace-nowrap">{scoreDisplay(f)}</span>
                  {statusBadge(f.status)}
                </div>
                <div className="flex items-center gap-2 w-2/5">
                  <span className="text-sm text-white font-medium">{f.awayTeam.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
