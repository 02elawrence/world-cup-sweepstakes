import { useMemo } from 'react';
import type { S2DraftState, S2PlayerScore, S2PlayerId, S2TeamScore, TournamentData } from '../types';
import { TEAM_MAP } from '../data/teams';
import { S2_PLAYERS } from '../data/s2Players';
import { WILDCARD_TEAM_IDS } from './useS2Wildcard';
import type { WildcardStatus } from './useS2Wildcard';

// Stage ordering for display
const STAGE_ORDER: Record<string, number> = {
  GROUP_STAGE: 1,
  ROUND_OF_32: 2,
  LAST_32: 2,
  ROUND_OF_16: 3,
  LAST_16: 3,
  QUARTER_FINALS: 4,
  SEMI_FINALS: 5,
  FINAL: 6,
};

function stageLabel(stage: string): string {
  const map: Record<string, string> = {
    GROUP_STAGE: 'Group Stage',
    ROUND_OF_32: 'Rd of 32',
    LAST_32: 'Rd of 32',
    ROUND_OF_16: 'Last 16',
    LAST_16: 'Last 16',
    QUARTER_FINALS: 'Quarter-final',
    SEMI_FINALS: 'Semi-final',
    FINAL: 'Final',
  };
  return map[stage] ?? stage;
}

function resolveMatchWinner(
  homeScore: number,
  awayScore: number,
  penalties?: { home: number | null; away: number | null } | null
): 'home' | 'away' | null {
  if (homeScore > awayScore) return 'home';
  if (awayScore > homeScore) return 'away';
  if (penalties?.home !== null && penalties?.away !== null && penalties) {
    if ((penalties.home ?? 0) > (penalties.away ?? 0)) return 'home';
    return 'away';
  }
  return null;
}

