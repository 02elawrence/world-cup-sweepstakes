import type { Team } from '../types';

// 2026 FIFA World Cup — 48 teams
// fifaRank: approximate FIFA world ranking (June 2026) used for seeded group sweepstake.
// Tier 1 = ranks 1-12, Tier 2 = 13-24, Tier 3 = 25-36, Tier 4 = 37-48.
export const TEAMS: Team[] = [
  // Group A
  { id: 'MEX', name: 'Mexico',       flag: '🇲🇽', group: 'A', apiId: 769,  fifaRank: 18 },
  { id: 'KOR', name: 'South Korea',  flag: '🇰🇷', group: 'A', apiId: 772,  fifaRank: 19 },
  { id: 'CZE', name: 'Czechia',      flag: '🇨🇿', group: 'A', apiId: 798,  fifaRank: 30 },
  { id: 'RSA', name: 'South Africa', flag: '🇿🇦', group: 'A', apiId: 774,  fifaRank: 37 },

  // Group B
  { id: 'BIH', name: 'Bosnia-Herzegovina', flag: '🇧🇦', group: 'B', apiId: 1060, fifaRank: 39 },
  { id: 'CAN', name: 'Canada',       flag: '🇨🇦', group: 'B', apiId: 828,  fifaRank: 38 },
  { id: 'QAT', name: 'Qatar',        flag: '🇶🇦', group: 'B', apiId: 8030, fifaRank: 34 },
  { id: 'SUI', name: 'Switzerland',  flag: '🇨🇭', group: 'B', apiId: 788,  fifaRank: 13 },

  // Group C
  { id: 'BRA', name: 'Brazil',       flag: '🇧🇷', group: 'C', apiId: 764,  fifaRank: 5  },
  { id: 'HAI', name: 'Haiti',        flag: '🇭🇹', group: 'C', apiId: 836,  fifaRank: 46 },
  { id: 'MAR', name: 'Morocco',      flag: '🇲🇦', group: 'C', apiId: 815,  fifaRank: 10 },
  { id: 'SCO', name: 'Scotland',     flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C', apiId: 8873, fifaRank: 33 },

  // Group D
  { id: 'AUS', name: 'Australia',    flag: '🇦🇺', group: 'D', apiId: 779,  fifaRank: 21 },
  { id: 'PAR', name: 'Paraguay',     flag: '🇵🇾', group: 'D', apiId: 761,  fifaRank: 36 },
  { id: 'TUR', name: 'Turkey',       flag: '🇹🇷', group: 'D', apiId: 803,  fifaRank: 22 },
  { id: 'USA', name: 'United States',flag: '🇺🇸', group: 'D', apiId: 771,  fifaRank: 12 },

  // Group E
  { id: 'CUW', name: 'Curaçao',      flag: '🇨🇼', group: 'E', apiId: 9460, fifaRank: 48 },
  { id: 'GER', name: 'Germany',      flag: '🇩🇪', group: 'E', apiId: 759,  fifaRank: 8  },
  { id: 'ECU', name: 'Ecuador',      flag: '🇪🇨', group: 'E', apiId: 791,  fifaRank: 24 },
  { id: 'CIV', name: 'Ivory Coast',  flag: '🇨🇮', group: 'E', apiId: 1935, fifaRank: 28 },

  // Group F
  { id: 'JPN', name: 'Japan',        flag: '🇯🇵', group: 'F', apiId: 766,  fifaRank: 14 },
  { id: 'NED', name: 'Netherlands',  flag: '🇳🇱', group: 'F', apiId: 8601, fifaRank: 7  },
  { id: 'SWE', name: 'Sweden',       flag: '🇸🇪', group: 'F', apiId: 792,  fifaRank: 23 },
  { id: 'TUN', name: 'Tunisia',      flag: '🇹🇳', group: 'F', apiId: 802,  fifaRank: 31 },

  // Group G
  { id: 'EGY', name: 'Egypt',        flag: '🇪🇬', group: 'G', apiId: 825,  fifaRank: 29 },
  { id: 'BEL', name: 'Belgium',      flag: '🇧🇪', group: 'G', apiId: 805,  fifaRank: 9  },
  { id: 'IRI', name: 'Iran',         flag: '🇮🇷', group: 'G', apiId: 840,  fifaRank: 26 },
  { id: 'NZL', name: 'New Zealand',  flag: '🇳🇿', group: 'G', apiId: 783,  fifaRank: 47 },

  // Group H
  { id: 'CPV', name: 'Cape Verde',   flag: '🇨🇻', group: 'H', apiId: 1930, fifaRank: 42 },
  { id: 'SAU', name: 'Saudi Arabia', flag: '🇸🇦', group: 'H', apiId: 801,  fifaRank: 35 },
  { id: 'ESP', name: 'Spain',        flag: '🇪🇸', group: 'H', apiId: 760,  fifaRank: 3  },
  { id: 'URU', name: 'Uruguay',      flag: '🇺🇾', group: 'H', apiId: 758,  fifaRank: 15 },

  // Group I
  { id: 'FRA', name: 'France',       flag: '🇫🇷', group: 'I', apiId: 773,  fifaRank: 2  },
  { id: 'IRQ', name: 'Iraq',         flag: '🇮🇶', group: 'I', apiId: 8062, fifaRank: 41 },
  { id: 'NOR', name: 'Norway',       flag: '🇳🇴', group: 'I', apiId: 8872, fifaRank: 25 },
  { id: 'SEN', name: 'Senegal',      flag: '🇸🇳', group: 'I', apiId: 804,  fifaRank: 16 },

  // Group J
  { id: 'ALG', name: 'Algeria',      flag: '🇩🇿', group: 'J', apiId: 778,  fifaRank: 27 },
  { id: 'ARG', name: 'Argentina',    flag: '🇦🇷', group: 'J', apiId: 762,  fifaRank: 1  },
  { id: 'JOR', name: 'Jordan',       flag: '🇯🇴', group: 'J', apiId: 8049, fifaRank: 43 },
  { id: 'AUT', name: 'Austria',      flag: '🇦🇹', group: 'J', apiId: 816,  fifaRank: 20 },

  // Group K
  { id: 'COD', name: 'DR Congo',     flag: '🇨🇩', group: 'K', apiId: 1934, fifaRank: 40 },
  { id: 'COL', name: 'Colombia',     flag: '🇨🇴', group: 'K', apiId: 818,  fifaRank: 11 },
  { id: 'POR', name: 'Portugal',     flag: '🇵🇹', group: 'K', apiId: 765,  fifaRank: 6  },
  { id: 'UZB', name: 'Uzbekistan',   flag: '🇺🇿', group: 'K', apiId: 8070, fifaRank: 44 },

  // Group L
  { id: 'ENG', name: 'England',      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L', apiId: 770,  fifaRank: 4  },
  { id: 'GHA', name: 'Ghana',        flag: '🇬🇭', group: 'L', apiId: 763,  fifaRank: 32 },
  { id: 'CRO', name: 'Croatia',      flag: '🇭🇷', group: 'L', apiId: 799,  fifaRank: 17 },
  { id: 'PAN', name: 'Panama',       flag: '🇵🇦', group: 'L', apiId: 1836, fifaRank: 45 },

  // Sweepstake 2 — teams not in the main 48 (placeholders, apiId 0 = no live data)
  { id: 'CMR', name: 'Cameroon',     flag: '🇨🇲', group: '?', apiId: 0,    fifaRank: 99 },
  { id: 'HON', name: 'Honduras',     flag: '🇭🇳', group: '?', apiId: 0,    fifaRank: 99 },
  { id: 'CRC', name: 'Costa Rica',   flag: '🇨🇷', group: '?', apiId: 0,    fifaRank: 99 },
];

export const TEAM_MAP: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.id, t])
);

export const API_ID_TO_TEAM_ID: Record<number, string> = Object.fromEntries(
  TEAMS.map((t) => [t.apiId, t.id])
);
