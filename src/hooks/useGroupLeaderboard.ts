import { useMemo } from 'react';
import type { GroupDraftState, GroupPlayerScore, TeamScore } from '../types';
import type { TournamentData } from '../types';
import { TEAM_MAP } from '../data/teams';
import { GROUP_PLAYERS } from '../data/groupPlayers';

interface TeamStats {
  groupWon: number;
  knockoutWins: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

const KNOCKOUT_STAGES = new Set([
  'ROUND_OF_32', 'LAST_32', 'ROUND_OF_16', 'LAST_16',
  'QUARTER_FINALS', 'SEMI_FINALS', 'FINAL',
]);

function buildStatsFromMatches(data: TournamentData): Map<number, TeamStats> {
  const map = new Map<number, TeamStats>();
  const ensure = (id: number) => {
    if (!map.has(id)) map.set(id, { groupWon: 0, knockoutWins: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 });
  };

  for (const fixture of data.fixtures) {
    if (fixture.status !== 'FINISHED') continue;
    const { home, away } = fixture.score.fullTime;
    if (home === null || away === null) continue;

    const hId = fixture.homeTeam.id;
    const aId = fixture.awayTeam.id;
    ensure(hId);
    ensure(aId);

    const h = map.get(hId)!;
    const a = map.get(aId)!;

    h.goalsFor += home;  h.goalsAgainst += away;
    a.goalsFor += away;  a.goalsAgainst += home;

    if (KNOCKOUT_STAGES.has(fixture.stage)) {
      // Determine who advances — wins in 90 mins, AET, or on penalties all count equally
      let winnerId: number;
      if (home > away) {
        winnerId = hId;
      } else if (away > home) {
        winnerId = aId;
      } else {
        const pen = fixture.score.penalties;
        winnerId = (pen?.home ?? 0) > (pen?.away ?? 0) ? hId : aId;
      }
      if (winnerId === hId) { h.knockoutWins++; a.lost++; }
      else                  { a.knockoutWins++; h.lost++; }
    } else {
      if (home > away)      { h.groupWon++; a.lost++;  }
      else if (away > home) { a.groupWon++; h.lost++;  }
      else                  { h.drawn++;    a.drawn++; }
    }
  }

  return map;
}

function getWorldCupWinnerApiId(data: TournamentData): number | null {
  const final = data.fixtures.find((f) => f.stage === 'FINAL' && f.status === 'FINISHED');
  if (!final) return null;
  const { home, away } = final.score.fullTime;
  if (home === null || away === null) return null;
  if (home > away) return final.homeTeam.id;
  if (away > home) return final.awayTeam.id;
  const pen = final.score.penalties;
  if (pen?.home !== null && pen?.away !== null && pen) {
    return (pen.home ?? 0) > (pen.away ?? 0) ? final.homeTeam.id : final.awayTeam.id;
  }
  return null;
}

export function useGroupLeaderboard(
  draftState: GroupDraftState,
  tournamentData: TournamentData
): GroupPlayerScore[] {
  return useMemo(() => {
    if (draftState.phase !== 'complete') return [];

    const teamStats = buildStatsFromMatches(tournamentData);
    const winnerApiId = getWorldCupWinnerApiId(tournamentData);

    return GROUP_PLAYERS.map(({ id: player, name: displayName }) => {
      const teamIds = draftState.assignments[player] ?? [];

      const breakdown: TeamScore[] = teamIds.map((teamId) => {
        const teamMeta = TEAM_MAP[teamId];
        if (!teamMeta) return null;

        const stats = teamMeta.apiId ? teamStats.get(teamMeta.apiId) : undefined;
        const groupWon = stats?.groupWon ?? 0;
        const knockoutWins = stats?.knockoutWins ?? 0;
        const won   = groupWon + knockoutWins;
        const drawn = stats?.drawn ?? 0;
        const lost  = stats?.lost  ?? 0;
        const gf    = stats?.goalsFor     ?? 0;
        const ga    = stats?.goalsAgainst ?? 0;
        const isChampion = teamMeta.apiId !== 0 && teamMeta.apiId === winnerApiId;
        const points = groupWon * 3 + drawn + knockoutWins * 4 + (isChampion ? 5 : 0);

        return {
          teamId,
          teamName: teamMeta.name,
          flag: teamMeta.flag,
          points,
          played: won + drawn + lost,
          won,
          drawn,
          lost,
          goalsFor: gf,
          goalsAgainst: ga,
          goalDifference: gf - ga,
          isChampion,
        } satisfies TeamScore;
      }).filter((t): t is TeamScore => t !== null);

      const totalPoints  = breakdown.reduce((s, t) => s + t.points, 0);
      const goalsFor     = breakdown.reduce((s, t) => s + t.goalsFor, 0);
      const goalsAgainst = breakdown.reduce((s, t) => s + t.goalsAgainst, 0);

      return {
        player,
        displayName,
        totalPoints,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
        teamBreakdown: [...breakdown].sort(
          (a, b) => b.points - a.points || b.goalDifference - a.goalDifference
        ),
      } satisfies GroupPlayerScore;
    }).sort(
      (a, b) => b.totalPoints - a.totalPoints || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor
    );
  }, [draftState, tournamentData]);
}
