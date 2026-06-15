import { useEffect, useState, useCallback } from 'react';
import type { TournamentData } from '../types';
import { fetchTournamentData, EMPTY_TOURNAMENT } from '../api/footballData';
import { load, save, clear } from '../store/storage';

const CACHE_KEY = 'wcs_tournament_cache';
const STALE_MS = 2 * 60 * 1000;

function isStale(data: TournamentData): boolean {
  if (!data.fetchedAt) return true;
  return Date.now() - data.fetchedAt > STALE_MS;
}

function hasLiveMatch(data: TournamentData): boolean {
  return data.fixtures.some((f) => f.status === 'IN_PLAY' || f.status === 'PAUSED');
}

export function useTournament() {
  const [data, setData] = useState<TournamentData>(() =>
    load<TournamentData>(CACHE_KEY, EMPTY_TOURNAMENT)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (force = false) => {
    const cached = load<TournamentData>(CACHE_KEY, EMPTY_TOURNAMENT);
    if (!force && !isStale(cached) && cached.fixtures.length > 0) {
      setData(cached);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const next = await fetchTournamentData();
      setData(next);
      save(CACHE_KEY, next);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load data';
      setError(msg);
      if (cached.fixtures.length > 0) setData(cached);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = load<TournamentData>(CACHE_KEY, EMPTY_TOURNAMENT);
    refresh(cached.fixtures.length === 0);
  }, [refresh]);

  // Poll every 60s during live matches, 3 min otherwise
  useEffect(() => {
    const interval = hasLiveMatch(data) ? 60_000 : 3 * 60_000;
    const id = setInterval(() => refresh(true), interval);
    return () => clearInterval(id);
  }, [data, refresh]);

  const clearCache = useCallback(() => {
    clear(CACHE_KEY);
    refresh(true);
  }, [refresh]);

  return { data, loading, error, refresh: () => refresh(true), clearCache };
}
