import type { S2DraftState, S2PlayerId } from '../types';

// Draw from popsicle-stick board, confirmed 2026-06-15.
// Play-off slots resolved: Makin → Turkey, Francis → Sweden, Ted → Senegal.
const S2_LOCKED_ASSIGNMENTS: Record<S2PlayerId, string[]> = {
  jake:     ['CAN', 'ALG', 'SUI', 'FRA'],
  makin:    ['SAU', 'TUR', 'SCO', 'CRO'],
  quinn:    ['UZB', 'GHA', 'URU', 'NED'],
  guthrie:  ['JOR', 'CIV', 'JPN', 'ESP'],
  ted:      ['SEN', 'TUN', 'USA', 'ARG'],
  dawson:   ['NOR', 'ECU', 'MEX', 'POR'],
  johnson:  ['CPV', 'PAR', 'MAR', 'BEL'],
  bass:     ['QAT', 'PAN', 'AUT', 'BRA'],
  somerset: ['NZL', 'EGY', 'COL', 'ENG'],
  francis:  ['SWE', 'AUS', 'KOR', 'GER'],
};

export const S2_DRAFT_STATE: S2DraftState = {
  phase: 'complete',
  assignments: S2_LOCKED_ASSIGNMENTS,
};

export function useS2Draft() {
  return {
    state: S2_DRAFT_STATE,
    getPlayerTeams: (player: S2PlayerId): string[] =>
      S2_LOCKED_ASSIGNMENTS[player] ?? [],
  };
}
