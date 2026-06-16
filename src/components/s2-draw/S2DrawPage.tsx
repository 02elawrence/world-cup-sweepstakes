import { useS2Draft } from '../../hooks/useS2Draft';
import { TEAM_MAP } from '../../data/teams';
import { S2_PLAYERS } from '../../data/s2Players';
import { WILDCARD_TEAM_IDS } from '../../hooks/useS2Wildcard';

const POT1_IDS = new Set(['ARG', 'FRA', 'ESP', 'ENG', 'BRA', 'POR', 'NED', 'GER', 'BEL', 'CRO']);

function tierBadge(teamId: string): { label: string; cls: string } | null {
  if (POT1_IDS.has(teamId)) return { label: 'Pot 1', cls: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' };
  if (WILDCARD_TEAM_IDS.includes(teamId)) return { label: 'Wildcard', cls: 'bg-purple-500/20 text-purple-300 border border-purple-500/40' };
  return null;
}

export default function S2DrawPage() {
  const { state } = useS2Draft();

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-2xl font-black text-white">Sweepstake Draw</h2>
        <p className="text-slate-400 mt-1 text-sm">10 players · £250 pot · 4 teams each</p>
        <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
          <span className="text-xs rounded-full px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">🥇 Pot 1</span>
          <span className="text-xs rounded-full px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40">🃏 Wildcard</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {S2_PLAYERS.map(({ id, name, ticketNumber, borderClass, textClass }) => {
          const teamIds = state.assignments[id] ?? [];
          const teams = teamIds.map((tid) => TEAM_MAP[tid]).filter(Boolean);

          return (
            <div key={id} className={`rounded-xl border-2 ${borderClass} bg-slate-800 p-4`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-black text-lg ${textClass}`}>{name}</h3>
                <span className="text-xs text-slate-500 bg-slate-700 rounded-full px-2 py-0.5">
                  #{ticketNumber}
                </span>
              </div>
              <div className="space-y-2">
                {teams.map((team) => {
                  const badge = tierBadge(team.id);
                  return (
                    <div key={team.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="text-base">{team.flag}</span>
                        <span>{team.name}</span>
                      </div>
                      {badge && (
                        <span className={`text-xs rounded-full px-2 py-0.5 shrink-0 ${badge.cls}`}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Prize structure */}
      <div className="mt-10 bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-4">💰 Prize Structure</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Winner', amount: '£100', sub: 'Tournament champion' },
            { label: 'Runner-up', amount: '£40', sub: 'Finalist (loser)' },
            { label: 'Semi-final x2', amount: '£20ea', sub: 'Losing semi-finalists' },
            { label: 'Most Goals', amount: '£20', sub: 'Combined goals, all teams' },
          ].map(({ label, amount, sub }) => (
            <div key={label} className="bg-slate-700/50 rounded-xl p-3 text-center">
              <p className="text-yellow-400 font-black text-xl">{amount}</p>
              <p className="text-white text-xs font-semibold mt-1">{label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700 pt-4">
          <h4 className="text-purple-400 font-bold mb-2">🃏 Wildcard Pot — £50</h4>
          <p className="text-slate-400 text-sm mb-2">
            If <span className="text-white">any</span> wildcard team does one of the following, the £50 is split equally (£5 each):
          </p>
          <ul className="space-y-1 text-sm text-slate-300 ml-2">
            <li>• Beats a <span className="text-yellow-300">Pot 1</span> team</li>
            <li>• Reaches the <span className="text-yellow-300">Last 16</span></li>
            <li>• Scores <span className="text-yellow-300">3+ goals</span> against a Pot 1 team</li>
          </ul>
          <p className="text-slate-500 text-xs mt-2">
            If none happen → the £50 is added to the winner's prize (making it £150).
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {WILDCARD_TEAM_IDS.map((id) => {
              const team = TEAM_MAP[id];
              if (!team) return null;
              return (
                <span key={id} className="text-xs bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-full px-2 py-0.5">
                  {team.flag} {team.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
