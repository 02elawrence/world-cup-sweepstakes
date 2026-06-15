import { useCallback } from 'react';
import type { GroupDraftState, GroupPlayerId } from '../types';
import { save } from '../store/storage';

// Storage key bumped to v2 so any previously cached random draws are ignored.
const STORAGE_KEY = 'wcs_group_draft_2026_v2';

// The canonical draw — locked from the live assignment session.
// Every user on every device sees exactly these teams.
const LOCKED_ASSIGNMENTS: Record<GroupPlayerId, string[]> = {
  ted:    ['BEL', 'TUR', 'EGY', 'BIH'],
  char:   ['BRA', 'SUI', 'GHA', 'CUW'],
  steph:  ['POR', 'URU', 'SCO', 'PAN'],
  jamie:  ['GER', 'CRO', 'IRI', 'COD'],
  jack:   ['FRA', 'SEN', 'SAU', 'RSA'],
  millie: ['ENG', 'ECU', 'ALG', 'HAI'],
  tom:    ['COL', 'SWE', 'TUN', 'IRQ'],
  freaks: ['USA', 'JPN', 'PAR', 'JOR'],
  sam:    ['MAR', 'AUS', 'QAT', 'CAN'],
  ali:    ['ARG', 'MEX', 'CIV', 'CPV'],
  dave:   ['NED', 'KOR', 'NOR', 'UZB'],
  theo:   ['ESP', 'AUT', 'CZE', 'NZL'],
};

const LOCKED_STATE: GroupDraftState = {
  phase: 'complete',
  assignments: LOCKED_ASSIGNMENTS,
};

// Always write the locked state on load so stale localStorage draws are overwritten.
save(STORAGE_KEY, LOCKED_STATE);

export function useGroupDraft() {
  const state: GroupDraftState = LOCKED_STATE;

  const getPlayerTeams = useCallback(
    (player: GroupPlayerId): string[] => state.assignments[player] ?? [],
    [state.assignments]
  );

  return { state, getPlayerTeams };
}
