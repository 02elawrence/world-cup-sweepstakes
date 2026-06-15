import type { Fixture } from '../../types';

interface Props {
  fixtures: Fixture[];
}

const STAGE_ORDER = ['ROUND_OF_32', 'ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINAL'];
const STAGE_LABELS: Record<string, string> = {
  ROUND_OF_32: 'R32',
  ROUND_OF_16: 'R16',
  QUARTER_FINALS: 'QF',
  SEMI_FINALS: 'SF',
  FINAL: 'Final',
};

function MatchBox({ fixture }: { fixture: Fixture }) {
  const { home, away } = fixture.score.fullTime;
  const isLive = fixture.status === 'IN_PLAY' || fixture.status === 'PAUSED';
  const isDone = fixture.status === 'FINISHED';

  const homeWon = isDone && home !== null && away !== null && home > away;
  const awayWon = isDone && home !== null && away !== null && away > home;

  return (
    <div className={`bg-slate-800 rounded-lg overflow-hidden w-44 border ${isLive ? 'border-green-500/50' : 'border-slate-700'}`}>
      <div className={`flex items-center justify-between px-3 py-1.5 border-b border-slate-700 ${homeWon ? 'bg-slate-700' : ''}`}>
        <span className={`text-xs ${homeWon ? 'text-white font-bold' : 'text-slate-400'} truncate`}>
          {fixture.homeTeam.name}
        </span>
        {home !== null && <span className={`text-xs font-bold ml-2 ${homeWon ? 'text-white' : 'text-slate-400'}`}>{home}</span>}
      </div>
      <div className={`flex items-center justify-between px-3 py-1.5 ${awayWon ? 'bg-slate-700' : ''}`}>
        <span className={`text-xs ${awayWon ? 'text-white font-bold' : 'text-slate-400'} truncate`}>
          {fixture.awayTeam.name}
        </span>
        {away !== null && <span className={`text-xs font-bold ml-2 ${awayWon ? 'text-white' : 'text-slate-400'}`}>{away}</span>}
      </div>
      {isLive && (
        <div className="px-3 py-1 bg-green-500/10 text-center">
          <span className="text-green-400 text-xs font-bold animate-pulse">LIVE</span>
        </div>
      )}
    </div>
  );
}

export default function KnockoutBracket({ fixtures }: Props) {
  const knockoutFixtures = fixtures.filter((f) => STAGE_ORDER.includes(f.stage));

  if (!knockoutFixtures.length) {
    return <p className="text-slate-500 text-sm text-center py-12">Knockout fixtures will appear after the group stage.</p>;
  }

  const byStage: Record<string, Fixture[]> = {};
  for (const stage of STAGE_ORDER) byStage[stage] = [];
  for (const f of knockoutFixtures) {
    if (byStage[f.stage]) byStage[f.stage].push(f);
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-8 pb-4 min-w-max">
        {STAGE_ORDER.map((stage) => {
          const matches = byStage[stage];
          if (!matches.length) return null;
          return (
            <div key={stage} className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                {STAGE_LABELS[stage]}
              </h3>
              <div className="flex flex-col justify-around gap-6 flex-1">
                {matches.map((f) => (
                  <MatchBox key={f.id} fixture={f} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
