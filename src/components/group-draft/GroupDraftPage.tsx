import { useGroupDraft } from '../../hooks/useGroupDraft';
import { TEAM_MAP } from '../../data/teams';
import { GROUP_PLAYERS } from '../../data/groupPlayers';

const TIER_BADGE: Record<number, string> = {
  0: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40',
  1: 'bg-slate-400/20 text-slate-300 border border-slate-400/40',
  2: 'bg-amber-700/20 text-amber-400 border border-amber-700/40',
  3: 'bg-slate-700/40 text-slate-400 border border-slate-600/40',
};

function tierOf(fifaRank: number): number {
  return Math.floor((fifaRank - 1) / 12);
}

export default function GroupDraftPage() {
  const { state } = useGroupDraft();

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">✅</div>
        <h2 className="text-2xl font-black text-white">Draw Complete</h2>
        <p className="text-slate-400 mt-1 text-sm">
          4 seeded tiers · one team from each tier · locked for all players
        </p>
        <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
          {(['🥇 Tier 1', '🥈 Tier 2', '🥉 Tier 3', '4️⃣ Tier 4'] as const).map((label, i) => (
            <span key={i} className={`text-xs rounded-full px-3 py-1 ${TIER_BADGE[i]}`}>{label}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GROUP_PLAYERS.map(({ id, name, borderClass, textClass }) => {
          const teamIds = state.assignments[id] ?? [];
          const teams = teamIds.map((tid) => TEAM_MAP[tid]).filter(Boolean);

          return (
            <div key={id} className={`rounded-xl border-2 ${borderClass} bg-slate-800 p-4`}>
              <h3 className={`font-black text-lg mb-3 ${textClass}`}>{name}</h3>
              <div className="space-y-2">
                {teams.map((team) => {
                  const tier = tierOf(team.fifaRank);
                  return (
                    <div key={team.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="text-base">{team.flag}</span>
                        <span>{team.name}</span>
                      </div>
                      <span className={`text-xs rounded-full px-2 py-0.5 shrink-0 ${TIER_BADGE[tier]}`}>
                        T{tier + 1}
                      </span>
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
