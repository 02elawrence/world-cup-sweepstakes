import { useMemo } from 'react';
import type { TournamentData } from '../types';
import { API_ID_TO_TEAM_ID, TEAM_MAP } from '../data/teams';

// Pot 1 teams for this sweepstake: ARG, FRA, ESP, ENG, BRA, POR, NED, GER, BEL, CRO
const POT1_API_IDS = new Set([762, 773, 760, 770, 764, 765, 8601, 759, 805, 799]);

// Wildcard teams and their API IDs (apiId 0 = placeholder, can't be auto-detected)
const WILDCARD_API_IDS = new Set([
  1934, // DR Congo (COD)
  774,  // South Africa (RSA)
  840,  // Iran (IRI)
  1060, // Bosnia (BIH)
  798,  // Czechia (CZE)
  8062, // Iraq (IRQ)
  836,  // Haiti (HAI)
  9460, // Curaçao (CUW)
  // Honduras (HON, apiId 0) — no live data
  // Costa Rica (CRC, apiId 0) — no live data
]);

export const WILDCARD_TEAM_IDS = ['COD', 'RSA', 'IRI', 'BIH', 'CZE', 'IRQ', 'HAI', 'CUW', 'HON', 'CRC'];

export type WildcardAchievementType = 'beat_pot1' | 'reached_last16' | 'scored_3_vs_pot1';

export interface WildcardAchievement {
  teamId: string;
  teamName: string;
  teamFlag: string;
  type: WildcardAchievementType;
  detail: string;
}

export interface WildcardStatus {
  triggered: boolean;
  achievements: WildcardAchievement[];
  pot: number; // £50 if not triggered, split among 10 players if triggered
}

function teamLabel(apiId: number): { name: string; flag: string; id: string } {
  const teamId = API_ID_TO_TEAM_ID[apiId];
  const meta = teamId ? TEAM_MAP[teamId] : null;
  return { name: meta?.name ?? 'Unknown', flag: meta?.flag ?? '', id: teamId ?? '' };
}

export function useS2Wildcard(data: TournamentData): WildcardStatus {
  return useMemo(() => {
    const achievements: WildcardAchievement[] = [];
    const finished = data.fixtures.filter((f) => f.status === 'FINISHED');

    for (const f of finished) {
      const { home, away } = f.score.fullTime;
      if (home === null || away === null) continue;

      const hId = f.homeTeam.id;
      const aId = f.awayTeam.id;
      const hIsWild = WILDCARD_API_IDS.has(hId);
      const aIsWild = WILDCARD_API_IDS.has(aId);
      const hIsPot1 = POT1_API_IDS.has(hId);
      const aIsPot1 = POT1_API_IDS.has(aId);

      // Wildcard beats Pot 1
      if (hIsWild && aIsPot1 && home > away) {
        const wc = teamLabel(hId);
        const p1 = teamLabel(aId);
        achievements.push({
          teamId: wc.id,
          teamName: wc.name,
          teamFlag: wc.flag,
          type: 'beat_pot1',
          detail: `Beat ${p1.flag} ${p1.name} ${home}–${away}`,
        });
      }
      if (aIsWild && hIsPot1 && away > home) {
        const wc = teamLabel(aId);
        const p1 = teamLabel(hId);
        achievements.push({
          teamId: wc.id,
          teamName: wc.name,
          teamFlag: wc.flag,
          type: 'beat_pot1',
          detail: `Beat ${p1.flag} ${p1.name} ${away}–${home}`,
        });
      }

      // Wildcard scores 3+ vs Pot 1
      if (hIsWild && aIsPot1 && home >= 3) {
        const wc = teamLabel(hId);
        const p1 = teamLabel(aId);
        achievements.push({
          teamId: wc.id,
          teamName: wc.name,
          teamFlag: wc.flag,
          type: 'scored_3_vs_pot1',
          detail: `Scored ${home} vs ${p1.flag} ${p1.name}`,
        });
      }
      if (aIsWild && hIsPot1 && away >= 3) {
        const wc = teamLabel(aId);
        const p1 = teamLabel(hId);
        achievements.push({
          teamId: wc.id,
          teamName: wc.name,
          teamFlag: wc.flag,
          type: 'scored_3_vs_pot1',
          detail: `Scored ${away} vs ${p1.flag} ${p1.name}`,
        });
      }
    }

    // Wildcard reaches Last 16
    const last16 = data.fixtures.filter(
      (f) => f.stage === 'ROUND_OF_16' || f.stage === 'LAST_16'
    );
    const seenReached = new Set<number>();
    for (const f of last16) {
      for (const apiId of [f.homeTeam.id, f.awayTeam.id]) {
        if (WILDCARD_API_IDS.has(apiId) && !seenReached.has(apiId)) {
          seenReached.add(apiId);
          const wc = teamLabel(apiId);
          achievements.push({
            teamId: wc.id,
            teamName: wc.name,
            teamFlag: wc.flag,
            type: 'reached_last16',
            detail: 'Reached the Last 16',
          });
        }
      }
    }

    // Deduplicate by teamId + type (same achievement can appear in multiple matches)
    const seen = new Set<string>();
    const unique = achievements.filter((a) => {
      const key = `${a.teamId}:${a.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return {
      triggered: unique.length > 0,
      achievements: unique,
      pot: 50,
    };
  }, [data]);
}
