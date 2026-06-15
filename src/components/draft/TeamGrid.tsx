import { TEAMS } from '../../data/teams';
import type { PlayerId } from '../../types';
import TeamCard from './TeamCard';

interface Props {
  isTeamPicked: (id: string) => PlayerId | null;
  currentPicker: PlayerId | null;
  onPick: (teamId: string) => void;
}

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export default function TeamGrid({ isTeamPicked, currentPicker, onPick }: Props) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      {GROUPS.map((group) => {
        const groupTeams = TEAMS.filter((t) => t.group === group);
        return (
          <div key={group}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Group {group}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {groupTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  owner={isTeamPicked(team.id)}
                  isCurrentPicker={currentPicker !== null}
                  onPick={onPick}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
