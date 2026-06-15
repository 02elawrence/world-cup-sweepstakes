import { useDraft } from '../../hooks/useDraft';
import { TEAM_MAP } from '../../data/teams';

export default function DraftPage() {
  const { getPlayerTeams } = useDraft();

  const edTeams = getPlayerTeams('ed');
  const ajTeams = getPlayerTeams('aj');

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">✅</div>
        <h2 className="text-2xl font-black text-white">Draft Complete!</h2>
        <p className="text-slate-400 mt-1">24 teams each — let the sweepstake begin.</p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {(['ed', 'aj'] as const).map((player) => {
          const teams = player === 'ed' ? edTeams : ajTeams;
          const label = player === 'ed' ? 'Ed' : 'AJ';
          const colour = player === 'ed' ? 'border-blue-500' : 'border-rose-500';
          const headingColour = player === 'ed' ? 'text-blue-400' : 'text-rose-400';
          return (
            <div key={player} className={`rounded-xl border ${colour} bg-slate-800 p-4`}>
              <h3 className={`font-bold mb-3 ${headingColour}`}>{label}'s Teams ({teams.length})</h3>
              <div className="space-y-1.5">
                {teams.map((id) => {
                  const found = TEAM_MAP[id];
                  return (
                    <div key={id} className="flex items-center gap-2 text-sm text-slate-300">
                      <span>{found?.flag}</span>
                      <span>{found?.name || id}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
