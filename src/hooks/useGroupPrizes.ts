import { useMemo } from 'react';
import type { GroupDraftState, GroupPlayerId, TournamentData } from '../types';
import { TEAM_MAP, API_ID_TO_TEAM_ID } from '../data/teams';
import { GROUP_PLAYER_MAP } from '../data/groupPlayers';

function buildOwnerMap(assignments: Partial<Record<GroupPlayerId, string[]>>): Record<string, GroupPlayerId> {
  const map: Record<string, GroupPlayerId> = {};
  for (const [player, teamIds] of Object.entries(assignments)) {
    for (const teamId of teamIds ?? []) {
      map[teamId] = player as GroupPlayerId;
    }
  }
  return map;
}

export interface PrizeWinner {
  teamId: string | null;
  teamName: string;
  teamFlag: string;
  ownerPlayer: GroupPlayerId | null;
  ownerName: string;
  statValue: string;
}

export interface GroupPrizes {
  mostGoals: PrizeWinner;
  mostConcededGroup: PrizeWinner;
}

const NONE: PrizeWinner = {
  teamId: null,
  teamName: '—',
  teamFlag: '',
  ownerPlayer: null,
  ownerName: '—',
  statValue: 'No data yet',
};

function toWinner(
  teamApiId: number,
  statValue: string,
  ownerMap: Record<string, GroupPlayerId>,
): PrizeWinner {
  const teamId = API_ID_TO_TEAM_ID[teamApiId] ?? null;
  const teamMeta = teamId ? TEAM_MAP[teamId] : null;
  const ownerPlayer = teamId ? (ownerMap[teamId] ?? null) : null;
  const ownerMeta = ownerPlayer ? GROUP_PLAYER_MAP[ownerPlayer] : null;
  return {
    teamId,
    teamName: teamMeta?.name ?? 'Unknown',
    teamFlag: teamMeta?.flag ?? '',
    ownerPlayer,
    ownerName: ownerMeta?.name ?? 'Unowned',
    statValue,
  };
}

export function useGroupPrizes(
  draftState: GroupDraftState,
  tournamentData: TournamentData,
): GroupPrizes | null {
  return useMemo(() => {
    if (draftState.phase !== 'complete') return null;

    const ownerMap = buildOwnerMap(draftState.assignments);
    const finished = tournamentData.fixtures.filter((f) => f.status === 'FINISHED');

    // ── Most goals scored (whole tournament) ─────────────────────────────────
    const goalsFor = new Map<number, number>();
    for (const f of finished) {
      const { home, away } = f.score.fullTime;
      if (home === null || away === null) continue;
      goalsFor.set(f.homeTeam.id, (goalsFor.get(f.homeTeam.id) ?? 0) + home);
      goalsFor.set(f.awayTeam.id, (goalsFor.get(f.awayTeam.id) ?? 0) + away);
    }

    let topScorerApiId: number | null = null;
    let topGoals = 0;
    for (const [apiId, g] of goalsFor) {
      if (g > topGoals) { topGoals = g; topScorerApiId = apiId; }
    }

    // ── Most conceded in group stage ─────────────────────────────────────────
    const goalsConceded = new Map<number, number>();
    for (const f of finished) {
      if (f.group === null) continue;
      const { home, away } = f.score.fullTime;
      if (home === null || away === null) continue;
      goalsConceded.set(f.homeTeam.id, (goalsConceded.get(f.homeTeam.id) ?? 0) + away);
      goalsConceded.set(f.awayTeam.id, (goalsConceded.get(f.awayTeam.id) ?? 0) + home);
    }

    let mostConcededApiId: number | null = null;
    let mostConceded = 0;
    for (const [apiId, c] of goalsConceded) {
      if (c > mostConceded) { mostConceded = c; mostConcededApiId = apiId; }
    }

    return {
      mostGoals: topScorerApiId !== null
        ? toWinner(topScorerApiId, `${topGoals} goals`, ownerMap)
        : NONE,
      mostConcededGroup: mostConcededApiId !== null
        ? toWinner(mostConcededApiId, `${mostConceded} conceded`, ownerMap)
        : NONE,
    };
  }, [draftState, tournamentData]);
}
