export type PlayerId = 'ed' | 'aj';

export type GroupPlayerId =
  | 'ted' | 'char' | 'steph' | 'jamie' | 'jack' | 'millie'
  | 'tom' | 'freaks' | 'sam' | 'ali' | 'dave' | 'theo';

export type S2PlayerId =
  | 'jake' | 'makin' | 'quinn' | 'guthrie' | 'ted'
  | 'dawson' | 'johnson' | 'bass' | 'somerset' | 'francis';

export interface Team {
  id: string;
  name: string;
  flag: string;
  group: string;
  apiId: number;
  fifaRank: number;
}

export type DraftPhase = 'idle' | 'coin_flip' | 'picking' | 'complete';

export interface DraftPick {
  teamId: string;
  player: PlayerId;
  pickNumber: number;
}

export interface DraftState {
  phase: DraftPhase;
  firstPicker: PlayerId | null;
  picks: DraftPick[];
  currentPickNumber: number;
}

export interface GoalEvent {
  minute: number;
  injuryTime: number | null;
  type: 'REGULAR' | 'OWN_GOAL' | 'PENALTY';
  team: { id: number; name: string };
  scorer: { id: number; name: string } | null;
  assist: { id: number; name: string } | null;
}

export interface Fixture {
  id: number;
  homeTeam: { id: number; name: string; crest?: string };
  awayTeam: { id: number; name: string; crest?: string };
  score: {
    fullTime: { home: number | null; away: number | null };
    penalties?: { home: number | null; away: number | null };
  };
  status: 'SCHEDULED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'TIMED' | 'POSTPONED';
  stage: string;
  group: string | null;
  utcDate: string;
  goals?: GoalEvent[];
}

export interface Standing {
  team: { id: number; name: string; crest?: string };
  position: number;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface GroupStanding {
  group: string;
  table: Standing[];
}

export interface Scorer {
  player: { name: string };
  team: { id: number; name: string };
  goals: number;
  assists: number | null;
  penalties: number | null;
}

export interface TournamentData {
  standings: GroupStanding[];
  fixtures: Fixture[];
  scorers: Scorer[];
  fetchedAt: number | null;
}

export interface TeamScore {
  teamId: string;
  teamName: string;
  flag: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  isChampion: boolean;
}

export interface PlayerScore {
  player: PlayerId;
  displayName: string;
  totalPoints: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  teamBreakdown: TeamScore[];
}

export interface GroupDraftState {
  phase: 'idle' | 'complete';
  assignments: Partial<Record<GroupPlayerId, string[]>>;
}

export interface S2DraftState {
  phase: 'idle' | 'complete';
  assignments: Partial<Record<S2PlayerId, string[]>>;
}

export interface S2TeamScore {
  teamId: string;
  teamName: string;
  flag: string;
  goalsFor: number;
  isWildcard: boolean;
  stage: string | null;
  eliminated: boolean;
}

export interface S2PlayerScore {
  player: S2PlayerId;
  displayName: string;
  totalGoals: number;
  teamBreakdown: S2TeamScore[];
  prizes: {
    isChampion: boolean;
    isRunnerUp: boolean;
    isSemiFinalist: boolean;
    isMostGoals: boolean;
    prizeTotal: number;
  };
}

export interface GroupPlayerScore {
  player: GroupPlayerId;
  displayName: string;
  totalPoints: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  teamBreakdown: TeamScore[];
}
