import type { PlayerId } from '../../types';
import { TEAM_MAP } from '../../data/teams';

interface Props {
  edTeams: string[];
  ajTeams: string[];
  currentPicker: PlayerId | null;
}

function PlayerList({
  player,
  teams,
  isActive,
}: {
  player: PlayerId;
  teams: string[];
  isActive: boolean;
}) {
  const label = player === 'ed' ? 'Ed' : 'AJ';
  const accent = player === 'ed' ? 'border-blue-500 text-blue-400' : 'border-rose-500 text-rose-400';
  const dotColour = player === 'ed' ? 'bg-blue-500' : 'bg-rose-500';

  return (
    <div className={`flex-1 rounded-xl border ${isActive ? accent + ' bg-slate-800' : 'border-slate-700 bg-slate-800/50'} p-3`}>
      <div className="flex items-center gap-2 mb-2">
        {isActive && <span className={`w-2 h-2 rounded-full ${dotColour} animate-pulse`} />}
        <span className={`font-bold text-sm ${isActive ? (player === 'ed' ? 'text-blue-400' : 'text-rose-400') : 'text-slate-400'}`}>
          {label} — {teams.length}/24
        </span>
      </div>
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {teams.map((id) => {
          const team = TEAM_MAP[id];
          return team ? (
            <div key={id} className="flex items-center gap-2 text-xs text-slate-300">
              <span>{team.flag}</span>
              <span>{team.name}</span>
            </div>
          ) : null;
        })}
        {teams.length === 0 && (
          <p className="text-slate-600 text-xs italic">No picks yet</p>
        )}
      </div>
    </div>
  );
}

export default function DraftSidebar({ edTeams, ajTeams, currentPicker }: Props) {
  return (
    <div className="flex flex-col gap-3 w-full lg:w-56 shrink-0">
      <PlayerList player="ed" teams={edTeams} isActive={currentPicker === 'ed'} />
      <PlayerList player="aj" teams={ajTeams} isActive={currentPicker === 'aj'} />
    </div>
  );
}