export function useS2Leaderboard(
  draftState: S2DraftState,
  tournamentData: TournamentData,
  wildcardStatus: WildcardStatus
): S2PlayerScore[] {
  return useMemo(() => {
    if (draftState.phase !== 'complete') return [];

    const finished = tournamentData.fixtures.filter((f) => f.status === 'FINISHED');

    // Goals scored per API team ID across all finished fixtures
    const goalsMap = new Map<number, number>();
    for (const f of finished) {
      const { home, away } = f.score.fullTime;
      if (home === null || away === null) continue;
      goalsMap.set(f.homeTeam.id, (goalsMap.get(f.homeTeam.id) ?? 0) + home);
      goalsMap.set(f.awayTeam.id, (goalsMap.get(f.awayTeam.id) ?? 0) + away);
    }

    // Furthest stage each API team ID reached, and whether eliminated there
    const teamStageMap = new Map<number, { stage: string; eliminated: boolean }>();
    const processedStages = new Map<number, number>(); // apiId → highest stage order

    for (const f of tournamentData.fixtures) {
      const stageOrd = STAGE_ORDER[f.stage] ?? 0;
      const { home, away } = f.score.fullTime;

      for (const [apiId, isHome] of [[f.homeTeam.id, true], [f.awayTeam.id, false]] as [number, boolean][]) {
        const current = processedStages.get(apiId) ?? 0;
        if (stageOrd <= current) continue;
        processedStages.set(apiId, stageOrd);

        if (f.status !== 'FINISHED' || home === null || away === null) {
          // In progress or scheduled — team is still in this stage
          teamStageMap.set(apiId, { stage: f.stage, eliminated: false });
          continue;
        }

        const winner = resolveMatchWinner(home, away, f.score.penalties);
        let eliminated = false;
        if (f.stage !== 'GROUP_STAGE' && winner !== null) {
          // Knockout: loser is eliminated
          eliminated = isHome ? winner === 'away' : winner === 'home';
        }
        teamStageMap.set(apiId, { stage: f.stage, eliminated });
      }
    }

    // Champion and runner-up from the final
    let championApiId: number | null = null;
    let runnerUpApiId: number | null = null;
    const finalFixture = tournamentData.fixtures.find(
      (f) => f.stage === 'FINAL' && f.status === 'FINISHED'
    );
    if (finalFixture) {
      const { home, away } = finalFixture.score.fullTime;
      if (home !== null && away !== null) {
        const w = resolveMatchWinner(home, away, finalFixture.score.penalties);
        if (w === 'home') { championApiId = finalFixture.homeTeam.id; runnerUpApiId = finalFixture.awayTeam.id; }
        if (w === 'away') { championApiId = finalFixture.awayTeam.id; runnerUpApiId = finalFixture.homeTeam.id; }
      }
    }

    // Semi-final losers
    const semiLoserApiIds = new Set<number>();
    const semiFixtures = tournamentData.fixtures.filter(
      (f) => f.stage === 'SEMI_FINALS' && f.status === 'FINISHED'
    );
    for (const sf of semiFixtures) {
      const { home, away } = sf.score.fullTime;
      if (home === null || away === null) continue;
      const w = resolveMatchWinner(home, away, sf.score.penalties);
      if (w === 'home') semiLoserApiIds.add(sf.awayTeam.id);
      if (w === 'away') semiLoserApiIds.add(sf.homeTeam.id);
    }

    // Build player scores
    const playerGoalTotals: { player: S2PlayerId; total: number }[] = [];

    const scores: S2PlayerScore[] = S2_PLAYERS.map(({ id: player, name: displayName }) => {
      const teamIds = draftState.assignments[player] ?? [];

      const breakdown: S2TeamScore[] = teamIds.map((teamId) => {
        const meta = TEAM_MAP[teamId];
        if (!meta) return null;
        const apiId = meta.apiId;
        const goalsFor = apiId ? (goalsMap.get(apiId) ?? 0) : 0;
        const stageInfo = apiId ? (teamStageMap.get(apiId) ?? null) : null;
        return {
          teamId,
          teamName: meta.name,
          flag: meta.flag,
          goalsFor,
          isWildcard: WILDCARD_TEAM_IDS.includes(teamId),
          stage: stageInfo ? stageLabel(stageInfo.stage) : null,
          eliminated: stageInfo?.eliminated ?? false,
        } satisfies S2TeamScore;
      }).filter((t): t is S2TeamScore => t !== null);

      const totalGoals = breakdown.reduce((s, t) => s + t.goalsFor, 0);
      playerGoalTotals.push({ player, total: totalGoals });

      const teamApiIds = teamIds.map((id) => TEAM_MAP[id]?.apiId ?? 0);
      const isChampion = championApiId !== null && teamApiIds.includes(championApiId);
      const isRunnerUp = runnerUpApiId !== null && teamApiIds.includes(runnerUpApiId);
      const isSemiFinalist = teamApiIds.some((id) => id !== 0 && semiLoserApiIds.has(id));

      return {
        player,
        displayName,
        totalGoals,
        teamBreakdown: breakdown,
        prizes: {
          isChampion,
          isRunnerUp,
          isSemiFinalist,
          isMostGoals: false, // filled below
          prizeTotal: 0,      // filled below
        },
      } satisfies S2PlayerScore;
    });

    // Most goals winner(s)
    const maxGoals = Math.max(...playerGoalTotals.map((p) => p.total));
    const mostGoalsWinners = maxGoals > 0
      ? new Set(playerGoalTotals.filter((p) => p.total === maxGoals).map((p) => p.player))
      : new Set<S2PlayerId>();

    // Prize money per player
    for (const s of scores) {
      const isMostGoals = mostGoalsWinners.has(s.player);
      s.prizes.isMostGoals = isMostGoals;

      let total = 0;
      if (s.prizes.isChampion) {
        total += 100;
        if (!wildcardStatus.triggered) total += 50; // wildcard pot rolls to winner
      }
      if (s.prizes.isRunnerUp)     total += 40;
      if (s.prizes.isSemiFinalist) total += 20;
      if (isMostGoals)             total += Math.floor(20 / mostGoalsWinners.size);
      if (wildcardStatus.triggered) total += 5; // everyone gets £5

      s.prizes.prizeTotal = total;
    }

    // Sort: prize money desc → total goals desc
    return scores.sort(
      (a, b) => b.prizes.prizeTotal - a.prizes.prizeTotal || b.totalGoals - a.totalGoals
    );
  }, [draftState, tournamentData, wildcardStatus]);
}
