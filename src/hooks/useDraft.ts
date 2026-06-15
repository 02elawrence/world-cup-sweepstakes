import { useCallback } from 'react';
import type { DraftState, PlayerId } from '../types';
import { save } from '../store/storage';

// Storage key bumped to v2 so any previously cached state on other devices is overwritten.
const STORAGE_KEY = 'wcs_draft_2026_v2';

// Canonical locked draw — matches the completed snake draft session.
// Hard-coded so every device/browser always shows exactly these picks.
const ED_TEAMS = ['FRA','POR','BRA','GER','BEL','TUR','MAR','KOR','CAN','CRO','EGY','PAR','NOR','COD','ALG','BIH','GHA','SAU','NZL','AUS','RSA','UZB','IRQ','HAI'];
const AJ_TEAMS = ['ESP','ENG','ARG','NED','SUI','MEX','COL','URU','SEN','JPN','ECU','AUT','CIV','SCO','QAT','SWE','CZE','USA','TUN','IRI','JOR','PAN','CUW','CPV'];

const LOCKED_STATE: DraftState = {
  phase: 'complete',
  firstPicker: 'ed',
  currentPickNumber: 49,
  picks: [
    ...ED_TEAMS.map((teamId, i) => ({ teamId, player: 'ed' as PlayerId, pickNumber: i * 2 + 1 })),
    ...AJ_TEAMS.map((teamId, i) => ({ teamId, player: 'aj' as PlayerId, pickNumber: i * 2 + 2 })),
  ],
};

// Overwrite any stale localStorage on load.
save(STORAGE_KEY, LOCKED_STATE);

export function useDraft() {
  const state: DraftState = LOCKED_STATE;

  const getPlayerTeams = useCallback(
    (player: PlayerId): string[] =>
      state.picks.filter((p) => p.player === player).map((p) => p.teamId),
    [state.picks]
  );

  const isTeamPicked = useCallback(
    (teamId: string): PlayerId | null => {
      const pick = state.picks.find((p) => p.teamId === teamId);
      return pick ? pick.player : null;
    },
    [state.picks]
  );

  return {
    state,
    getPlayerTeams,
    isTeamPicked,
  };
}
