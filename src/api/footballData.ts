import type { TournamentData, GroupStanding, Fixture, Scorer } from '../types';

export const EMPTY_TOURNAMENT: TournamentData = {
  standings: [],
  fixtures: [],
  scorers: [],
  fetchedAt: null,
};

export async function fetchTournamentData(): Promise<TournamentData> {
  const res = await fetch('/api/tournament');
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json() as {
    fixtures: Fixture[];
    standings: GroupStanding[];
    scorers: Scorer[];
    fetchedAt: number;
    error?: string;
  };
  if (data.error) throw new Error(data.error);
  return data;
}
