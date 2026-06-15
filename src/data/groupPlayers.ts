import type { GroupPlayerId } from '../types';

export interface GroupPlayer {
  id: GroupPlayerId;
  name: string;
  borderClass: string;
  textClass: string;
}

export const GROUP_PLAYERS: GroupPlayer[] = [
  { id: 'ted',    name: 'Ted',    borderClass: 'border-blue-500',   textClass: 'text-blue-400'   },
  { id: 'char',   name: 'Char',   borderClass: 'border-rose-500',   textClass: 'text-rose-400'   },
  { id: 'steph',  name: 'Steph',  borderClass: 'border-green-500',  textClass: 'text-green-400'  },
  { id: 'jamie',  name: 'Jamie',  borderClass: 'border-orange-500', textClass: 'text-orange-400' },
  { id: 'jack',   name: 'Jack',   borderClass: 'border-purple-500', textClass: 'text-purple-400' },
  { id: 'millie', name: 'Millie', borderClass: 'border-pink-500',   textClass: 'text-pink-400'   },
  { id: 'tom',    name: 'Tom',    borderClass: 'border-teal-500',   textClass: 'text-teal-400'   },
  { id: 'freaks', name: 'Freaks', borderClass: 'border-yellow-500', textClass: 'text-yellow-400' },
  { id: 'sam',    name: 'Sam',    borderClass: 'border-indigo-500', textClass: 'text-indigo-400' },
  { id: 'ali',    name: 'Ali',    borderClass: 'border-red-500',    textClass: 'text-red-400'    },
  { id: 'dave',   name: 'Dave',   borderClass: 'border-cyan-500',   textClass: 'text-cyan-400'   },
  { id: 'theo',   name: 'Theo',   borderClass: 'border-lime-500',   textClass: 'text-lime-400'   },
];

export const GROUP_PLAYER_MAP: Record<GroupPlayerId, GroupPlayer> = Object.fromEntries(
  GROUP_PLAYERS.map((p) => [p.id, p])
) as Record<GroupPlayerId, GroupPlayer>;
