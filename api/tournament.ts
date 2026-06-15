import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASE = 'https://api.football-data.org/v4';
const KEY = process.env.VITE_FOOTBALL_API_KEY ?? '';
const HEADERS = { 'X-Auth-Token': KEY };

async function apiFetch(path: string) {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const [matchesData, standingsData, scorersData] = await Promise.all([
      apiFetch('/competitions/WC/matches'),
      apiFetch('/competitions/WC/standings'),
      apiFetch('/competitions/WC/scorers?limit=20'),
    ]);

    const standings = (standingsData.standings ?? []).map((s: Record<string, unknown>) => ({
      group: (s.group ?? s.stage ?? 'GROUP') as string,
      table: s.table,
    }));

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.json({
      fixtures: matchesData.matches ?? [],
      standings,
      scorers: scorersData.scorers ?? [],
      fetchedAt: Date.now(),
    });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : 'fetch failed' });
  }
}
