import type { Team, PlayerId } from '../../types';

interface Props {
  team: Team;
  owner: PlayerId | null;
  isCurrentPicker: boolean;
  onPick: (teamId: string) => void;
}

const PLAYER_COLOURS: Record<PlayerId, string> = {
  ed: 'bg-blue-600 border-blue-500',
  aj: 'bg-rose-600 border-rose-500',
};

const PLAYER_LABEL: Record<PlayerId, string> = {
  ed: 'Ed',
  aj: 'AJ',
};

export default function TeamCard({ team, owner, isCurrentPicker, onPick }: Props) {
  if (owner) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-2 rounded-lg border ${PLAYER_COLOURS[owner]} opacity-60 select-none`}
      >
        <span className="text-2xl">{team.flag}</span>
        <span className="text-xs text-white font-medium mt-1 truncate w-full text-center leading-tight">
          {team.name}
        </span>
        <span className="text-xs text-white/70 mt-0.5">{PLAYER_LABEL[owner]}</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => isCurrentPicker && onPick(team.id)}
      className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all
        ${
          isCurrentPicker
            ? 'bg-slate-700 border-slate-500 hover:bg-slate-600 hover:border-yellow-400 hover:scale-105 cursor-pointer'
            : 'bg-slate-800 border-slate-700 cursor-default'
        }`}
    >
      <span className="text-2xl">{team.flag}</span>
      <span className="text-xs text-slate-200 font-medium mt-1 truncate w-full text-center leading-tight">
        {team.name}
      </span>
      <span className="text-xs text-slate-500 mt-0.5">Grp {team.group}</span>
    </button>
  );
}
