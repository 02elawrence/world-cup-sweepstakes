import type { S2PlayerId } from '../types';

export interface S2Player {
  id: S2PlayerId;
  name: string;
  ticketNumber: number;
  borderClass: string;
  textClass: string;
}

export const S2_PLAYERS: S2Player[] = [
  { id: 'jake',     name: 'Jake',     ticketNumber: 1,  borderClass: 'border-violet-500',  textClass: 'text-violet-400'  },
  { id: 'makin',    name: 'Makin',    ticketNumber: 2,  borderClass: 'border-amber-500',   textClass: 'text-amber-400'   },
  { id: 'quinn',    name: 'Quinn',    ticketNumber: 3,  borderClass: 'border-emerald-500', textClass: 'text-emerald-400' },
  { id: 'guthrie',  name: 'Guthrie',  ticketNumber: 4,  borderClass: 'border-sky-500',     textClass: 'text-sky-400'     },
  { id: 'ted',      name: 'Ted',      ticketNumber: 5,  borderClass: 'border-rose-500',    textClass: 'text-rose-400'    },
  { id: 'dawson',   name: 'Dawson',   ticketNumber: 6,  borderClass: 'border-orange-500',  textClass: 'text-orange-400'  },
  { id: 'johnson',  name: 'Johnson',  ticketNumber: 7,  borderClass: 'border-teal-500',    textClass: 'text-teal-400'    },
  { id: 'bass',     name: 'Bass',     ticketNumber: 8,  borderClass: 'border-indigo-500',  textClass: 'text-indigo-400'  },
  { id: 'somerset', name: 'Somerset', ticketNumber: 9,  borderClass: 'border-lime-500',    textClass: 'text-lime-400'    },
  { id: 'francis',  name: 'Francis',  ticketNumber: 10, borderClass: 'border-pink-500',    textClass: 'text-pink-400'    },
];

export const S2_PLAYER_MAP: Record<S2PlayerId, S2Player> = Object.fromEntries(
  S2_PLAYERS.map((p) => [p.id, p])
) as Record<S2PlayerId, S2Player>;
