import { useMemo } from 'react';
import type { DraftState, TournamentData, PlayerScore, TeamScore, PlayerId } from '../types';
import { TEAM_MAP } from '../data/teams';

interface TeamStats {
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

// Calculate every team's stats directly from individual finished matches.
// This is more real-time than the standings endpoint and handles both
// group stage and knockout rounds in one pass.
function buildStatsFromMatches(data: TournamentData): Map<number, TeamStats> {
  const map = new Map<number, TeamStats>();

  const ensure = (id: number) => {
    if (!map.has(id)) map.set(id, { won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 });
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

    if (home > away)       { h.won++;   a.lost++;  }
    else if (away > home)  { a.won++;   h.lost++;  }
    else                   { h.drawn++; a.drawn++; } // includes penalty-win games
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

export function useLeaderboard(draftState: DraftState, tournamentData: TournamentData): PlayerScore[] {
  return useMemo(() => {
    if (draftState.phase !== 'picking' && draftState.phase !== 'complete') return [];

    const teamStats = buildStatsFromMatches(tournamentData);
    const winnerApiId = getWorldCupWinnerApiId(tournamentData);

    const players: PlayerId[] = ['ed', 'aj'];
    return players.map((player) => {
      const teamIds = draftState.picks
        .filter((p) => p.player === player)
        .map((p) => p.teamId);

      const breakdown: TeamScore[] = teamIds.map((teamId) => {
        const teamMeta = TEAM_MAP[teamId];
        if (!teamMeta) return null;

        const stats = teamMeta.apiId ? teamStats.get(teamMeta.apiId) : undefined;
        const won   = stats?.won   ?? 0;
        const drawn = stats?.drawn ?? 0;
        const lost  = stats?.lost  ?? 0;
        const gf    = stats?.goalsFor     ?? 0;
        const ga    = stats?.goalsAgainst ?? 0;
        const isChampion = teamMeta.apiId !== 0 && teamMeta.apiId === winnerApiId;
        const points = won * 3 + drawn + (isChampion ? 5 : 0);

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

      const totalPoints   = breakdown.reduce((s, t) => s + t.points, 0);
      const goalsFor      = breakdown.reduce((s, t) => s + t.goalsFor, 0);
      const goalsAgainst  = breakdown.reduce((s, t) => s + t.goalsAgainst, 0);

      return {
        player,
        displayName: player === 'ed' ? 'Ed' : 'AJ',
        totalPoints,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
        teamBreakdown: [...breakdown].sort(
          (a, b) => b.points - a.points || b.goalDifference - a.goalDifference
        ),
      } satisfies PlayerScore;
    }).sort(
      (a, b) => b.totalPoints - a.totalPoints || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor
    );
  }, [draftState, tournamentData]);
}
